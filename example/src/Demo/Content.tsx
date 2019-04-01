/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import styled from 'styled-components';

const Wrap = styled.div`
  padding: 16px;
  border: 2px solid purple;
  background-color: #8000802e;
  color: purple;
`;

export default (data, forceUpdate) => (
  <Wrap>
    {JSON.stringify(data)}
    <a style={{ float: 'right' }} onClick={forceUpdate}>
      强制刷新
    </a>
  </Wrap>
);
