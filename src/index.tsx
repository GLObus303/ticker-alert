import ReactDOM from 'react-dom';
import axios from 'axios';

import App from './App';

import './styles/globalStyles.css';
import 'antd/dist/antd.css';

axios.defaults.baseURL = 'http://localhost:5000';

ReactDOM.render(<App />, document.getElementById('root'));
