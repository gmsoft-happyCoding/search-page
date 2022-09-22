import React, { useCallback } from 'react';
import styled from 'styled-components';
import { useSearchPageContent } from 'search-page';

const Wrap = styled.div`
  padding: 16px;
  border: 2px solid purple;
  background-color: #8000802e;
  color: purple;
`;

export default () => {
  const { data, forceUpdate } = useSearchPageContent();

  const update = useCallback(() => forceUpdate(), [forceUpdate]);

  return (
    <Wrap>
      {JSON.stringify(data)}
      <a style={{ float: 'right' }} onClick={update}>
        强制刷新
      </a>
    </Wrap>
  );
};
