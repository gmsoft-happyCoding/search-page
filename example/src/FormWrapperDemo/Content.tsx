import React, { Dispatch, SetStateAction, useCallback } from 'react';
import styled from 'styled-components';
import { useSearchPageContent } from 'search-page';
import { Table } from 'antd';

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    render: text => <a>{text}</a>,
  },
  {
    title: 'Age',
    dataIndex: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
  },
];

const testData = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
  },
  {
    key: '4',
    name: 'Disabled User',
    age: 99,
    address: 'Sidney No. 1 Lake Park',
  },
];

const Wrap = styled.div`
  padding: 16px;
  border: 2px solid purple;
  background-color: #8000802e;
  color: purple;
`;

interface Props {
  setSelectedRowKeys: Dispatch<SetStateAction<string[]>>;
}

export default ({ setSelectedRowKeys }: Props) => {
  const { data, forceUpdate } = useSearchPageContent();

  const update = useCallback(() => forceUpdate(), [forceUpdate]);

  // rowSelection object indicates the need for row selection
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: record => ({
      disabled: record.name === 'Disabled User', // Column configuration not to be checked
      name: record.name,
    }),
  };

  return (
    <Wrap>
      {JSON.stringify(data)}
      <Table rowSelection={rowSelection} columns={columns} dataSource={testData} />
      <a style={{ float: 'right' }} onClick={update}>
        强制刷新
      </a>
    </Wrap>
  );
};
