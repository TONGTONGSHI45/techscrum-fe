import React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { IColumnsFromBackend } from '../../../types';
import style from './BoardMain.module.scss';

interface Props {
  columnsInfo: IColumnsFromBackend;
  onDragEventHandler: (result: DropResult) => boolean | void | null;
}

export default function BoardMain({ columnsInfo, onDragEventHandler }: Props) {
  return (
    <div className={style.container}>
      <DragDropContext
        onDragEnd={(result) => {
          onDragEventHandler(result);
        }}
      >
        {Object.entries(columnsInfo).map(([id, column]) => {
          return (
            <div key={id} className={style.columnsContainer}>
              <Droppable droppableId={id} key={id}>
                {(provided) => {
                  return (
                    <div
                      /* eslint-disable react/jsx-props-no-spreading */
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={style.column}
                    >
                      <div className={style.name}>
                        {column.name} {column.items.length}{' '}
                        {column.items.length > 1 ? 'issues' : 'issue'}
                      </div>
                      {column.items.map((item, index) => {
                        return (
                          <Draggable key={item.id} draggableId={item.id} index={index}>
                            {(provided2) => {
                              return (
                                <div
                                  className={style.card}
                                  ref={provided2.innerRef}
                                  {...provided2.dragHandleProps}
                                  {...provided2.draggableProps}
                                >
                                  <span> {item.title}</span>
                                  <div className={style.cardFooter}>
                                    <div className={style.cardFooterLeft}>
                                      <img
                                        src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__480.png"
                                        alt="Story"
                                      />
                                      <span>{item.tag}</span>
                                    </div>
                                    <div className={style.cardFooterRight}>
                                      <img
                                        src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__480.png"
                                        alt="avatar"
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
                    </div>
                  );
                }}
              </Droppable>
            </div>
          );
        })}
      </DragDropContext>
    </div>
  );
}