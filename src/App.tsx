import { Tabs } from 'antd';

import { Stocks } from './components/Stocks';
import { Alerts } from './components/Alerts';

const { TabPane } = Tabs;

const App = () => (
  <div className="p-4">
    <div className="text-2xl font-semibold mb-4">Stock alert</div>

    <Tabs defaultActiveKey="1" centered type="card">
      <TabPane tab="Stocks" key="1" className="flex justify-center w-full">
        <Stocks />
      </TabPane>
      <TabPane tab="Alerts" key="2" className="flex justify-center w-full">
        <Alerts />
      </TabPane>
    </Tabs>
  </div>
);

export default App;
