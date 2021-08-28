import { message } from 'antd';
import axios from 'axios';

import { StockType } from '../components/Stocks';

type ReturnStockType = Omit<StockType, 'stock' | 'priceTreshold'>;

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
      `/price/${tickerList.join(',')}`,
    );

    if (axiosResponse?.data) {
      return axiosResponse.data;
    }
  } catch (error: any) {
    message.error(error?.message);
  }

  return null;
};
