import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BsBoxArrowUpRight } from 'react-icons/bs';
import styles from './PersonalProfile.module.scss';
import useOutsideAlerter from '../../../hooks/OutsideAlerter';
import { IUserInfo } from '../../../types';
import avatarImg from '../../../assets/userAvatar.png';
import { UserDispatchContext } from '../../../context/UserInfoProvider';

interface Props {
  userInfo: IUserInfo;
}

export default function PersonalProfile({ userInfo }: Props) {
  const { visible, setVisible, myRef } = useOutsideAlerter(false);
  const handleClickOutside = (state: boolean) => setVisible(!state);
  const setUserInfo = useContext(UserDispatchContext);
  const navigator = useNavigate();

  const logout = () => {
    localStorage.clear();
    setUserInfo({});
    navigator('/');
  };
  return (
    <div ref={myRef}>
      <div className={styles.rightSection} key={userInfo.id}>
        {visible ? (
          <>
            <div className={styles.avatarSection}>
              <button type="button" onClick={() => handleClickOutside(true)}>
                <div className={styles.avatarContent}>
                  <span>
                    <img src={avatarImg} alt="avatar" />
                  </span>
                </div>
              </button>
            </div>
            <div className={styles.settingDropdown}>
              <div className={styles.settingContainer}>
                <div className={styles.settingContent}>
                  <div className={styles.settingTop}>
                    <h1>Account</h1>
                    <div className={styles.accountContent}>
                      <img src={avatarImg} alt="avatar" />
                      <div className={styles.userContext}>
                        <p>{userInfo.name}</p>
                        <p>{userInfo.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className={styles.settingDetails}>
                    <div className={styles.detail}>
                      <a href="/user-page">
                        <div className={styles.title}>
                          <span>Profile</span>
                        </div>
                      </a>
                      <a href="/account-settings">
                        <div className={styles.title}>
                          <span>Account settings</span>
                        </div>
                        <div className={styles.iconSection}>
                          <div className={styles.icon}>
                            <BsBoxArrowUpRight />
                          </div>
                        </div>
                      </a>
                    </div>
                  </div>
                  <div className={styles.settingBottom}>
                    <Link to="/#" className={styles.logOutSection} onClick={logout}>
                      <div className={styles.logOutContainer}>
                        <span>Log out</span>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className={styles.avatarSection}>
            <button type="button" onClick={() => handleClickOutside(false)}>
              <div className={styles.avatarContent}>
                <span>
                  <img src={avatarImg} alt="avatar" />
                </span>
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
