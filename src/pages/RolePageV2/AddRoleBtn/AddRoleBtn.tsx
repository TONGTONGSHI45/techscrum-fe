import React, { useState } from 'react';
import { GrAdd } from 'react-icons/gr';
import styles from './AddRoleBtn.module.scss';

interface IAddRoleBtn {
  addRole: () => void;
}

function AddRoleBtn(props: IAddRoleBtn) {
  const { addRole } = props;
  const [isShown, setIsShown] = useState(false);
  // const [newRole, setNewRole] = useState('');
  // const [popupWindow, setPopupWindow] = useState(false);

  const buttonNotice = isShown && (
    <div className={styles['notice-container']}>
      <p>Create New Role</p>
    </div>
  );

  const addRoleHandler = () => {
    // setPopupWindow(false);
    addRole();
  };

  // const popupLayout = popupWindow && (
  //   <div className={styles['popup-window']}>
  //     <input name="roleName" onChange={(e) => setNewRole(e.target.value)} />
  //     <button onClick={addRoleHandler}>
  //       <GrFormCheckmark />
  //     </button>
  //     <button onClick={() => setPopupWindow(false)}>
  //       <GrFormClose />
  //     </button>
  //   </div>
  // );

  return (
    <div>
      <div className={styles['addBtn-container']}>
        <button
          className={styles.addBtn}
          onClick={addRoleHandler}
          onMouseEnter={() => setIsShown(true)}
          onMouseLeave={() => setIsShown(false)}
        >
          <GrAdd />
        </button>
        {buttonNotice}
      </div>
      {/* {popupLayout} */}
    </div>
  );
}

export default AddRoleBtn;
