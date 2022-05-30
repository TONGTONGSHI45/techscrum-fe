import * as React from 'react';
import { IconType } from 'react-icons';
import styles from './ThreeColumnsMenu.module.scss';
import Left from './left/Left';
import Middle from './middle/Middle';
import Right from './right/Right';

interface Props {
  servicesInfo: {
    leftContent: {
      title: string;
      content: Array<{ title: string; description: string; href: string }>;
    };
    middleContent: {
      title: string;
      content: Array<{
        icon: IconType;
        title: string;
        description: string;
        href: string;
      }>;
      btnContent: {
        content: string;
        href: string;
      };
    };
    rightContent: {
      title: string;
      content: Array<{
        icon: IconType;
        title: string;
        description: string;
        href: string;
      }>;
      btnContent: {
        content: string;
        href: string;
      };
    };
  };
}

export default function threeColumnsMenu({ servicesInfo }: Props) {
  return (
    <div className={styles.subNavThreeColumns}>
      <div className={styles.serviceContainerThreeColumns}>
        <Left leftContent={servicesInfo.leftContent} />
        <Middle middleContent={servicesInfo.middleContent} />
        <Right rightContent={servicesInfo.rightContent} />
      </div>
    </div>
  );
}