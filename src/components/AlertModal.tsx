import { Checkbox, InputNumber, Modal } from 'antd';
import { useState } from 'react';

import { StockType } from './Stocks';

type AlertModalProps = {
  selectedStocks: Map<string, StockType>;
  visibleModalStockName: string;
  handleAlert: (newMap?: Map<string, StockType>) => void;
  hideAlertModal: () => void;
};

export const AlertModal: React.FC<AlertModalProps> = ({
  selectedStocks,
  visibleModalStockName,
  handleAlert,
  hideAlertModal,
}) => {
  const stock = selectedStocks.get(visibleModalStockName);

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

    const newMap = new Map(selectedStocks);
    newMap.delete(visibleModalStockName);
    newMap.set(visibleModalStockName, {
      ...stock,
      hasAlert: userWantsAlert,
      priceTreshold,
    });

    handleAlert(newMap);
  };

  return (
    <Modal
      title="Edit alert"
      visible={!!visibleModalStockName}
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
