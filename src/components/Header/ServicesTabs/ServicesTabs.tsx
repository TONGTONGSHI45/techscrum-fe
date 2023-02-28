import React, { useState } from 'react';
import {
  AiOutlineFieldTime,
  AiOutlineBarChart,
  AiOutlineLaptop,
  AiOutlineUserAdd,
  AiOutlineDisconnect,
  AiOutlineTeam,
  AiOutlineFundProjectionScreen,
  AiTwotoneSwitcher,
  AiOutlineAliwangwang
} from 'react-icons/ai';
import {
  MdOutlineKeyboardArrowDown,
  MdWorkOutline,
  MdLaptopChromebook,
  MdOutlineContactSupport
} from 'react-icons/md';
import { Link } from 'react-router-dom';
import styles from './ServicesTabs.module.scss';
import OneColumnsMenu from './OneColumnMenu/OneColumnMenu';

interface Props {
  show: boolean;
}

const features = {
  content: {
    title: 'Features',
    content: [
      {
        icon: AiOutlineFieldTime,
        title: 'Resource Management',
        description: 'Manage your team&apos;s short team and long term resources',
        href: '/#'
      },
      {
        icon: AiOutlineBarChart,
        title: 'Kanban boards',
        description: 'Automate your workflow and visualiza project tasks',
        href: '/#'
      },
      {
        icon: AiOutlineLaptop,
        title: 'Time Tracking',
        description: 'Deliver a more collaborative client experience',
        href: '/#'
      },
      {
        icon: AiOutlineUserAdd,
        title: 'Unlimited client users',
        description: 'Deliver a more collaborative client experience',
        href: '/#'
      }
    ]
  }
};

const teams = {
  content: {
    title: 'Teams',
    content: [
      {
        icon: AiOutlineTeam,
        title: 'Team 1',
        description: '',
        href: '/about'
      },
      {
        icon: AiOutlineTeam,
        title: 'Team 2',
        description: '',
        href: '/about-t2'
      },
      {
        icon: AiOutlineTeam,
        title: 'Team 3',
        description: '',
        href: '/about-t3'
      }
    ]
  }
};

const solutions = {
  content: {
    title: 'For',
    content: [
      {
        icon: AiOutlineDisconnect,
        title: 'Agencies',
        description: 'Manage clients projects seamlessly with Techscrum',
        href: '/#',
        hot: false
      },
      {
        icon: AiOutlineTeam,
        title: 'Creative Teams',
        description: 'Manage creative Projects smoothly with Techscrum',
        href: '/#',
        hot: false
      },
      {
        icon: AiOutlineFundProjectionScreen,
        title: 'Startups',
        description:
          'From hitting revenue goals to managing workflows, small businesses thrive with Techscrum.',
        href: '/#',
        hot: false
      },
      {
        icon: AiOutlineDisconnect,
        title: 'Marketing Teams',
        description: 'Manage multiple complex client projects with ease',
        href: '/#',
        hot: false
      },
      {
        icon: AiTwotoneSwitcher,
        title: 'Product Teams',
        description: 'Easily manage and execute on product requirements',
        href: '/#',
        hot: false
      },
      {
        icon: AiOutlineAliwangwang,
        title: 'Remote teams',
        description:
          'Keep your remote team connected and motivated, no matter where they&acute;re located around the world.',
        href: '/#',
        hot: false
      }
    ]
  }
};

const resources = {
  content: {
    title: 'resources',
    content: [
      {
        icon: MdWorkOutline,
        title: 'Careers',
        description: 'A team that provides Growth and Support',
        href: '/careers'
      },
      {
        icon: MdLaptopChromebook,
        title: 'Book a demo',
        description: 'Learn the basic features of TechScrum',
        href: '/contact'
      },
      {
        icon: MdOutlineContactSupport,
        title: 'Support Center',
        description: 'Get the direct help Get the direct help',
        href: '/support-center'
      }
    ]
  }
};

export default function ServicesTabs({ show }: Props) {
  const [featuresActive, setFeaturesActive] = useState(false);
  const [solutionActive, setSolutionActive] = useState(false);
  const [teamActive, setTeamActive] = useState(false);
  const [resourcesActive, setResourcesActive] = useState(false);

  const initial = () => {
    setFeaturesActive(false);
    setSolutionActive(false);
    setTeamActive(false);
    setResourcesActive(false);
  };

  const activeMenu = (menu: string) => {
    initial();
    if (menu === 'features') setFeaturesActive(!featuresActive);
    if (menu === 'solution') setSolutionActive(!solutionActive);
    if (menu === 'teams') setTeamActive(!teamActive);
    if (menu === 'resources') setResourcesActive(!resourcesActive);
  };

  return (
    <div className={`${styles.serviceListTabs} ${show ? styles.serviceListTabsActive : ''}`}>
      <div>
        <Link to="/#" onClick={() => activeMenu('features')}>
          Features
          <MdOutlineKeyboardArrowDown />
        </Link>
        <OneColumnsMenu servicesInfo={features} active={featuresActive} />
      </div>
      <div>
        <Link to="/#" onClick={() => activeMenu('solution')}>
          Solutions
          <MdOutlineKeyboardArrowDown />
        </Link>
        <OneColumnsMenu servicesInfo={solutions} active={solutionActive} />
      </div>
      <div>
        <Link to="/#" onClick={() => activeMenu('teams')}>
          Teams
          <MdOutlineKeyboardArrowDown />
        </Link>
        <OneColumnsMenu servicesInfo={teams} active={teamActive} />
      </div>

      <div>
        <Link to="/#" onClick={() => activeMenu('resources')}>
          Resources
          <MdOutlineKeyboardArrowDown />
        </Link>
        <OneColumnsMenu servicesInfo={resources} active={resourcesActive} />
      </div>
      <div>
        <Link to="/price">Price</Link>
      </div>
    </div>
  );
}
