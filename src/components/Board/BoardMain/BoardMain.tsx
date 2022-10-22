/* eslint-disable react/jsx-no-useless-fragment */
import React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { IColumnsFromBackend } from '../../../types';
import Loading from '../../Loading/Loading';
import styles from './BoardMain.module.scss';
import checkAccess from '../../../utils/helpers';

interface Props {
  columnsInfo: IColumnsFromBackend;
  onDragEventHandler: (result: DropResult) => boolean | void | null;
  passTaskId: (itemId: string) => void;
  updateIsCreateNewCard: () => void;
  projectId: string;
}

export default function BoardMain({
  columnsInfo,
  onDragEventHandler,
  passTaskId,
  updateIsCreateNewCard,
  projectId
}: Props) {
  if (!columnsInfo || Object.keys(columnsInfo).length === 0) {
    return <Loading />;
  }
  return (
    <div className={styles.boardMainContainer}>
      <DragDropContext
        onDragEnd={(result) => {
          onDragEventHandler(result);
        }}
      >
        {Object.entries(columnsInfo).map(([id, column]) => {
          return (
            <div key={id} className={styles.columnsContainer}>
              <Droppable droppableId={id} key={id}>
                {(provided) => {
                  return (
                    <div
                      /* eslint-disable react/jsx-props-no-spreading */
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={styles.column}
                    >
                      <div className={styles.columnInfo}>
                        <h1 className={styles.name} data-testid={`board-col-${id}`}>
                          {column.name}
                        </h1>
                        <h1 className={styles.taskNum}>{column.items.length}</h1>
                      </div>
                      {column.items.map((item, index) => {
                        return (
                          <Draggable key={item.id} draggableId={item.id ?? ''} index={index}>
                            {(provided2) => {
                              return (
                                <div
                                  className={styles.card}
                                  ref={provided2.innerRef}
                                  {...provided2.dragHandleProps}
                                  {...provided2.draggableProps}
                                  aria-hidden="true"
                                  onClick={() => {
                                    passTaskId(item.id ?? '');
                                  }}
                                  data-testid={`task-${item.id}`}
                                >
                                  <span>
                                    {' '}
                                    {item.tags?.map((tag) => {
                                      return (
                                        <div className={styles.tag} key={tag.id}>
                                          <h1>{tag.name}</h1>
                                        </div>
                                      );
                                    })}
                                  </span>
                                  <p>{item.title ?? ''}</p>
                                  <div className={styles.cardFooter}>
                                    <div className={styles.cardFooterLeft}>
                                      <span>
                                        Due Date:{' '}
                                        {item.dueAt?.toString().split('T')[0].split('-')[2]}/
                                        {item.dueAt?.toString().split('T')[0].split('-')[1]}/
                                        {item.dueAt?.toString().split('T')[0].split('-')[0]}
                                      </span>
                                    </div>
                                    <div className={styles.cardFooterRight}>
                                      <img
                                        src={
                                          item !== undefined && item.assignInfo !== undefined
                                            ? item.assignInfo.avatarIcon ??
                                              'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__480.png'
                                            : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__480.png'
                                        }
                                        alt="avatar"
                                        className={styles.avatorIcon}
                                      />
                                    </div>
                                  </div>
                                </div>
                              );
                            }}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                      {checkAccess('add:tasks', projectId) && (
                        <div
                          className={[
                            styles.card,
                            styles.cardAddNewCard,
                            styles.cardAddNewCardHide
                          ].join(' ')}
                          onClick={updateIsCreateNewCard}
                          onKeyDown={updateIsCreateNewCard}
                          role="button"
                          tabIndex={0}
                        >
                          <p>+ Add Task</p>
                        </div>
                      )}
                    </div>
                  );
                }}
              </Droppable>
            </div>
          );
        })}
      </DragDropContext>
      <div className={[styles.columnsContainer, styles.lastColumnContainer].join(' ')}>
        <span>+ Add Columns</span>
      </div>
    </div>
  );
}
