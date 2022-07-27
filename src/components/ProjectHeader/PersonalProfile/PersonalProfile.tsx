import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { BsBoxArrowUpRight } from 'react-icons/bs';
import styles from './PersonalProfile.module.scss';
import useOutsideAlerter from '../../../hooks/OutsideAlerter';
import { IUserInfo } from '../../../types';
import avatarImg from '../../../assets/userAvatar.png';
import { UserDispatchContext } from '../../../context/UserInfoProvider';
import checkAccess from '../../../utils/helpers';

interface Props {
  userInfo: IUserInfo;
}

export default function PersonalProfile({ userInfo }: Props) {
  const { visible, setVisible, myRef } = useOutsideAlerter(false);
  const handleClickOutside = (state: boolean) => setVisible(!state);
  const setUserInfo = useContext(UserDispatchContext);

  const logout = () => {
    localStorage.clear();
    setUserInfo({});
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
                    <img src={userInfo?.avatarIcon || avatarImg} alt="avatar" />
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
                      <img
                        src={userInfo?.avatarIcon || avatarImg}
                        alt="avatar"
                        className={styles.avatarIcon}
                      />
                      <div className={styles.userContext}>
                        <p>{userInfo.name}</p>
                        <p>{userInfo.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className={styles.settingDetails}>
                    <div className={styles.detail}>
                      {checkAccess('view:roles', '62dfdaeca322ef2389f9895d') && (
                        <Link to="/roles">
                          <div className={styles.title}>
                            <span>Roles</span>
                          </div>
                        </Link>
                      )}
                      <a href="/me">
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
                  <img src={userInfo?.avatarIcon || avatarImg} alt="avatar" />
                </span>
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
