import React from 'react';
import styles from './Card.module.scss';

function Card() {
  return (
    <div className={styles.cardContainer}>
      <div className={styles.cardTitle}>
        <h2>Create card</h2>
      </div>
      <div className={styles.cardContent}>
        <p className={styles.cardStar}>Project</p>
        <select className={styles.cardSelect}>
          <option value="techscrum">TECHSCRUM(TEC)</option>
          <option value="example">example</option>
          <option value="template">template</option>
        </select>
        <p className={styles.cardStar}>Card type</p>
        <select className={styles.cardSelect}>
          <option value="Story">Story</option>
          <option value="Bug">Bug</option>
        </select>
        <p className={styles.cardStar}>Summary</p>
        <input className={styles.cardInput} type="text" />
        <p className={styles.cardLabel}>Attachment</p>
        <input
          className={styles.cardInput}
          type="file multiple"
          id="fileInput"
          placeholder="Drop files to attach or browse"
        />
        <p className={styles.cardLabel}>Description</p>
        <input className={styles.cardInput} type="text" placeholder="" />
        <p className={styles.cardLabel}>Assignee</p>
        <input className={styles.cardAssignee} placeholder="Automatic" />
        <p className={styles.cardLabel}>Priority</p>
        <select className={styles.cardSelect}>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <p className={styles.cardLabel}>Labels</p>
        <select className={styles.cardSelect} placeholder="select Label">
          <option value="backend">backend</option>
          <option value="frontend">frontend</option>
        </select>
      </div>
      <div className={styles.cardButton}>
        <button type="button" className={styles.cancelButton} name="close">
          Cancel
        </button>
        <button type="submit" className={styles.createButton}>
          Create
        </button>
      </div>
    </div>
  );
}

export default Card;
