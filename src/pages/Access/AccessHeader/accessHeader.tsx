import React from 'react';
import style from './accessHeader.module.scss';
import HeaderNav from './AccessHeaderNav/accessHeaderNav';

interface ModalStateClick {
  modalStateClick: () => void;
}

export default function AccessHeader({ modalStateClick }: ModalStateClick) {
  return (
    <>
      <HeaderNav />
      <div className={style.container}>
        <div className={style.containerLeft}>
          <h1>Access</h1>
        </div>
        <div className={style.containerRight}>
          <div className={style.addPeopleContainer}>
            <button type="button" onClick={modalStateClick}>
              <span>Add people</span>
            </button>
          </div>
          <div className={style.manageRolesContainer}>
            <button type="button">
              <span>Manage roles</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
