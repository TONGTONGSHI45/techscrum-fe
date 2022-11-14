/* eslint-disable no-console */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, createRef, useEffect, useContext } from 'react';
import {
  AiFillStar,
  AiOutlineCalendar,
  AiOutlineFolderOpen,
  AiOutlineSearch,
  AiOutlineStar,
  AiOutlineUser
} from 'react-icons/ai';
import { HiDotsHorizontal } from 'react-icons/hi';
import { Link, useNavigate } from 'react-router-dom';
import { AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import { BsPeople } from 'react-icons/bs';
import { VscChecklist } from 'react-icons/vsc';
import { TbReportSearch } from 'react-icons/tb';
import { IoIosAdd } from 'react-icons/io';
import { FiSettings } from 'react-icons/fi';
import ReactDOM from 'react-dom';
import { MdList, MdLogout } from 'react-icons/md';
import styles from './ProjectPage.module.scss';
import { createProject, deleteProject, updateProject } from '../../api/projects/projects';
import CreateNewCard from '../../components/CreateNewCard/CreateNewCard';
import { IProject, IProjectData } from '../../types';
import { ProjectContext, ProjectDispatchContext } from '../../context/ProjectProvider';
import checkAccess, { clickedShowMore } from '../../utils/helpers';
import Modal from '../../components/Modal/Modal';
import ProjectEditor from '../../components/ProjectEditor/ProjectEditor';
import DefaultModalHeader from '../../components/Modal/ModalHeader/DefaultModalHeader/DefaultModalHeader';
import DefaultModalBody from '../../components/Modal/ModalBody/DefaultModalHeader/DefaultModalBody';
import NavigationLayout from '../../components/Navigation/NavigationLayout/NavigationLayout';
import NavigationBtn from '../../components/Navigation/NavigationBtn/NavigationBtn';
import SubProjectMenu from './SubProjectMenu/SubProjectMenu';
import ButtonV2 from '../../components/FormV2/ButtonV2/ButtonV2';
import { UserContext, UserDispatchContext } from '../../context/UserInfoProvider';
import avatarImg from '../../assets/userAvatar.png';

const buttons = [
  {
    name: 'Projects',
    action: () => {},
    icon: <AiOutlineFolderOpen />,
    dataTestId: 'projects-nav-btn'
  },
  {
    name: 'My Work(WIP)',
    url: `/my-work`,
    icon: <VscChecklist />,
    dataTestId: 'my-work-nav-btn'
  },
  {
    name: 'Calendar(WIP)',
    checkAccess: 'view:calendar',
    url: `/my-calendar`,
    icon: <AiOutlineCalendar />,
    dataTestId: 'my-calendar-nav-btn'
  },
  {
    name: 'Report(WIP)',
    checkAccess: 'view:reports',
    url: `/my-report`,
    icon: <TbReportSearch />,
    dataTestId: 'my-report-nav-btn'
  },
  {
    name: 'Roles',
    checkAccess: 'view:roles',
    url: `/roles`,
    icon: <BsPeople />,
    dataTestId: 'people'
  }
];

export default function ProjectPage() {
  const navigate = useNavigate();
  const fetchProjects = useContext(ProjectDispatchContext);
  const projectList = useContext<IProject[]>(ProjectContext);
  const [showProjectDetails, setShowProjectDetails] = useState(-1);
  const [value, setValue] = useState(0);
  const refProfile = projectList.map(() => createRef<HTMLDivElement>());
  const refShowMore = projectList.map(() => createRef<HTMLDivElement>());
  const [isCreateNewCard, setIsCreateNewCard] = useState(false);
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toggleSearchMenu, setToggleSearchMenu] = useState(false);
  const [showUserSettingsModal, setShowUserSettingsModal] = useState(false);
  const userInfo = useContext(UserContext);
  const setUserInfo = useContext(UserDispatchContext);

  useEffect(() => {
    fetchProjects();
  }, []);

  const setProjectStar = (id: string) => {
    const projectIndex = projectList.findIndex((project: IProjectData) => project.id === id);
    projectList[projectIndex].star = !projectList[projectIndex].star;
    setValue(value + 1);
  };

  const removeProject = (id: string) => {
    setLoading(true);
    deleteProject(id)
      .then((res: AxiosResponse) => {
        if (res.status === 204) {
          fetchProjects();
          setLoading(false);
          toast.success('Project has been deleted', {
            theme: 'colored',
            className: 'primaryColorBackground'
          });
        }
      })
      .catch(() => {
        toast.error('Temporary Server Error. Try Again.', { theme: 'colored' });
        setLoading(false);
      });
  };

  const starProject = (id: string, data: IProjectData, token: string) => {
    setProjectStar(id);
    updateProject(id, data, token).then(() => {
      fetchProjects();
    });
  };

  const getAuthToken = () => {
    const token = localStorage.getItem('access_token') ?? '';
    return token;
  };

  const viewDetailPosition = (e: React.MouseEvent<HTMLDivElement>, id: number) => {
    const mouseDetailPosition = e.currentTarget.getBoundingClientRect();

    const viewPosition = {
      x: mouseDetailPosition.left + window.scrollX,
      y: mouseDetailPosition.top + window.scrollY
    };
    const { current } = refProfile[id];
    if (current !== null) {
      current.style.top = `${viewPosition.y - 170}px`;
      current.style.left = `${viewPosition.x + 50}px`;
    }
  };

  const handleClickInside = (e: MouseEvent) => {
    if (!clickedShowMore(e, refShowMore)) {
      setShowProjectDetails(-1);
    }
  };

  const getCreateNewCardStateFromChildren = () => {
    setIsCreateNewCard(!isCreateNewCard);
  };

  const fetchNewCard = () => {
    getCreateNewCardStateFromChildren();
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickInside);
    return () => document.removeEventListener('mousedown', handleClickInside);
  });

  const onClickProjectSave = (apiData: any) => {
    setLoading(true);
    createProject(apiData)
      .then((res: AxiosResponse) => {
        if (!res.data) {
          return;
        }
        fetchProjects();
        setLoading(false);
        toast.success('Project has been created', {
          theme: 'colored',
          className: 'primaryColorBackground'
        });
        setShowCreateProjectModal(false);
      })
      .catch(() => {
        toast.error('Temporary Server Error. Try Again.', { theme: 'colored' });
        setLoading(false);
      });
  };

  const logout = () => {
    localStorage.clear();
    setUserInfo({});
    navigate('/');
  };

  return (
    <>
      {isCreateNewCard && (
        <Modal>
          <CreateNewCard
            updateIsCreateNewCard={getCreateNewCardStateFromChildren}
            fetchNewCard={fetchNewCard}
          />
        </Modal>
      )}
      {showCreateProjectModal && (
        <Modal fullWidth>
          <DefaultModalHeader
            title="Create Project"
            onClickClose={() => {
              setShowCreateProjectModal(false);
            }}
          />
          <DefaultModalBody defaultPadding={false} classesName={styles.modalPadding}>
            <ProjectEditor
              showCancelBtn
              onClickSave={onClickProjectSave}
              onClickCancel={() => {
                setShowCreateProjectModal(false);
              }}
              loading={loading}
            />
          </DefaultModalBody>
        </Modal>
      )}

      <div className={styles.projectPage}>
        <NavigationLayout>
          <button
            className={styles.searchBtn}
            onClick={() => {
              setToggleSearchMenu(!toggleSearchMenu);
            }}
          >
            <AiOutlineSearch className={styles.searchIcon} />
            Search
          </button>
          {buttons.map((item) => {
            return (
              <NavigationBtn
                dataTestId={item.dataTestId}
                onClick={() => {
                  if (item.url) {
                    navigate(item.url);
                  }
                }}
              >
                {item.icon}
                {item.name}
              </NavigationBtn>
            );
          })}
          <NavigationBtn
            dataTestId="user-settings"
            classesName={styles.userSettingsBtn}
            onClick={() => {
              setShowUserSettingsModal(!showUserSettingsModal);
            }}
          >
            <AiOutlineUser />
            Settings
          </NavigationBtn>
          {showUserSettingsModal &&
            ReactDOM.createPortal(
              <div className={styles.userSettings}>
                <div className={styles.item}>
                  <img src={userInfo?.avatarIcon || avatarImg} alt="avatar" />
                  {userInfo.name}
                </div>
                <hr />
                <Link to="/me" className={styles.item}>
                  <FiSettings />
                  User Settings
                </Link>
                <div className={styles.item}>
                  <MdList />
                  Preferences (WIP)
                </div>
                <hr />
                <button className={styles.item} onClick={logout}>
                  <MdLogout />
                  Logout
                </button>
              </div>,
              document.body
            )}
        </NavigationLayout>

        <SubProjectMenu toggleSearchMenu={toggleSearchMenu} projectList={projectList} />

        <div className={styles.projectContainer}>
          <div className={styles.projectContent}>
            <div className={styles.header}>
              <div className={styles.title} data-testid="project-title">
                <h1>Projects</h1>
                <ButtonV2
                  customStyles={styles.createProjectBtn}
                  text="New project"
                  onClick={() => setShowCreateProjectModal(true)}
                  icon={<IoIosAdd className={styles.createCardIcon} />}
                  fill
                  dataTestId="board-create-card"
                />
              </div>
              {/* <div className={styles.searchBar}>
                <input
                  onChange={onChangeFilterProject}
                  name="filterProject"
                  data-testid="filter-Project"
                />
                <div className={styles.searchIcon}>
                  <span>
                    <FiSearch />
                  </span>
                </div>
              </div> */}
            </div>
            <div className={styles.mainContent}>
              <table aria-label="Projects details">
                <thead>
                  <tr>
                    <th className={styles.stars}>
                      <span>
                        <AiFillStar />
                      </span>
                    </th>
                    <th className={styles.names}>
                      <span>Name</span>
                    </th>
                    <th className={styles.keys}>
                      <span>Key</span>
                    </th>
                    <th className={styles.types}>
                      <span>Type</span>
                    </th>
                    <th className={styles.leads}>
                      <span>Lead</span>
                    </th>
                    <th className={styles.buttons}>
                      <span />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {projectList.map((project: IProjectData, index: number) => (
                    <tr key={project.id} className={styles.overflowVisible}>
                      <td className={[styles.star, styles.overflowVisible].join(' ')}>
                        <div
                          className={[styles.changeStar, styles.overflowVisible].join(' ')}
                          onFocus={() => undefined}
                        >
                          <span>
                            {project.star ? (
                              <button
                                type="button"
                                className={[styles.starBtn, styles.overflowVisible].join(' ')}
                                onClick={() => {
                                  starProject(project.id, { star: false }, getAuthToken());
                                }}
                              >
                                <div
                                  className={[styles.starStyle, styles.overflowVisible].join(' ')}
                                >
                                  <span className={styles.isStar}>
                                    <AiFillStar />
                                    <div className={styles.notification}>Remove from Starred</div>
                                  </span>
                                </div>
                              </button>
                            ) : (
                              <button
                                type="button"
                                className={[styles.unStarBtn, styles.overflowVisible].join(' ')}
                                onClick={() => {
                                  starProject(project.id, { star: true }, getAuthToken());
                                }}
                              >
                                <div
                                  className={[styles.starStyle, styles.overflowVisible].join(' ')}
                                >
                                  <span className={styles.unStar}>
                                    <AiOutlineStar />
                                    <div className={styles.notification}>Add to Starred</div>
                                  </span>
                                </div>
                              </button>
                            )}
                          </span>
                        </div>
                      </td>
                      <td
                        className={styles.name}
                        data-testid={project.name.replace(' ', '-').toLowerCase()}
                      >
                        <Link to={`/projects/${project.id}/board/${project.boardId}`}>
                          <div className={styles.nameContent}>
                            <img
                              src={
                                project.iconUrl ||
                                'https://010001.atlassian.net/rest/api/2/universal_avatar/view/type/project/avatar/10411?size=xxlarge'
                              }
                              alt="icon"
                            />
                            <span data-testid="project-name">{project.name}</span>
                          </div>
                        </Link>
                      </td>
                      <td className={styles.key}>
                        <span className={styles.keyName}>{project.key}</span>
                      </td>
                      <td className={styles.type}>
                        <div className={styles.typeContent}>
                          <span>{project.type}</span>
                        </div>
                      </td>
                      <td className={[styles.lead, styles.overflowVisible].join(' ')}>
                        <div className={styles.leadContainer} onFocus={() => undefined}>
                          <div className={styles.leadContent}>
                            <div
                              className={[
                                styles.user,
                                styles.overflowVisible,
                                styles.relative
                              ].join(' ')}
                            >
                              <div className={styles.leadInfo}>
                                <div className={styles.avatar}>
                                  <span>
                                    <img
                                      className={styles.profileV2Image}
                                      src={
                                        project?.projectLeadId?.avatarIcon ||
                                        'https://www.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png'
                                      }
                                      alt="avatar"
                                    />
                                  </span>
                                </div>
                                <span>{project.lead}</span>
                              </div>
                              <div className={[styles.absolute, styles.profileV2].join(' ')}>
                                <div className={styles.profileV2Header}>
                                  <img
                                    className={styles.profileV2Image}
                                    src={
                                      project?.projectLeadId?.avatarIcon ||
                                      'https://www.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png'
                                    }
                                    alt="avatar"
                                  />
                                  <p>{project?.projectLeadId?.name || ''}</p>
                                </div>
                                <div className={[styles.profileV2Link, styles.textRight].join(' ')}>
                                  <Link to={`/user/${project?.projectLeadId?.id}`}>
                                    <button type="button">View profile</button>
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td
                        className={styles.changeView}
                        onMouseOver={(e: React.MouseEvent<HTMLDivElement>) =>
                          viewDetailPosition(e, index)
                        }
                        onFocus={() => undefined}
                      >
                        {showProjectDetails === project.id && (
                          <div className={styles.viewDetail} ref={refShowMore[index]}>
                            {checkAccess('view:projects', project.id) && (
                              <Link to={`/settings/${project.id}`}>
                                <button type="button">View Detail</button>
                              </Link>
                            )}
                            {checkAccess('delete:projects', project.id) && (
                              <button
                                type="button"
                                onClick={() => removeProject(project.id)}
                                data-testid="project-delete"
                              >
                                Delete Project
                              </button>
                            )}
                          </div>
                        )}
                        {(checkAccess('view:projects', project.id) ||
                          checkAccess('delete:projects', project.id)) && (
                          <HiDotsHorizontal
                            onClick={() => {
                              setShowProjectDetails(project.id);
                            }}
                            className={styles.verticalMiddle}
                            data-testid="project-expand-button"
                          />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
