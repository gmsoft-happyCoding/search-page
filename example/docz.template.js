const fs = require('fs');
const path = require('path');

process.env.NODE_ENV = 'development';

const getClientEnvironment = require('./config/env');
const env = getClientEnvironment();
const cdnServer = env.raw.REACT_APP_CDN_SERVER;

const links = ['??antd/3.14.1/antd.css,antd/3.14.1/custom-antd.css'];

const scripts = [
  'polyfill/1.0.0/polyfill.js',
  'react/16.8.1/react.development.js',
  'react-dom/16.8.1/react-dom.development.js',
  'moment/2.22.2/moment.js',
  'moment/2.22.2/locale.zh-cn.js',
  'moment/use-locale.js',
  'antd/3.14.1/antd.js',
  'styled-components/4.1.1/styled-components.js',
  'history/4.7.2/history.js',
  'react-router-dom/4.3.1/react-router-dom.js',
  'redux/4.0.1/redux.js',
  'redux-saga/0.16.2/redux-saga.js',
  'react-router-redux/4.0.8/ReactRouterRedux.js',
  'react-redux/6.0.1/react-redux.js',
  'redux-actions/2.6.4/redux-actions.js',
  'reselect/4.0.0/reselect.js',
  'react-virtualized/9.21.0/react-virtualized.js',
  'react-virtualized-tree/2.0.2/react-virtualized-tree.js',
  'dva-core/1.5.0-beta.2/dva-core.js',
  'immer/1.8.0/immer.umd.js',
  'state-container/1.0.0/state-container.js',
  'axios/0.18.0/axios.js',
  'systemjs/0.21.5/system.src.js',
];

const html = `
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="description" content="{{ description }}" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>{{ title }}</title>
    {{
      head
    }}
  </head>
  <body>
    ${links.map(link => `<link href="${cdnServer}/${link}" rel="stylesheet" />`).join('\n')}
    ${scripts
      .map(script => `<script crossorigin="anonymous" src="${cdnServer}/${script}"></script>`)
      .join('\n')}
    <div id="root"></div>
    {{ footer }}
  </body>
</html>
`;

fs.writeFileSync(path.join(__dirname, 'public/index.docz.html'), html);
