/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import { AiOutlineSetting, AiOutlineUnorderedList } from 'react-icons/ai';
import { BsBriefcase } from 'react-icons/bs';
import styles from './Setting.module.scss';
import { deleteProject, showProject, updateProject } from '../../api/projects/projects';
import { IOnChangeProjectLead, IProjectData, IProjectEditor } from '../../types';
import { UserContext } from '../../context/UserInfoProvider';
import SettingCard from '../../components/SettingCard/SettingCard';
import ChangeIcon from '../../components/ProjectEditor/ChangeIcon/ChangeIcon';
import { getUsers } from '../../api/user/user';
import 'react-toastify/dist/ReactToastify.css';
import checkAccess from '../../utils/helpers';
import MainMenuV2 from '../MainMenuV2/MainMenuV2';
import ButtonV2 from '../../lib/FormV2/ButtonV2/ButtonV2';
import DropdownV2 from '../../lib/FormV2/DropdownV2/DropdownV2';
import InputV2 from '../../lib/FormV2/InputV2/InputV2';
import SubSettingMenu from '../../lib/SubSettingMenu/SubSettingMenu';
import Modal from '../../lib/Modal/Modal';

const subMenuItem = (projectId: string) => {
  return {
    planning: [
      {
        name: 'Project Details',
        url: `/settings/${projectId}`,
        icon: <AiOutlineSetting />,
        dataTestId: 'preference',
        active: true
      },
      {
        name: 'Project members',
        checkAccess: 'view:members',
        url: `/projects/${projectId}/members`,
        icon: <BsBriefcase />,
        dataTestId: 'project-members'
      }
    ],
    dailyScrumBtn: [
      {
        name: 'Custom Fields (WIP)',
        url: `/custom-fields/${projectId}`,
        icon: <AiOutlineUnorderedList />,
        dataTestId: 'custom-fields'
      }
    ]
  };
};

export default function Setting() {
  const navigate = useNavigate();
  const { projectId = '' } = useParams();
  const [data, setData] = useState<IProjectEditor | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const userInfo = useContext(UserContext);
  const [userList, setUserList] = useState<any>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (Object.keys(userInfo).length === 0 || !userInfo) {
      return;
    }
    const token = userInfo?.token;
    if (!token) {
      return;
    }
    showProject(projectId, token)
      .then((res) => {
        setData(res.data);
      })
      .catch((e) => {
        if (e.response.status === 403) {
          navigate('/unauthorize');
        }
      });
  }, [projectId, userInfo.token, userInfo]);

  useEffect(() => {
    const getUsersList = async () => {
      if (userList.length === 0) {
        const res = await getUsers();
        setUserList(res.data);
      }
    };
    getUsersList();
  }, [userList]);

  const update = (updateData: IProjectData) => {
    const token = userInfo?.token || '';
    setLoading(true);
    updateProject(projectId, updateData, token)
      .then((res: AxiosResponse) => {
        if (!res.data) {
          return;
        }
        setLoading(false);
        toast.success('Your profile has been successfully updated', {
          theme: 'colored',
          className: 'primaryColorBackground'
        });
      })
      .catch(() => {
        toast.error('Temporary Server Error. Try Again.', { theme: 'colored' });
        setLoading(false);
      });
  };

  const onClickSave = () => {
    if (!data) {
      return;
    }
    const copiedData = { name: data.name, key: data.key, projectLeadId: data.projectLeadId };
    update(copiedData);
  };

  const uploadSuccess = (photoData: any) => {
    const updateData = { ...data };
    updateData.iconUrl = photoData[0].location;
    setData(updateData);
    update({ iconUrl: updateData.iconUrl });
  };

  const onChange = (e: IOnChangeProjectLead) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updateData = {
      [e.target.name]: e.target.value,
      key: e.target.value.substring(0, 3).toUpperCase()
    };

    setData({ ...data, ...updateData });
  };

  return (
    <div className={[styles.settingPage, 'relative'].join(' ')} data-testid="setting-page">
      <MainMenuV2 />
      <SubSettingMenu items={subMenuItem(projectId)} />
      <div className={styles.settingContainer}>
        <div className={styles.settingMiniContainer}>
          <header>
            <h1 className={styles.headerText}>Project Settings</h1>
            <hr className={styles.divider} />
          </header>
          <SettingCard title="Project Information">
            <ChangeIcon uploadSuccess={uploadSuccess} value={data?.iconUrl} loading={!data} />
            <div className={[styles.gap, styles.row, 'flex'].join(' ')}>
              <InputV2
                label="Project Name"
                onValueChanged={onChangeName}
                onValueBlur={() => {}}
                value={data?.name}
                name="name"
                loading={!data}
                dataTestId="projectName"
              />
              <InputV2
                label="Project Key"
                onValueChanged={onChange}
                onValueBlur={() => {}}
                value={data?.key}
                name="key"
                loading={!data}
                dataTestId="projectKey"
              />
            </div>
            <div className={[styles.gap, styles.row, 'flex'].join(' ')}>
              <DropdownV2
                label="Project Lead"
                dataTestId="projectLead"
                onValueChanged={onChange}
                onValueBlur={() => {}}
                defaultValue={data?.projectLeadId?.id}
                name="projectLeadId"
                loading={!data}
                options={userList.map((item) => {
                  return {
                    label: item.name,
                    value: item.id
                  };
                })}
              />
              <InputV2
                label="Website URL"
                onValueChanged={() => {}}
                onValueBlur={() => {}}
                defaultValue=""
                name="websiteURL"
                loading={!data}
                dataTestId="websiteURL"
              />
            </div>
            <div className={[styles.gap, styles.row, 'flex'].join(' ')}>
              <InputV2
                label="Description"
                onValueChanged={() => {}}
                onValueBlur={() => {}}
                defaultValue=""
                name="description"
                loading={!data}
                dataTestId="description"
              />
            </div>
            <ButtonV2 text="SAVE CHANGES" onClick={onClickSave} loading={loading} />
          </SettingCard>
          {checkAccess('delete:projects', projectId) && (
            <SettingCard title="Delete Project">
              <p className={styles.p}>
                Delete your project and all of your source data. This is irreversible.
              </p>
              <ButtonV2
                text="DELETE"
                danger
                size="xs"
                onClick={() => {
                  setShowDeleteModal(true);
                }}
              />
            </SettingCard>
          )}
        </div>
      </div>
      {showDeleteModal && (
        <Modal classesName={styles.modal}>
          <p>Are you sure you want to delete the project?</p>
          <div className={styles.modalBtn}>
            <ButtonV2
              text="Confirm"
              danger
              onClick={() => {
                setSubmitting(true);
                deleteProject(projectId)
                  .then(() => {
                    toast.success('Project has been deleted', {
                      theme: 'colored',
                      className: 'primaryColorBackground'
                    });
                    navigate('/projects');
                  })
                  .catch(() => {
                    toast.error('Temporary Server Error. Try Again.', { theme: 'colored' });
                  })
                  .finally(() => {
                    setSubmitting(false);
                  });
              }}
              disabled={submitting}
            />
            <ButtonV2
              text="Cancel"
              fill
              onClick={() => {
                setShowDeleteModal(false);
              }}
            />
          </div>
        </Modal>
      )}
    </div>
  );
}
