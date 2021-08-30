import { Button, Popconfirm, Table, message } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { DeleteOutlined } from '@ant-design/icons';
import { ColumnsType } from 'antd/lib/table';

import { TickerSelection } from './TickerSelection';
import {
  createDebugMarketHit,
  getDataForStock,
  getDataListForStocks,
} from '../api/prices';
import { AlertModal } from './AlertModal';
import { reduceArrayToMap } from '../utils/reduceArrayToMap';
import { PriceAlert } from './PriceAlert';

export type StockType = {
  ticker: string;
  bid: number;
  ask: number;
  lastVol: number;
  open: number;
  hasAlert: boolean;
  priceTreshold: number;
};

const getColumns = (
  removeStock: (stockName: string) => void,
  showAlertModal: (stockName: string) => void,
  sendAlert: (ticker: string, priceTreshold: number) => void,
): ColumnsType<StockType> => [
  {
    title: 'Stock',
    dataIndex: 'ticker',
    key: 'ticker',
    defaultSortOrder: 'ascend',
    sorter: (a, b) => a.ticker.localeCompare(b.ticker),
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
      <PriceAlert
        hasAlert={hasAlert}
        priceTreshold={record.priceTreshold}
        ask={record.ask}
        bid={record.bid}
        open={record.open}
        sendAlert={sendAlert}
        ticker={record.ticker}
      />
    ),
  },
  {
    title: 'Options',
    key: 'options',
    render: (record: StockType) => (
      <div className="flex items-center">
        <Popconfirm
          title="Are you sure to delete this stock?"
          onConfirm={() => removeStock(record.ticker)}
          okText="Yes"
          cancelText="No"
        >
          <DeleteOutlined />
        </Popconfirm>
        <Button
          size="small"
          type="primary"
          className="ml-2"
          onClick={() => showAlertModal(record.ticker)}
        >
          Alert
        </Button>
        <Button
          size="small"
          type="primary"
          className="ml-2"
          onClick={() => createDebugMarketHit(record.ticker)}
        >
          Hit
        </Button>
      </div>
    ),
  },
];

export const Stocks = () => {
  const [shownAlerts, setShownAlerts] = useState(new Map());
  const [selectedStocks, setSelectedStocks] = useState<StockType[]>([]);
  const [visibleModalForTicker, setVisibleModalForTicker] = useState<string>();

  const selectedStockTickerList = useMemo(
    () => selectedStocks.map(({ ticker }) => ticker),
    [selectedStocks],
  );
  const selectedStockMap = useMemo(
    () => reduceArrayToMap(selectedStocks, 'ticker'),
    [selectedStocks],
  );

  useEffect(() => {
    if (!selectedStockTickerList.length) {
      return;
    }

    const intervalRef = setInterval(async () => {
      const newList = await getDataListForStocks(selectedStockTickerList);

      if (newList?.length) {
        setSelectedStocks(
          newList.map(({ symbol, ...newStock }) => {
            const prevStock = selectedStockMap.get(symbol);

            return {
              ...newStock,
              ticker: symbol,
              hasAlert: prevStock?.hasAlert || false,
              priceTreshold: prevStock?.priceTreshold || 0,
            };
          }),
        );
      }
    }, 3000);

    return () => {
      clearInterval(intervalRef);
    };
  }, [selectedStockTickerList]);

  const addNewStock = async (ticker: string) => {
    const data = await getDataForStock(ticker);

    if (data) {
      const { symbol, ...newStock } = data;
      setSelectedStocks([
        ...selectedStocks,
        {
          hasAlert: false,
          priceTreshold: 0,
          ticker: symbol,
          ...newStock,
        },
      ]);
    }
  };

  const removeStock = (ticker: string) => {
    const newList = selectedStocks.filter((stock) => stock.ticker !== ticker);

    setSelectedStocks(newList);
  };

  const hideAlertModal = () => {
    setVisibleModalForTicker(undefined);
  };

  const showAlertModal = (ticker: string) => {
    setVisibleModalForTicker(ticker);
  };

  const handleAlert = (newList?: StockType[]) => {
    if (newList) {
      setSelectedStocks(newList);
    }

    hideAlertModal();
  };

  const sendAlert = (ticker: string, priceTreshold: number) => {
    if (shownAlerts.has(ticker)) {
      return;
    }

    const newAlerts = new Map(shownAlerts);
    newAlerts.set(ticker, ticker);
    setShownAlerts(newAlerts);
    message.info(`Price for ${ticker} changed by ${priceTreshold}%`);
  };

  return (
    <div className="max-w-screen-lg w-full">
      <Table<StockType>
        columns={getColumns(removeStock, showAlertModal, sendAlert)}
        dataSource={Array.from(selectedStocks.values())}
        className="overflow-x-auto"
        pagination={false}
        rowKey="ticker"
      />
      <TickerSelection
        addNewStock={addNewStock}
        selectedStockMap={selectedStockMap}
      />
      {visibleModalForTicker && (
        <AlertModal
          hideAlertModal={hideAlertModal}
          handleAlert={handleAlert}
          visibleModalForTicker={visibleModalForTicker}
          selectedStocks={selectedStocks}
        />
      )}
    </div>
  );
};
