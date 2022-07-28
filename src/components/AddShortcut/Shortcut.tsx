import React, { useEffect, useState } from 'react';
import { createShortcut, updateShortcut } from '../../api/shortcut/shortcut';
import { IShortcutData } from '../../types';
import AddShortcutFooter from './components/AddShortcutFooter/AddShortcutFooter';
import EditShortcutFooter from './components/EditShortcutFooter/EditShortcutFooter';
import ShortcutBody from './components/ShortcutBody/ShortcutBody';
import styles from './Shortcut.module.scss';

interface IOperation {
  operation: string;
  addLinkToggle: boolean;
  setAddLinkToggle: (addLinkToggle: boolean) => void;
  shortCutAdded: (data: IShortcutData) => void;
  shortCutRemoved: () => void;
  shortCutUpdated: () => void;
  selectedLink: IShortcutData | null;
  currentProjectId: string;
}

export default function Shortcut({
  operation,
  setAddLinkToggle,
  addLinkToggle,
  selectedLink,
  currentProjectId,
  shortCutAdded,
  shortCutRemoved,
  shortCutUpdated
}: IOperation) {
  const [webValue, setWebValue] = useState('');
  const [nameValue, setNameValue] = useState('');
  const [isUrlValid, setIsUrlValid] = useState(true);

  function validURL(str: string) {
    // Used from https://www.geeksforgeeks.org/check-if-an-url-is-valid-or-not-using-regular-expression/
    const pattern = new RegExp(
      '((http|https)://)(www.)?' +
        '[a-zA-Z0-9@:%._\\+~#?&//=]' +
        '{2,256}\\.[a-z]' +
        '{2,6}\\b([-a-zA-Z0-9@:%' +
        '._\\+~#?&//=]*)'
    ); // fragment locator
    return !!pattern.test(str);
  }

  useEffect(() => {
    setIsUrlValid(!validURL(webValue));
  }, [webValue]);

  useEffect(() => {
    setWebValue(selectedLink?.shortcutLink ?? '');
    setNameValue(selectedLink?.name ?? '');
  }, [selectedLink]);

  useEffect(() => {}, [webValue, nameValue]);

  const onClickAddShortcut = () => {
    createShortcut(currentProjectId, { name: nameValue, shortcutLink: webValue }).then((res) => {
      shortCutAdded(res.data);
    });
  };

  const onClickUpdateShortcut = () => {
    if (selectedLink?.id !== undefined)
      updateShortcut(currentProjectId, selectedLink?.id, {
        name: nameValue,
        shortcutLink: webValue
      }).then(() => {
        shortCutUpdated();
      });
  };

  return (
    <div className={styles.background}>
      <div className={styles.container}>
        <header>
          <div className={styles.headerBanner} />
          <div className={styles.addImage}>
            <img
              alt="add_image"
              src="https://jira-frontend-static.prod.public.atl-paas.net/assets/image.46a4b7e1f40adec8b2af7eb2cd452a24.8.svg"
            />
          </div>
        </header>
        <div className={styles.dialog}>
          <ShortcutBody
            operation={operation}
            setWebValue={setWebValue}
            setNameValue={setNameValue}
            webValue={webValue}
            value={nameValue}
            isUrlValid={isUrlValid}
          />
          {
            {
              Add: (
                <AddShortcutFooter
                  setAddLinkToggle={setAddLinkToggle}
                  addLinkToggle={addLinkToggle}
                  webValue={webValue}
                  nameValue={nameValue}
                  onClickAddShortcut={onClickAddShortcut}
                  isUrlValid={isUrlValid}
                />
              ),
              Edit: (
                <EditShortcutFooter
                  setAddLinkToggle={setAddLinkToggle}
                  addLinkToggle={addLinkToggle}
                  shortCutRemoved={shortCutRemoved}
                  currentProjectId={currentProjectId}
                  shortcutId={selectedLink?.id ?? ''}
                  onClickUpdateShortcut={onClickUpdateShortcut}
                />
              )
            }[operation]
          }
        </div>
      </div>
    </div>
  );
}
