import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { AxiosError } from 'axios';
import { emailCheck, emailVerifyCheck } from '../../../api/register/emailCheck';
import { IUserInfo } from '../../../types';
import { UserDispatchContext } from '../../../context/UserInfoProvider';
import register from '../../../api/register/register';
import styles from './RegisterMain.module.scss';
import Icon from '../../../assets/logo.svg';
import GoogleIcon from './google-logo.svg';
import MicrosoftIcon from './microsoft-logo.svg';
import AppleIcon from './apple-logo.svg';
import Email from '../../../assets/email.png';
import Error from '../../../assets/error.png';

export default function RegisterMain() {
  const navigate = useNavigate();
  /* eslint-disable no-useless-escape */
  const illegalCharacter = /[%&]/;

  const { token: emailToken } = useParams();
  const setUserInfo = useContext(UserDispatchContext);
  const [verifyEmail, setVerifyEmail] = useState('');
  const [emailRegisterProcess, setEmailRegisterProcess] = useState(false);
  const [emailCheckProcess, setEmailCheckProcess] = useState(false);
  const [invalidateStatus, setInvalidateStatus] = useState(false);
  let emailRecorder = '';
  let nameRecorder = '';
  let passwordRecorder = '';

  useEffect(() => {
    const fetchEmailByToken = async () => {
      if (emailToken !== undefined && emailToken != null) {
        try {
          const result = await emailVerifyCheck(emailToken);
          setVerifyEmail(result.data.email);
          setEmailCheckProcess(true);
        } catch (e) {
          setEmailRegisterProcess(true);
          setInvalidateStatus(true);
        }
      } else {
        navigate('/register');
      }
    };
    fetchEmailByToken();
  }, [emailToken, navigate]);

  const tip = (error: string) => {
    const tipLabel = document.getElementById('tip') as HTMLInputElement;
    tipLabel.textContent = error;
  };

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    if (!emailCheckProcess) {
      try {
        await emailCheck(emailRecorder);
        tip('');
        setEmailRegisterProcess(true);
      } catch (e) {
        const err = e as AxiosError;
        const status = err.response?.status ?? 0;
        if (status === 302) {
          tip('The email already exists. Please try again');
          return;
        }
        tip('Something go wrong, please try again');
      }
      return;
    }

    try {
      const result = await register(emailToken ?? 'undefined', {
        email: verifyEmail,
        name: nameRecorder,
        password: passwordRecorder
      });
      const { user, userProfile, token, refreshToken } = result.data;
      if (user && userProfile) {
        const userLoginInfo: IUserInfo = {
          id: user.id,
          email: user.email,
          name: userProfile.name,
          avatarIcon: userProfile.avatarIcon,
          token,
          refreshToken
        };
        setUserInfo(userLoginInfo);
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        navigate(`/projects`);
      } else {
        tip('*Incorrect email or password, please try again.');
      }
    } catch (e) {
      tip('Something go wrong, please contact staff');
    }
  };

  const setEmail = (email: string) => {
    emailRecorder = email;
  };

  const setName = (name: string) => {
    nameRecorder = name;
  };

  const setPassword = (password: string) => {
    if (!illegalCharacter.test(password) || password === '') {
      passwordRecorder = password;
      tip('');
    } else tip('Illegal Character Detected');
  };

  return (
    <div className={styles.registerMain}>
      <img src={Icon} alt="TechScrum Icon" />
      <form onSubmit={handleSubmit}>
        {emailRegisterProcess ? (
          <div className={styles.emailTip}>
            {invalidateStatus ? (
              <>
                <img src={Error} alt="Error Icon" />
                <h1>The link is invalidate, please contact the administrator</h1>
              </>
            ) : (
              <>
                <img src={Email} alt="Email Icon" />
                <h1>Email have Sent, Please check your email</h1>
              </>
            )}
          </div>
        ) : (
          <>
            <h1>Register to continue</h1>
            <h1>Your team&apos;s site</h1>
            <p id="tip" />
            <input
              className={styles.email}
              type="email"
              placeholder="Input Email Address"
              name="email"
              defaultValue={verifyEmail}
              onChange={(e) => setEmail(e.target.value)}
              disabled={emailCheckProcess}
              required
            />
            {emailCheckProcess && (
              <>
                <input
                  className={styles.password}
                  type="text"
                  placeholder="Input Your Name"
                  name="name"
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <input
                  className={styles.password}
                  type="password"
                  placeholder="Input Your Password"
                  name="password"
                  minLength={8}
                  maxLength={16}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </>
            )}
            <p>
              By registering, I accept the{' '}
              <Link to="/terms-of-service">TechScrum Terms of Service</Link> and confirm acceptance
              of the
              <Link to="/privacy-policy"> Privacy Policy.</Link>
            </p>
            <button type="submit">Register</button>
            <p>or</p>
            <div className={styles.btnList}>
              <a href="/#">
                <img src={GoogleIcon} alt="" />
                <span>Keep Using Google</span>
              </a>
              <a href="/#">
                <img src={MicrosoftIcon} alt="" />
                <span>Keep Using Microsoft</span>
              </a>
              <a href="/#">
                <img src={AppleIcon} alt="" />
                <span>Keep Using Apple</span>
              </a>
            </div>
            <div className={styles.formFooter}>
              <Link to="/login">Already have TechScrum Account? Login</Link>
            </div>
          </>
        )}
      </form>

      <p className={styles.registerMainFooter}>
        This page is protected by reCAPTCHA and complies with Google&apos;s
        <Link to="/privacy-policy"> Privacy Policy</Link> and{' '}
        <Link to="/terms-of-service">Terms of Service</Link>
      </p>
    </div>
  );
}
