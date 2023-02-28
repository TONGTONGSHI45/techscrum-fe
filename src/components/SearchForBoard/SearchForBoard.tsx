import React, { useEffect, useRef } from 'react';
import styles from './SearchForBoard.module.scss';
import search from '../../assets/search-line.svg';

interface ISearchForBoard {
  inputState: any;
  setInputState: any;
  setInputQuery: any;
  page: string;
}

export default function SearchForBoard(props: ISearchForBoard) {
  const { inputState, setInputState, setInputQuery, page } = props;

  const myRef = useRef<HTMLInputElement>(null);

  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as HTMLDivElement;

    const val: string = myRef.current?.value.trim() ?? '';

    if (!val.length && myRef.current !== null && !myRef.current.contains(target)) {
      setInputState(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  });

  return (
    <div
      className={
        inputState ? `${styles.inputContainer} ${styles.inputContainerPlus}` : styles.inputContainer
      }
    >
      <input
        type="text"
        name="search"
        ref={myRef}
        placeholder={inputState ? `search ${page}` : ''}
        onClick={() => {
          setInputState(true);
        }}
        onChange={(event) => setInputQuery(event.target.value)}
        data-testid="board-search"
      />
      <span>
        <img
          className={
            styles.inputImg ||
            'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__480.png'
          }
          src={search}
          alt="search"
        />
      </span>
    </div>
  );
}
