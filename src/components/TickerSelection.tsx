import { useEffect, useState } from 'react';
import { Button, Select } from 'antd';
import { Form } from 'antd';

import { getSymbols } from '../api/referenceData';

const { Option } = Select;

type TickerSelectionProps = {
  addNewStock: (tickerName: string) => void;
};

export const TickerSelection: React.FC<TickerSelectionProps> = ({
  addNewStock,
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

  const handleSubmit = ({ ticker }: { ticker: string }) => {
    addNewStock(ticker);
  };

  const handleTickerSelection = (value: string) => {
    form.setFieldsValue({ ticker: value });
  };

  return (
    <div className="mt-8">
      <Form<{ ticker: string }> onFinish={handleSubmit} form={form}>
        <Form.Item name="ticker" label="Select">
          <Select placeholder="Select a stock" onChange={handleTickerSelection}>
            {symbols?.map((ticker: string) => (
              <Option key={ticker} value={ticker}>
                {ticker}
              </Option>
            ))}
          </Select>
          <div className="flex justify-end  mt-4">
            <Button type="primary" htmlType="submit">
              Add
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};
