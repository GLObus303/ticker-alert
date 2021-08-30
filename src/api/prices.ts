import { message } from 'antd';
import axios from 'axios';

import { StockType } from '../components/Stocks';

type ReturnStockType = Pick<StockType, 'bid' | 'ask' | 'lastVol' | 'open'> & {
  symbol: string;
};

export const getDataForStock = async (ticker: string) => {
  try {
    const axiosResponse = await axios.get<ReturnStockType>(`/price/${ticker}`);

    if (axiosResponse?.data) {
      return axiosResponse.data;
    }
  } catch (error: any) {
    message.error(error?.message);
  }

  return null;
};

export const getDataListForStocks = async (tickerList: string[]) => {
  try {
    const axiosResponse = await axios.get<ReturnStockType[]>(
      `/prices/${tickerList.join(',')}`,
    );

    if (axiosResponse?.data) {
      return axiosResponse.data;
    }
  } catch (error: any) {
    message.error(error?.message);
  }

  return null;
};

export const createDebugMarketHit = (ticker: string) =>
  axios.get(`/fake-hit/${ticker}?percentage=0.5`);
