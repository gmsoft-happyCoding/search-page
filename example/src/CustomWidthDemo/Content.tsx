import React, { useRef, useMemo, useState, useCallback } from 'react';
import styled from 'styled-components';
import { useSearchPageContent, ResizeableTitle, getColumnConfs } from 'search-page';
import { Table, Button } from 'antd';

const Wrap = styled.div`
  padding: 16px;
  border: 2px solid purple;
`;

const components = { header: { cell: ResizeableTitle } };

export default () => {
  const {
    data,
    forceUpdate,
    dispatch,
    tableWidthConfs,
    storeKey,
    filters,
  } = useSearchPageContent();

  const tableRef = useRef<any>();
  const [columnConfs, setColumnConfs] = useState([
    {
      title: 'id',
      key: 'id',
      dataIndex: 'id',
      width: 100,
    },
    {
      title: 'operate',
      key: 'operate',
      dataIndex: 'operate',
    },
  ]);

  const renderColumnsConf = useMemo(
    () =>
      getColumnConfs({
        columnConfs,
        setConfs: setColumnConfs,
        dispatch,
        tableWidthConfs,
        storeKey,
      }),
    [columnConfs, dispatch, storeKey, tableWidthConfs]
  );

  const update = useCallback(() => forceUpdate(), [forceUpdate]);

  return (
    <Wrap>
      <Table
        ref={tableRef}
        rowKey="id"
        dataSource={data.data}
        columns={renderColumnsConf}
        pagination={false}
        components={components}
        size="small"
      />
      {JSON.stringify(filters)}
      <Button style={{ float: 'right' }} type="link" onClick={update}>
        强制刷新
      </Button>
    </Wrap>
  );
};
