import React, { useContext, useEffect, useState } from 'react';
import { IoWarning } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import axios from 'axios';
import MainMenuV2 from '../MainMenuV2/MainMenuV2';
import SubSettingMenu from '../../lib/SubSettingMenu/SubSettingMenu';
import styles from './BillingSubscriptionPage.module.scss';
import logo from '../../assets/small-logo.svg';
import useOutsideAlerter from '../../hooks/OutsideAlerter';
import PopUpModal from './PopUpModal';
import { paymentButtons } from '../../utils/billingButtons';
import config from '../../config/config';
import { UserContext } from '../../context/UserInfoProvider';

const userFree = {
  plan: 'free',
  endDate: 1681273318
};

type BillOverviewInfo = {
  amount: number;
  planName: string;
  customerEmail: string;
  customerName: string;
  periodStart: string;
  periodEnd: string;
  freeTrialDuration: number;
};

export default function BillingSubscriptionPage() {
  const [modal, setModal] = useState(false);
  const userInfo = useContext(UserContext);
  const { id: userId } = userInfo;
  const domainURL = `${window.location.hostname}:${window.location.port}`;
  const [billOverviewInfo, setBillOverviewInfo] = useState<BillOverviewInfo | null>(null);
  const [isSubscrbePlan, setIsSubscribePlan] = useState(false);
  const [isUserFreeTrial, setIsUserFreeTrial] = useState(false);

  const { visible, setVisible, myRef } = useOutsideAlerter(false);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.post(`${config.apiAddress}/payment/info/billingOverview`, {
        userId
      });
      setBillOverviewInfo(res.data);
    };

    const checkIsSubscribePlan = async () => {
      const res = await axios.get(`${config.apiAddress}/payment/check/isUserSubscribePlan`, {});
      setIsSubscribePlan(res.data);
    };

    const checkIsUserFreeTrial = async () => {
      const res = await axios.get(`${config.apiAddress}/payment/check/isUserFreeTrial`, {});
      setIsUserFreeTrial(res.data);
    };

    fetchData();
    checkIsSubscribePlan();
    checkIsUserFreeTrial();
  }, [domainURL, userId]);

  const showOptions = () => {
    setVisible((prev) => !prev);
  };

  return (
    <>
      <div className={styles.pageContainer}>
        <MainMenuV2 />
        <SubSettingMenu items={paymentButtons} />
        <div className={styles.sectionContainer}>
          <h2>Manage subscriptions</h2>
          <div className={styles.rowLayout}>
            <div className={styles.mainColumn}>
              {!isSubscrbePlan && (
                <div className={styles.warnBox}>
                  <div>
                    <IoWarning color="orange" fontSize="1.5rem" />
                  </div>
                  <div className={styles.flexCol}>
                    <h4>We need your payment details</h4>
                    <p className={styles.textSecondary}>
                      Your free trials end soon. Add your payment details to keep enjoying the
                      benefits of your Techscrum product.
                    </p>
                    <Link className={styles.links} to="/billing/paymentdetails/add">
                      Add payment details
                    </Link>
                  </div>
                </div>
              )}

              <div className={styles.subscriptionsBox}>
                <p className={styles.subscriptionsBoxTitle}>
                  <b>ACTIVE SUBSCRIPTIONS</b>
                </p>
                <div className={`${styles.planBox} ${styles.cardBox}`}>
                  <h3 className={styles.planTitle}>
                    <img src={logo} alt="logo" className={styles.logoIcon} />
                    <span>TechScrum Access</span>
                    {isSubscrbePlan && isUserFreeTrial && (
                      <span className={styles.label}>FREE TRIAL</span>
                    )}
                  </h3>
                  {isSubscrbePlan && (
                    <div className={styles.planEndDate}>
                      <p className={styles.textSecondary}>Price estimate</p>
                      {isUserFreeTrial ? (
                        <p>Free until {billOverviewInfo?.periodEnd}</p>
                      ) : (
                        <p>
                          {billOverviewInfo?.amount}
                          .00
                        </p>
                      )}
                    </div>
                  )}
                  <div className={styles.planFooter}>
                    <Link className={styles.trialBtn} to="/price">
                      {isSubscrbePlan ? 'Change plan' : 'Start the trial'}
                    </Link>
                    <div className={styles.planOptionsBtn} ref={myRef}>
                      <button className={styles.dotsBtn} onClick={showOptions}>
                        ...
                      </button>
                      <ul
                        className={
                          visible ? `${styles.planOptions} ${styles.active}` : styles.planOptions
                        }
                      >
                        {isSubscrbePlan && (
                          <li>
                            <button className={styles.optionBtn} onClick={() => setModal(true)}>
                              Unsubscribe
                            </button>
                          </li>
                        )}

                        <li>
                          <Link className={styles.optionBtn} to="/support-center">
                            Get support
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.sideColumn}>
              {!isSubscrbePlan && (
                <div className={`${styles.cardBox} ${styles.flexCol}`}>
                  <h4>Payment options</h4>
                  <p>
                    Start monthly subscription{' '}
                    <Link to="/billing/paymentdetails" className={styles.links}>
                      Add billing details
                    </Link>
                  </p>
                  <p>
                    See pricing and pay for your site{' '}
                    <Link to="/price" className={styles.links}>
                      Choose annual payment
                    </Link>
                  </p>
                </div>
              )}

              <div className={`${styles.cardBox} ${styles.flexCol}`}>
                <div>
                  <h4>Current Bill</h4>
                  {isSubscrbePlan && (
                    <p className={styles.textSecondary}>
                      {billOverviewInfo?.periodStart} - {billOverviewInfo?.periodEnd}
                    </p>
                  )}
                </div>
                {!isSubscrbePlan ? (
                  <p className={`${styles.currentPlan} ${styles.flexBetween}`}>
                    <span>Free Plan</span>
                    <span>$0.00</span>
                  </p>
                ) : (
                  <p className={`${styles.currentPlan} ${styles.flexBetween}`}>
                    <span>{billOverviewInfo?.planName}</span>
                    <span>${billOverviewInfo?.amount}.00</span>
                  </p>
                )}
                <div className={styles.sideColumn__footer}>
                  <p className={`${styles.textSecondary} ${styles.flexBetween}`}>
                    <span>TAX</span>
                    <span>$0.00</span>
                  </p>
                  <p className={`${styles.textSecondary} ${styles.flexBetween}`}>
                    <span>TOTAL</span>
                    {!isSubscrbePlan ? (
                      <span className={styles.totalPrice}>AUD 0.00</span>
                    ) : (
                      <span className={styles.totalPrice}>AUD {billOverviewInfo?.amount}.00</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {modal && <PopUpModal user={userFree} setModal={setModal} />}
    </>
  );
}
