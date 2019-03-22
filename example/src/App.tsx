import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import React from 'react';
import { hot, setConfig } from 'react-hot-loader';
import { Provider } from 'react-redux';
import { stateContainer } from './utils';
import Demo from './Demo';
import 'antd/dist/antd.css';

const App = () => (
  <LocaleProvider locale={zhCN}>
    <Provider store={stateContainer._store}>
      <Demo />
    </Provider>
  </LocaleProvider>
);

// @ts-ignore
setConfig({ pureSFC: true });
export default hot(module)(App);
