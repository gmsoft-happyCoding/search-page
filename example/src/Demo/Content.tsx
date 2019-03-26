import React from 'react';
import styled from 'styled-components';

const Wrap = styled.div`
  padding: 16px;
  border: 2px solid purple;
  background-color: #8000802e;
  color: purple;
`;

export default data => <Wrap>{JSON.stringify(data)}</Wrap>;
