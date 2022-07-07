import React from 'react';
import style from './CardHeader.module.scss';

export default function CardHeader() {
  return (
    <header className={style.container}>
      <div className={style.headerLeft}>
        <button className={style.storyIcon} type="button">
          <img
            src="https://010001.atlassian.net/rest/api/2/universal_avatar/view/type/issuetype/avatar/10315?size=medium"
            alt="Story"
          />
        </button>
        <span>TEC-101</span>
      </div>
      <div className={style.headerRight}>
        <button type="button">
          <svg viewBox="0 0 24 24" role="presentation">
            <path
              d="M12 10.586L6.707 5.293a1 1 0 00-1.414 1.414L10.586 12l-5.293 5.293a1 1 0 001.414 1.414L12 13.414l5.293 5.293a1 1 0 001.414-1.414L13.414 12l5.293-5.293a1 1 0 10-1.414-1.414L12 10.586z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>
    </header>
  );
}