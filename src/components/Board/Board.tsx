/* eslint-disable no-restricted-syntax */
import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { DropResult } from 'react-beautiful-dnd';
import { toast } from 'react-toastify';
import style from './Board.module.scss';
import BoardSearch from './BoardSearch/BoardSearch';
import BoardMain from './BoardMain/BoardMain';
import CreateNewCard from '../CreateNewCard/CreateNewCard';
import { getBoard } from '../../api/board/board';
import { updateTaskStatus, fetchTask, updateTask, removeTask } from '../../api/task/task';
import IBoardEntity, {
  IColumnsFromBackend,
  ICardData,
  ILabelData,
  ITaskCard,
  ITaskEntity
} from '../../types';
import BoardCard from '../BoardCard/BoardCard';
import { getLabels } from '../../api/label/label';
import { deleteActivity } from '../../api/activity/activity';
import ProjectNavigationV3 from '../../lib/ProjectNavigationV3/ProjectNavigationV3';
import Modal from '../../lib/Modal/Modal';
import DefaultModalHeader from '../../lib/Modal/ModalHeader/DefaultModalHeader/DefaultModalHeader';
import { getUsers } from '../../api/user/user';

const onDragEnd = (
  result: DropResult,
  columns: IColumnsFromBackend,
  setColumns: (arg0: IColumnsFromBackend) => void
) => {
  if (!result.destination) return null;
  const { source, destination } = result;

  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);
    removed.statusId = destination.droppableId;
    destItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems
      },
      [destination.droppableId]: {
        ...destColumn,
        items: destItems
      }
    });
    updateTaskStatus(result.draggableId, destination.droppableId);
    return true;
  }

  const column = columns[source.droppableId];
  const copiedItems = [...column.items];
  const [removed] = copiedItems.splice(source.index, 1);
  copiedItems.splice(destination.index, 0, removed);
  setColumns({
    ...columns,
    [source.droppableId]: {
      ...column,
      items: copiedItems
    }
  });
  updateTaskStatus(result.draggableId, source.droppableId);
  return true;
};

export default function Board() {
  const [inputQuery, setInputQuery] = useState<string>('');
  const [columnsInfo, setColumnsInfo] = useState<IColumnsFromBackend>({});
  const { boardId = '', projectId = '' } = useParams();
  const [isCreateNewCard, setIsCreateNewCard] = useState(false);
  const [isViewTask, setIsViewTask] = useState(false);
  const [taskData, setTaskData] = useState<ITaskEntity>();
  const [labels, setLabels] = useState<ILabelData[]>([]);
  const [loading, setLoading] = useState(false);
  const [userList, setUserList] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);

  const chaneSelectedUsers = (isExist, user) => {
    if (!isExist) {
      setSelectedUsers([...selectedUsers, user]);
    } else {
      setSelectedUsers(selectedUsers.filter((selectedUser) => selectedUser.id !== user.id));
    }
  };

  const getProjectDataApi = useCallback(() => {
    const getProjectData = async () => {
      try {
        const res = await getUsers();
        setUserList(res.data);
      } catch (e) {
        toast.error('Temporary Server Error. Try Again.', { theme: 'colored' });
      }
    };
    getProjectData();
  }, []);

  useEffect(() => {
    getProjectDataApi();
  }, [getProjectDataApi]);

  const fetchColumnsData = useCallback(
    (boardInfo: IBoardEntity) => {
      const columnInfoData: IColumnsFromBackend = {};

      const taskListFilter = (taskList, userInput, queryInput) => {
        return taskList.filter((task) => {
          if (!queryInput && userInput.length === 0) {
            return true;
          }
          if (task.assignId === null) {
            return false;
          }
          return (
            (queryInput === 0 || task.title?.toLowerCase().includes(queryInput.toLowerCase())) &&
            (userInput.length === 0 ||
              userInput.some((selectedUser) => selectedUser.id === task.assignId.id))
          );
        });
      };

      for (const item of boardInfo.taskStatus) {
        columnInfoData[item.id] = {
          name: item.name,
          slug: item.slug,
          order: item.order,
          items: taskListFilter(item.taskList, selectedUsers, inputQuery)
        };
      }
      return setColumnsInfo(columnInfoData);
    },
    [inputQuery, selectedUsers]
  );
  const fetchBoardInfo = useCallback(() => {
    const fetchBoard = async () => {
      setLoading(true);
      const boardInfo = await getBoard(boardId);
      fetchColumnsData(boardInfo);
      setLoading(false);
    };
    fetchBoard();
  }, [boardId, fetchColumnsData]);

  useEffect(() => {
    fetchBoardInfo();
  }, [inputQuery, boardId, fetchColumnsData, fetchBoardInfo]);

  useEffect(() => {
    if (!projectId || projectId === '') {
      return;
    }
    getLabels(projectId).then((res) => {
      setLabels(res.data);
    });
  }, [projectId]);

  const getCreateNewCardStateFromChildren = () => {
    setIsCreateNewCard(!isCreateNewCard);
  };

  const getViewTaskStateFromChildren = () => {
    setIsViewTask(!isViewTask);
    fetchBoardInfo();
  };

  const getTaskId = async (itemId: string) => {
    const res = await fetchTask(itemId);
    if (res.status !== 200) {
      return;
    }
    setTaskData(res.data);
    getViewTaskStateFromChildren();
  };

  const fetchNewCard = (newCard: ICardData) => {
    getCreateNewCardStateFromChildren();
    const now = new Date();
    const newItem: ITaskCard = {
      id: newCard.id,
      tags: newCard.tags,
      title: newCard.title,
      statusId: newCard.statusId,
      dueAt: now.toISOString()
    };
    const columns = columnsInfo;
    columns[newCard.statusId.id].items.push(newItem);
    setColumnsInfo(columns);
  };

  const dragEventHandler = (result: DropResult) => {
    return onDragEnd(result, columnsInfo, setColumnsInfo);
  };

  const showUpdatedTask = (updatedTaskInfo: any) => {
    const updatedColumns = { ...columnsInfo };
    if (updatedTaskInfo?.statusId && taskData?.statusId) {
      columnsInfo[taskData.statusId].items.forEach((item, index) => {
        if (
          item.id === updatedTaskInfo.id &&
          updatedTaskInfo.title !== undefined &&
          updatedTaskInfo.title != null &&
          item.statusId !== undefined &&
          updatedTaskInfo.statusId !== undefined
        ) {
          const updatedStatusId = updatedTaskInfo.statusId;
          const updatedItem = { ...item, ...updatedTaskInfo };
          if (updatedStatusId === item.statusId) {
            updatedColumns[item.statusId].items[index] = updatedItem;
            return;
          }
          updatedColumns[item.statusId].items.splice(index, 1);
          updatedColumns[updatedStatusId].items.push(updatedItem);
        }
      });
    }
    setColumnsInfo(updatedColumns);
    setTaskData(updatedTaskInfo);
  };

  const updateTaskInfo = async (newTaskInfo: ITaskEntity) => {
    try {
      const updatedNewTaskInfo = JSON.parse(JSON.stringify(newTaskInfo));
      updatedNewTaskInfo.status = newTaskInfo.status.id;
      updatedNewTaskInfo.typeId = newTaskInfo.typeId.id;
      updatedNewTaskInfo.reporterId = newTaskInfo.reporterId;
      updatedNewTaskInfo.sprintId = newTaskInfo.sprintId ? newTaskInfo.sprintId.id : null;
      if (updatedNewTaskInfo.id !== undefined) {
        await updateTask(updatedNewTaskInfo.id, updatedNewTaskInfo);
        showUpdatedTask(updatedNewTaskInfo);
      }
    } catch (e) {
      getViewTaskStateFromChildren();
    }
  };

  const updasteTaskInfo = (tags: ILabelData[] | undefined) => {
    if (tags === undefined) return;
    const updatedTaskInfo = { ...taskData, tags };
    showUpdatedTask(updatedTaskInfo);
  };

  const deleteTask = async () => {
    if (taskData?.id ?? taskData?.id) {
      try {
        await removeTask(taskData.id);
      } finally {
        getViewTaskStateFromChildren();
        const updatedColumns = { ...columnsInfo };
        const task = { ...taskData, statusId: taskData.status.id };
        if (task.statusId !== undefined) {
          columnsInfo[task.statusId].items.forEach((item, index) => {
            if (item.statusId !== undefined && item.id === task.id) {
              updatedColumns[item.statusId].items.splice(index, 1);
            }
          });
          await deleteActivity(taskData.id);
        }
        fetchBoardInfo();
        setTaskData(undefined);
      }
    }
  };

  return (
    <div className={style.container}>
      <h1 className={style.header}>Board</h1>
      <ProjectNavigationV3 />
      <BoardSearch
        updateIsCreateNewCard={getCreateNewCardStateFromChildren}
        setInputQuery={setInputQuery}
        projectId={projectId}
        selectedUsers={selectedUsers}
        changeSelectedUsers={chaneSelectedUsers}
        userList={userList}
      />
      <BoardMain
        columnsInfo={columnsInfo}
        onDragEventHandler={dragEventHandler}
        passTaskId={getTaskId}
        updateIsCreateNewCard={getCreateNewCardStateFromChildren}
        projectId={projectId}
        loading={loading}
      />
      {isCreateNewCard && (
        <Modal classesName="clear">
          <DefaultModalHeader
            title="Create Card"
            onClickClose={() => {
              setIsCreateNewCard(false);
            }}
          />
          <CreateNewCard
            fetchNewCard={fetchNewCard}
            updateIsCreateNewCard={getCreateNewCardStateFromChildren}
          />
        </Modal>
      )}
      {isViewTask && (
        <BoardCard
          updateIsViewTask={getViewTaskStateFromChildren}
          taskData={taskData}
          onSave={updateTaskInfo}
          columnsInfo={columnsInfo}
          deleteTask={deleteTask}
          labels={labels}
          projectId={projectId}
          updateTaskTags={updasteTaskInfo}
        />
      )}
    </div>
  );
}
