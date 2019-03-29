module.exports = {
  presets: ['react-app'],
  plugins: [
    // 'react-hot-loader/babel',
    [
      'styled-components',
      {
        displayName: true,
      },
    ],
    'lodash',
    [
      'ramda',
      {
        useES: true,
      },
    ],
  ],
};
