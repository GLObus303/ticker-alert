import { Checkbox, InputNumber, Modal } from 'antd';
import { useState } from 'react';

import { StockType } from './Stocks';

type AlertModalProps = {
  selectedStocks: StockType[];
  visibleModalForTicker: string;
  handleAlert: (newList?: StockType[]) => void;
  hideAlertModal: () => void;
};

export const AlertModal: React.FC<AlertModalProps> = ({
  selectedStocks,
  visibleModalForTicker,
  handleAlert,
  hideAlertModal,
}) => {
  const stock = selectedStocks.find(
    ({ ticker }) => ticker === visibleModalForTicker,
  );

  const [userWantsAlert, setUserWantsAlert] = useState(!!stock?.hasAlert);
  const [priceTreshold, setPriceTreshold] = useState(stock?.priceTreshold || 0);

  const handleAlertPreferenceChange = () => {
    setUserWantsAlert((prevPreference) => !prevPreference);
  };

  const handleTresholdChange = (value: number) => {
    setPriceTreshold(value);
  };

  const handleEdit = () => {
    if (!stock) {
      return handleAlert();
    }

    const newList = selectedStocks.map((item) =>
      stock.ticker === item.ticker
        ? {
            ...item,
            hasAlert: userWantsAlert,
            priceTreshold,
          }
        : item,
    );

    handleAlert(newList);
  };

  return (
    <Modal
      title="Edit alert"
      visible={!!visibleModalForTicker}
      okText="Edit"
      cancelText="Cancel"
      onOk={handleEdit}
      onCancel={hideAlertModal}
    >
      <div>
        <Checkbox
          checked={userWantsAlert}
          onChange={handleAlertPreferenceChange}
        >
          Alert me when the stock price deviates from the opening price by:
        </Checkbox>

        <InputNumber<number>
          value={priceTreshold}
          onChange={handleTresholdChange}
        />
      </div>
    </Modal>
  );
};
