import React from 'react';
import { TiTick } from 'react-icons/ti';
import { BsQuestionSquare } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import styles from './WhyUs.module.scss';
import home1 from '../../../assets/all_items_table.png';

export default function WhyUs() {
  return (
    <div className={[styles.jobDoneRows].join(' ')}>
      <div className={[styles.container, styles.row, styles.projectManagement].join(' ')}>
        <div className={styles.businessPicture}>
          <img src={home1} alt="business" />
        </div>
        <div className={[styles.businessContent].join(' ')}>
          <p className={styles.eyebrow}>
            <BsQuestionSquare className={[styles.eyebrowIcon, 'primaryColor'].join(' ')} /> Why
            Choose
          </p>
          <h3>TechScrum</h3>
          <div className={styles.jobDoneParagraph}>
            {/* <ul>
                      <li>Free trial</li>
                      <li>Logging</li>
                      <li>Prevent</li>
                      <li>Sprint Tracking</li>
                      <li>Backlog Tracking</li>
                      <li>Reports</li>
                    </ul> */}
            <ul>
              <li>
                <TiTick />
                Free trial
              </li>
              <li>
                <TiTick /> Customized
              </li>
              <li>
                <TiTick />
                Increase Productive
              </li>
              <li>
                <TiTick />
                Intuitive UI
              </li>
              <li>
                <TiTick />
                No Training Required
              </li>
            </ul>
            <div className={['flex', styles.links].join(' ')}>
              <Link className={styles.button} to="/register">
                Try TechScrum free
              </Link>
              <Link className={styles.link} to="/register">
                Take a Product tour {'>'}
              </Link>
            </div>
          </div>
        </div>
        <img
          src="https://themexriver.com/appilo-theme/seo-agency/wp-content/uploads/sites/56/2021/11/ab-shape.png"
          alt="https://themexriver.com/appilo-theme/seo-agency/wp-content/uploads/sites/56/2021/11/ab-shape.png"
          className={styles.bgImg}
        />
      </div>
    </div>
  );
}
