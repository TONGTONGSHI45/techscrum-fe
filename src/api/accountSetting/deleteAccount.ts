import axios from 'axios';
import { DeleteAccountForm } from './entity/accountSetting';
import config from '../../config/config';

const deleteAccount = async (deleteAccountForm: DeleteAccountForm) => {
  const path = `${config.apiAddress}/account`;

  const configHeader = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token') ?? ''}`
    }
  };

  const body = {
    data: {
      ...deleteAccountForm
    }
  };

  const result = await axios.delete(path, { ...configHeader, ...body });
  return result;
};

export default deleteAccount;
