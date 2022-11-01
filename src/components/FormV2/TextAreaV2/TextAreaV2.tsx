import React, { useState } from 'react';
import { getErrorMessage } from '../../../utils/formUtils';
import styles from '../FormV2.module.scss';

interface ITextAreaV2 {
  onValueChanged: (e: any) => void;
  onValueBlur: (e: any) => void;
  defaultValue: string;
  name: string;
  label: string;
  required?: boolean;
  placeHolder?: string;
}

export default function TextAreaV2(props: ITextAreaV2) {
  const { defaultValue, name, label, placeHolder, required, onValueChanged, onValueBlur } = props;
  const [value, setValue] = useState(defaultValue);
  const [error, setError] = useState<null | string>(null);
  const [isActive, setIsActive] = useState(false);

  const onChanged = (e: any) => {
    const errorMessage = getErrorMessage(e, props);
    setError(errorMessage);
    setValue(e.target.value);
    onValueChanged(e);
  };

  const onBlurValue = (e: any) => {
    onValueBlur(e);
    setIsActive(false);
  };

  return (
    <div
      className={[
        'relative',
        styles.inputContainer,
        error ? styles.borderRed : '',
        isActive ? styles.borderActive : ''
      ].join(' ')}
    >
      <label
        className={[styles.label, error ? styles.errorRed : '', isActive ? styles.active : ''].join(
          ' '
        )}
        htmlFor={name}
      >
        {label}
        {required ? <span className={styles.errorRed}>*</span> : ''}
      </label>
      <textarea
        className={[styles.input, styles.textArea].join(' ')}
        value={value}
        name={name}
        onChange={onChanged}
        onBlur={onBlurValue}
        onClick={() => {
          setIsActive(true);
        }}
        placeholder={placeHolder}
      />
      {error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  );
}

TextAreaV2.defaultProps = {
  required: false,
  placeHolder: ''
};
