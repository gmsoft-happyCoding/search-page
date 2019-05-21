import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import React from 'react';
import { Router } from 'react-router-dom';
// import { hot, setConfig } from 'react-hot-loader';
import { Provider } from 'react-redux';
import { stateContainer } from './utils';
import BuildFiltersFormDemo from './BuildFiltersFormDemo';
import FormWrapperDemo from './FormWrapperDemo';
import HandwrittenFormDemo from './HandwrittenFormDemo';
import 'antd/dist/antd.css';

const App = () => (
  <LocaleProvider locale={zhCN}>
    <Provider store={stateContainer._store}>
      <Router history={stateContainer._history}>
        <>
          <BuildFiltersFormDemo />
          <FormWrapperDemo />
          <HandwrittenFormDemo />
        </>
      </Router>
    </Provider>
  </LocaleProvider>
);

export default App;

// @ts-ignore
// setConfig({ pureSFC: true });
// export default hot(module)(App);
