import React, { useEffect, useState } from 'react';
import { TiDelete } from 'react-icons/ti';
import { createLabel, removeLabel } from '../../../../api/label/label';
import useOutsideAlerter from '../../../../hooks/OutsideAlerter';
import { TaskEntity } from '../../../../api/task/entity/task';
import styles from './LabelFields.module.scss';
import { ILabelData } from '../../../../types';

interface IPropsLabel {
  labels: ILabelData[];
  taskInfo: TaskEntity;
  isDisabled: boolean;
  updateTaskTags: (tags: ILabelData[] | undefined) => void;
}

export default function LabelFields(props: IPropsLabel) {
  const { labels, taskInfo, isDisabled, updateTaskTags } = props;
  const [selectedTaskLabelList, setSelectedTaskLabelList] = useState<ILabelData[] | undefined>(
    taskInfo.tags
  );
  const [dropDownTaskList, setDropDownTaskList] = useState(labels);
  const [inputLabel, setInputLabel] = useState<string>('');
  const { visible, setVisible, myRef } = useOutsideAlerter(false);
  const handleClickOutside = () => {
    setInputLabel('');
    setVisible(true);
  };

  useEffect(() => {
    const labelNames =
      selectedTaskLabelList === undefined
        ? []
        : selectedTaskLabelList.map((item) => {
            if (!item) {
              return '';
            }
            return item.name ?? '';
          });

    setDropDownTaskList(
      labels.filter((item: ILabelData) => {
        if (item.name !== undefined) {
          return !labelNames.includes(item.name);
        }
        return false;
      })
    );
  }, [labels, selectedTaskLabelList]);

  const removeLabelFromSelectedTaskList = async (label: ILabelData) => {
    if (!taskInfo.id || !label.id) {
      return;
    }
    try {
      await removeLabel(taskInfo.id, label.id);
    } finally {
      if (selectedTaskLabelList !== undefined) {
        const newLabelList = selectedTaskLabelList.filter((item) => item.name !== label.name);
        setSelectedTaskLabelList(newLabelList);
        updateTaskTags(newLabelList);
      }
    }
  };

  const addLabelToSelectedTaskLabelList = (label: ILabelData) => {
    if (!selectedTaskLabelList) {
      return;
    }
    const newLabelList = selectedTaskLabelList.concat(label);
    setSelectedTaskLabelList(newLabelList);
    updateTaskTags(newLabelList);
  };

  const onChangeFilterLabel = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) {
      return;
    }
    setDropDownTaskList(
      dropDownTaskList.filter((label: ILabelData) => {
        return label.name?.toLowerCase().includes(e.target.value.toLowerCase());
      })
    );
  };
  const onClickSave = async (label: string) => {
    if (!taskInfo.id) {
      return;
    }
    const res = await createLabel(taskInfo.id, {
      name: inputLabel || label,
      slug: inputLabel.replace(' ', '-') || label.replace(' ', '-')
    });
    if (!res.data) {
      return;
    }
    addLabelToSelectedTaskLabelList({ ...res.data });
    setInputLabel('');
  };

  const onChangeInputLabel = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputLabel(e.target.value);
    onChangeFilterLabel(e);
  };
  const hasItem = dropDownTaskList.length > 0;
  return (
    <div className={styles.label}>
      <div>Labels</div>
      <div ref={myRef} className={styles.labelDropdownContainer}>
        {visible && !isDisabled ? (
          <div className={styles.labelDropdownOpen}>
            <div className={styles.labelOptions}>
              {selectedTaskLabelList !== undefined &&
                selectedTaskLabelList.map((item: ILabelData) => {
                  return (
                    <div className={styles.labels} key={item.id}>
                      <span>{item.name}</span>
                      <TiDelete
                        onClick={() => {
                          removeLabelFromSelectedTaskList(item);
                        }}
                      />
                    </div>
                  );
                })}
              <input onChange={onChangeInputLabel} value={inputLabel} />
            </div>
            <div className={styles.labelMenu}>
              <ul>
                {!hasItem && inputLabel === '' && <li className={styles.noResult}>No result</li>}
                {dropDownTaskList.map((label: ILabelData) => (
                  <li key={label.id}>
                    <button
                      type="button"
                      onClick={() => {
                        addLabelToSelectedTaskLabelList(label);
                        setInputLabel('');
                        onClickSave(label.name ?? '');
                      }}
                    >
                      <span>{label.name}</span>
                    </button>
                  </li>
                ))}
                {inputLabel && inputLabel !== '' && (
                  <li>
                    <button type="button" onClick={() => onClickSave(inputLabel)}>
                      <span>{inputLabel} (New Label)</span>
                    </button>
                  </li>
                )}
              </ul>
            </div>
          </div>
        ) : (
          <button className={styles.labelInputClose} type="button" onClick={handleClickOutside}>
            {selectedTaskLabelList !== undefined &&
              selectedTaskLabelList?.map((item: ILabelData, index: number) => {
                return <span key={item.id ?? index}>{item.name ?? ''}</span>;
              })}
            {selectedTaskLabelList?.length === 0 && <span className={styles.noLabel}>None</span>}
          </button>
        )}
      </div>
    </div>
  );
}
