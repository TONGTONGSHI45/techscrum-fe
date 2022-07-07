import React from 'react';
import Nav from '../../components/BoardNavigation/Nav';
import Board from '../../components/Board/Board';
import styles from './BoardPage.module.scss';

export default function BoardPage() {
  return (
    <div className={styles.navAndBoard}>
      <Nav />
      <Board />
    </div>
  );
}