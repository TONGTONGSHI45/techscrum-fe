import axios from 'axios';
import { Login } from './entity/login';
import config from '../../config/config';

export default async function loginv2(loginForm: Login) {
  const path = `${config.apiAddress}/loginv2`;
  const result = await axios.post(path, { ...loginForm });
  return result;
}
