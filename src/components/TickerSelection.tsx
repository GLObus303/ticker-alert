import { useEffect, useMemo, useState } from 'react';
import { Button, Select } from 'antd';
import { Form } from 'antd';

import { getSymbols } from '../api/referenceData';
import { StockType } from './Stocks';

const { Option } = Select;

type TickerSelectionProps = {
  addNewStock: (ticker: string) => void;
  selectedStockMap: Map<string, StockType>;
};

export const TickerSelection: React.FC<TickerSelectionProps> = ({
  addNewStock,
  selectedStockMap,
}) => {
  const [symbols, setSymbols] = useState<string[] | null>();

  const [form] = Form.useForm();

  useEffect(() => {
    const fetchSymbols = async () => {
      const data = await getSymbols();

      setSymbols(data);
    };
    fetchSymbols();
  }, []);

  const filteredSymbols = useMemo(
    () => symbols?.filter((symbol) => !selectedStockMap.has(symbol)),
    [selectedStockMap, symbols],
  );

  const handleSubmit = ({ ticker }: { ticker: string }) => {
    addNewStock(ticker);
    form.resetFields();
  };

  const handleTickerSelection = (value: string) => {
    form.setFieldsValue({ ticker: value });
  };

  return (
    <div className="mt-8">
      <Form<{ ticker: string }> onFinish={handleSubmit} form={form}>
        <Form.Item name="ticker" label="Select">
          <Select placeholder="Select a stock" onChange={handleTickerSelection}>
            {filteredSymbols?.map((ticker: string) => (
              <Option key={ticker} value={ticker}>
                {ticker}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <div className="flex justify-end  mt-4">
          <Button type="primary" htmlType="submit">
            Add
          </Button>
        </div>
      </Form>
    </div>
  );
};
