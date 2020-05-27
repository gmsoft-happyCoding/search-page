/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useCallback } from 'react';
import styled from 'styled-components';
import { ContentProps } from 'search-page';

const Wrap = styled.div`
  padding: 16px;
  border: 2px solid purple;
  background-color: #8000802e;
  color: purple;
`;

const Content = ({ data, forceUpdate, loading, filters, pagination }: ContentProps) => {
  const update = useCallback(() => forceUpdate({ pagination: { current: 3 } }), [forceUpdate]);

  return (
    <Wrap>
      data: {JSON.stringify(data)}
      <br />
      filters: {JSON.stringify(filters)}
      <a style={{ float: 'right' }} onClick={update}>
        强制刷新
      </a>
    </Wrap>
  );
};

export default Content;
