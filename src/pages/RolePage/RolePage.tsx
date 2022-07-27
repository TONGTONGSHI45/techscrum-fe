import axios from 'axios';
import React, { useEffect, useState, createRef } from 'react';
import { TiDelete } from 'react-icons/ti';
import { updateRole, removePermission } from '../../api/role/role';
import ProjectHeader from '../../components/ProjectHeader/ProjectHeader';
import config from '../../config/config';
import styles from './RolePage.module.scss';

export default function ProjectMembersPage() {
  const [roles, setRoles] = useState<any>([]);
  const [permissions, setPermissions] = useState<any>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<any>([]);
  const [showPermissionOptions, setShowPermissionOptions] = useState(-1);
  const refRole = roles.map(() => createRef<HTMLDivElement>());
  const refShowMore = permissions.map(() => createRef<HTMLDivElement>());

  useEffect(() => {
    const getRoles = async () => {
      const path = `${config.apiAddress}/roles`;
      const res = await axios.get(path);
      setRoles(res.data);
    };

    const getPermissions = async () => {
      const path = `${config.apiAddress}/permissions`;
      const res = await axios.get(path);
      setPermissions(res.data);
    };

    getRoles();
    getPermissions();
  }, [permissions]);

  const onClickAddPermission = (roleId: string, permissionId: string) => {
    updateRole(roleId, permissionId);
  };

  const onChangeSelectedPermissions = (e: any) => {
    setSelectedPermissions(e.target.value);
  };

  const removePermissionFromList = async (roleId: string, permissionId: string) => {
    // if (!roleId || !permissionId) {
    //   return;
    // }
    try {
      await removePermission(roleId, permissionId);
    } finally {
      if (selectedPermissions !== undefined && Array.isArray(selectedPermissions)) {
        setSelectedPermissions(selectedPermissions.filter((item: any) => item.id !== permissionId));
      }
    }
  };

  const viewDetailPosition = (e: React.MouseEvent<HTMLDivElement>, id: number) => {
    const mouseDetailPosition = e.currentTarget.getBoundingClientRect();

    const viewPosition = {
      x: mouseDetailPosition.left + window.scrollX,
      y: mouseDetailPosition.top + window.scrollY
    };
    const { current } = refRole[id];
    if (current !== null) {
      current.style.top = `${viewPosition.y - 170}px`;
      current.style.left = `${viewPosition.x + 50}px`;
    }
  };

  const handleClickInside = (e: MouseEvent) => {
    const target = e.target as HTMLDivElement;
    let hasClickShowMore = false;

    for (let i = 0; i < refShowMore.length; i += 1) {
      const ref = refShowMore[i].current;
      if (ref !== null && ref.contains(target)) {
        hasClickShowMore = true;
      }
    }
    if (hasClickShowMore === false) {
      setShowPermissionOptions(-1);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickInside);
    return () => document.removeEventListener('mousedown', handleClickInside);
  });

  return (
    <>
      <ProjectHeader />
      <div className={styles.rolePage}>
        <div className={styles.container}>
          <div className={styles.content}>
            <div className={styles.header}>
              <div className={styles.title}>
                <h1>Manage Roles</h1>
              </div>
              <div className={styles.mainContent}>
                <table aria-label="Projects details">
                  <thead>
                    <tr>
                      <th className={styles.roles}>
                        <span>Roles</span>
                      </th>
                      {roles.map((role: any) => (
                        <th key={role.id} className={styles.types}>
                          <span>{role.name}</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className={styles.permission}>
                        <span>Permission</span>
                      </td>
                      {roles.map((role: any, index: number) => (
                        <td key={role.id}>
                          <div
                            onMouseOver={(e: React.MouseEvent<HTMLDivElement>) =>
                              viewDetailPosition(e, index)
                            }
                            onFocus={() => undefined}
                            className={styles.permissionOptionSection}
                          >
                            <button
                              className={styles.addPermissionBtn}
                              onClick={() => {
                                setShowPermissionOptions(role.id);
                              }}
                            >
                              Add permission
                            </button>
                            {showPermissionOptions === role.id && (
                              <div ref={refShowMore[index]} className={styles.permissionList}>
                                <ul>
                                  {permissions.map((item: any) => (
                                    <li key={item.id}>
                                      <button
                                        type="button"
                                        onClick={(e: any) => {
                                          onClickAddPermission(role.id, item.id);
                                          onChangeSelectedPermissions(e);
                                          setShowPermissionOptions(-1);
                                        }}
                                      >
                                        {item.description}
                                      </button>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            <div className={styles.selectedPermissions}>
                              {role.permission.map((item: any) => (
                                <div key={item.id} className={styles.editSelectedSection}>
                                  <span>{item.slug}</span>
                                  <TiDelete
                                    onClick={() => {
                                      removePermissionFromList(role.id, item.id);
                                    }}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
