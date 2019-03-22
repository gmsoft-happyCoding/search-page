// Wonder why the development environment needs to be set to var? Webpack bug?
// output.libraryTarget 为 umd 时设置为 root, 为 var 时需要设置为 var
module.exports = (global = 'var') => ({
  // react: {
  //   [global]: 'React',
  //   amd: 'react',
  //   commonjs: 'react',
  //   commonjs2: 'react',
  // },
  // 'react-dom': {
  //   [global]: 'ReactDOM',
  //   amd: 'react-dom',
  //   commonjs: 'react-dom',
  //   commonjs2: 'react-dom',
  // },
  // 'styled-components': {
  //   [global]: 'styled',
  //   amd: 'styled-components',
  //   commonjs: 'styled-components',
  //   commonjs2: 'styled-components',
  // },
  // antd: {
  //   [global]: 'antd',
  //   amd: 'antd',
  //   commonjs: 'antd',
  //   commonjs2: 'antd',
  // },
  // moment: {
  //   [global]: 'moment',
  //   amd: 'moment',
  //   commonjs: 'moment',
  //   commonjs2: 'moment',
  // },
  // history: {
  //   [global]: 'History',
  //   amd: 'history',
  //   commonjs: 'history',
  //   commonjs2: 'history',
  // },
  // 'react-router-dom': {
  //   [global]: 'ReactRouterDOM',
  //   amd: 'react-router-dom',
  //   commonjs: 'react-router-dom',
  //   commonjs2: 'react-router-dom',
  // },
  // redux: {
  //   [global]: 'Redux',
  //   amd: 'redux',
  //   commonjs: 'redux',
  //   commonjs2: 'redux',
  // },
  // 'redux-saga': {
  //   [global]: 'ReduxSaga',
  //   amd: 'redux-saga',
  //   commonjs: 'redux-saga',
  //   commonjs2: 'redux-saga',
  // },
  // 'react-router-redux': {
  //   [global]: 'ReactRouterRedux',
  //   amd: 'react-router-redux',
  //   commonjs: 'react-router-redux',
  //   commonjs2: 'react-router-redux',
  // },
  // 'react-redux': {
  //   [global]: 'ReactRedux',
  //   amd: 'react-redux',
  //   commonjs: 'react-redux',
  //   commonjs2: 'react-redux',
  // },
  // 'redux-actions': {
  //   [global]: 'ReduxActions',
  //   amd: 'redux-actions',
  //   commonjs: 'redux-actions',
  //   commonjs2: 'redux-actions',
  // },
  // 'dva-core': {
  //   [global]: 'DvaCore',
  //   amd: 'dva-core',
  //   commonjs: 'dva-core',
  //   commonjs2: 'dva-core',
  // },
  // 'state-container': {
  //   [global]: 'StateContainer',
  //   amd: 'state-container',
  //   commonjs: 'state-container',
  //   commonjs2: 'state-container',
  // },
  // axios: {
  //   [global]: 'axios',
  //   amd: 'axios',
  //   commonjs: 'axios',
  //   commonjs2: 'axios',
  // },
  // systemjs: {
  //   [global]: 'SystemJS',
  //   amd: 'systemjs',
  //   commonjs: 'systemjs',
  //   commonjs2: 'systemjs',
  // },
  // reselect: {
  //   [global]: 'Reselect',
  //   amd: 'reselect',
  //   commonjs: 'reselect',
  //   commonjs2: 'reselect',
  // },
  // 'react-virtualized': {
  //   [global]: 'ReactVirtualized',
  //   amd: 'react-virtualized',
  //   commonjs: 'react-virtualized',
  //   commonjs2: 'react-virtualized',
  // },
  // 'react-virtualized-tree': {
  //   [global]: 'reactVirtualizedTree',
  //   amd: 'react-virtualized-tree',
  //   commonjs: 'react-virtualized-tree',
  //   commonjs2: 'react-virtualized-tree',
  // },
});
