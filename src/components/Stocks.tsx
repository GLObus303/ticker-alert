import { Button, Popconfirm, Table } from 'antd';
import { useState } from 'react';
import { DeleteOutlined } from '@ant-design/icons';
import { ColumnsType } from 'antd/lib/table';

import { TickerSelection } from './TickerSelection';
import { getDataForStock } from '../api/prices';
import { AlertModal } from './AlertModal';

export type StockType = {
  stock: string;
  bid: string;
  ask: string;
  vol: string;
  hasAlert: boolean;
  priceTreshold: number;
};

const getColumns = (
  removeStock: (stockName: string) => void,
  showAlertModal: (stockName: string) => void,
): ColumnsType<StockType> => [
  {
    title: 'Stock',
    dataIndex: 'stock',
    key: 'stock',
    defaultSortOrder: 'ascend',
    sorter: (a, b) => a.stock.localeCompare(b.stock),
  },
  {
    title: 'Bid',
    dataIndex: 'bid',
    key: 'bid',
    render: (bid: number) => <div>{bid.toFixed(2)}</div>,
  },
  {
    title: 'Ask',
    dataIndex: 'ask',
    key: 'ask',

    render: (ask: number) => <div>{ask.toFixed(2)}</div>,
  },
  {
    title: 'Vol',
    dataIndex: 'lastVol',
    key: 'lastVol',
  },
  {
    title: 'Alert',
    key: 'hasAlert',
    dataIndex: 'hasAlert',
    render: (hasAlert: boolean, record: StockType) => (
      <div className="flex">
        {hasAlert ? (
          <div className="mr-2">{record.priceTreshold}%</div>
        ) : (
          'No alert'
        )}
      </div>
    ),
  },
  {
    title: 'Options',
    key: 'options',
    render: (record: StockType) => (
      <div className="flex items-center">
        <Popconfirm
          title="Are you sure to delete this stock?"
          onConfirm={() => removeStock(record.stock)}
          okText="Yes"
          cancelText="No"
        >
          <DeleteOutlined />
        </Popconfirm>
        <Button
          size="small"
          type="primary"
          className="ml-2"
          onClick={() => showAlertModal(record.stock)}
        >
          Alert
        </Button>
      </div>
    ),
  },
];

export const Stocks = () => {
  const [selectedStocks, setSelectedStocks] = useState<Map<string, StockType>>(
    new Map(),
  );
  const [visibleModalStockName, setVisibleModalStockName] = useState<string>();

  const addNewStock = async (tickerName: string) => {
    const newMap = new Map(selectedStocks);

    const data = await getDataForStock(tickerName);

    if (data) {
      setSelectedStocks(
        newMap.set(tickerName, {
          stock: tickerName,
          priceTreshold: 0,
          ...data,
        }),
      );
    }
  };

  const removeStock = (stockName: string) => {
    const newMap = new Map(selectedStocks);
    newMap.delete(stockName);

    setSelectedStocks(newMap);
  };

  const hideAlertModal = () => {
    setVisibleModalStockName(undefined);
  };

  const showAlertModal = (stockName: string) => {
    setVisibleModalStockName(stockName);
  };

  const handleAlert = (newStockMap?: Map<string, StockType>) => {
    if (newStockMap) {
      setSelectedStocks(newStockMap);
    }

    hideAlertModal();
  };

  return (
    <div className="max-w-screen-lg w-full">
      <Table<StockType>
        columns={getColumns(removeStock, showAlertModal)}
        dataSource={Array.from(selectedStocks.values())}
        className="overflow-x-auto"
        pagination={false}
        rowKey="stock"
      />
      <TickerSelection addNewStock={addNewStock} />
      {visibleModalStockName && (
        <AlertModal
          hideAlertModal={hideAlertModal}
          handleAlert={handleAlert}
          visibleModalStockName={visibleModalStockName}
          selectedStocks={selectedStocks}
        />
      )}
    </div>
  );
};
