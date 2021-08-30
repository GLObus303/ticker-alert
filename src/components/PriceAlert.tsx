import { useEffect } from 'react';

import { StockType } from './Stocks';

type PriceAlertProps = {
  sendAlert: (ticker: string, priceTreshold: number) => void;
} & Omit<StockType, 'lastVol'>;

export const PriceAlert: React.FC<PriceAlertProps> = ({
  hasAlert,
  priceTreshold,
  open,
  ask,
  bid,
  sendAlert,
  ticker,
}) => {
  useEffect(() => {
    if (!hasAlert) {
      return;
    }

    const currentEstimateOfPrice = (ask + bid) / 2;
    const priceTresholdPercentage = priceTreshold / 100;
    const upperBound = open * (priceTresholdPercentage + 1);
    const lowerBound = open * (1 - priceTresholdPercentage);

    if (currentEstimateOfPrice > upperBound) {
      sendAlert(ticker, priceTreshold);

      return;
    }

    if (currentEstimateOfPrice < lowerBound) {
      sendAlert(ticker, -priceTreshold);
    }
  }, [hasAlert, priceTreshold, open, ask, bid]);

  return (
    <div className="flex">
      {hasAlert ? <div className="mr-2">{priceTreshold}%</div> : 'No alert'}
    </div>
  );
};
