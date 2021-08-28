import { message } from 'antd';
import axios from 'axios';

export const getSymbols = async () => {
  try {
    const axiosResponse = await axios.get<string[]>('/static/tickers');

    if (axiosResponse?.data) {
      return axiosResponse.data;
    }
  } catch (error: any) {
    message.error(error?.message);
  }

  return null;
};
