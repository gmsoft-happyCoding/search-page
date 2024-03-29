/*
 * @Author: Gmsoft - WeiHong Ran
 * @Date: 2021-05-11 22:18:24
 * @LastEditors: Gmsoft - WeiHong Ran
 * @LastEditTime: 2021-05-11 22:19:26
 * @Description: Nothing
 */
import { LocaleProvider, Divider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import React from 'react';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { stateContainer } from './utils';
import BuildFiltersFormDemo from './BuildFiltersFormDemo';
import FormWrapperDemo from './FormWrapperDemo';
import HandwrittenFormDemo from './HandwrittenFormDemo';
import CustomWidthDemo from './CustomWidthDemo';
import 'antd/dist/antd.css';

const App = () => (
  <LocaleProvider locale={zhCN}>
    <Provider store={stateContainer._store}>
      <Router history={stateContainer._history}>
        <>
          <Divider type="horizontal">CustomWidthDemo</Divider>
          <CustomWidthDemo />
          <Divider type="horizontal">BuildFiltersFormDemo</Divider>
          <BuildFiltersFormDemo />
          <Divider type="horizontal">FormWrapperDemo</Divider>
          <FormWrapperDemo />
          <Divider type="horizontal">HandwrittenFormDemo</Divider>
          <HandwrittenFormDemo />
        </>
      </Router>
    </Provider>
  </LocaleProvider>
);
// Nothing
export default App;

// @ts-ignore
// setConfig({ pureSFC: true });
// export default hot(module)(App);
