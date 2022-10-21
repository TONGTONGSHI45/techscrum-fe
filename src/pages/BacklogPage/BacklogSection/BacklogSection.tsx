import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GoPlus } from 'react-icons/go';
import Button from '../../../components/Button/Button';
import TaskTypeSelect from '../../../components/Select/TaskTypeSelect/TaskTypeSelect';
import TaskItem from '../TaskItem/TaskItem';
import styles from './BacklogSection.module.scss';
// WIP more function will be added

export default function BacklogSection() {
  const dummyTaskList = [
    {
      id: 'TEC-315',
      title: 'Task 1',
      type: 'story',
      status: 'TO DO',
      priority: 'Medium'
    },
    {
      id: 'TEC-316',
      title: 'Task 2',
      type: 'bug',
      status: 'TO DO',
      priority: 'Medium'
    },
    {
      id: 'TEC-317',
      title: 'Task 3',
      type: 'task',
      status: 'TO DO',
      priority: 'Medium'
    }
  ];

  const [showBacklogInput, setShowBacklogInput] = useState(false);
  const [backlogInputFocus, setBacklogInputFocus] = useState(false);
  const [currentTypeOption, setCurrentTypeOption] = useState('story');

  const [editId, setEditId] = useState('-1');
  const [taskList, setTaskList] = useState(dummyTaskList);

  const backlogFormRef = useRef<HTMLFormElement | null>(null);
  const createIssueRef = useRef<HTMLInputElement | null>(null);

  const createIssueAction = useCallback(() => {
    if (createIssueRef?.current?.value) {
      const id = 'TEC-'.concat((+taskList[taskList.length - 1].id.split('-')[1] + 1).toString());
      setTaskList([
        ...taskList,
        {
          id,
          title: createIssueRef?.current?.value,
          type: currentTypeOption,
          status: 'TO DO',
          priority: 'Medium'
        }
      ]);
      setCurrentTypeOption('story');
    }
    setShowBacklogInput(false);
  }, [currentTypeOption, taskList]);

  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (backlogInputFocus && !backlogFormRef.current?.contains(e.target as HTMLElement)) {
        createIssueAction();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [backlogInputFocus, createIssueAction, taskList]);

  const onClickEditId = (id: string) => {
    setEditId(id);
  };

  const onChangeTitle = (id: string, title: string) => {
    const updatedTaskList = taskList.map((task) => {
      if (task.id === id) {
        return {
          ...task,
          title
        };
      }
      return task;
    });
    setTaskList(updatedTaskList);
  };

  const onKeyDownCreateIssue = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      createIssueAction();
    }
  };
  const getCurrentTypeOption = (type: string) => {
    setCurrentTypeOption(type);
  };
  const onClickChangeStatus = (id: string, status: string) => {
    const updatedTaskList = taskList.map((task) => {
      if (task.id === id) {
        return { ...task, status };
      }
      return task;
    });
    setTaskList(updatedTaskList);
  };
  const onClickChangePriority = (id: string, priority: string) => {
    const updatedTaskList = taskList.map((task) => {
      if (task.id === id) {
        return { ...task, priority };
      }
      return task;
    });
    setTaskList(updatedTaskList);
  };
  const onClickDelete = (id: string) => {
    const updatedTaskList = taskList.filter((task) => task.id !== id);
    setTaskList(updatedTaskList);
  };
  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <div className={styles.heading}>
          <h1>Backlog</h1>
          <div className={styles.issueCount}>{taskList.length} issues</div>
        </div>
        <div className={styles.toolbar}>
          <Button>Create sprint</Button>
        </div>
      </div>
      <div className={styles.listContainer}>
        {taskList.map((task) => {
          return (
            <TaskItem
              taskTitle={task.title}
              key={task.id}
              id={task.id}
              editMode={editId === task.id}
              onClickEditId={onClickEditId}
              onChangeTitle={onChangeTitle}
              type={task.type}
              status={task.status}
              onClickChangeStatus={onClickChangeStatus}
              priority={task.priority}
              onClickChangePriority={onClickChangePriority}
              onClickDelete={onClickDelete}
            />
          );
        })}
      </div>
      {showBacklogInput ? (
        <form ref={backlogFormRef}>
          <div className={styles.formField}>
            <TaskTypeSelect onChangeType={getCurrentTypeOption} />
            <input
              className={styles.input}
              type="text"
              name="newBacklog"
              id="newBacklog"
              onFocus={() => {
                setBacklogInputFocus(true);
              }}
              ref={createIssueRef}
              onKeyDown={onKeyDownCreateIssue}
            />
          </div>
        </form>
      ) : (
        <Button
          icon={<GoPlus />}
          overrideStyle={styles.buttonRow}
          onClick={() => setShowBacklogInput(true)}
        >
          Create issue
        </Button>
      )}
    </section>
  );
}
