import React, { useEffect, useRef, useMemo, useCallback, useState } from 'react';
import styled from 'styled-components';
import { ContentProps, ResizeableTitle, getColumnConfs } from 'search-page';
import { Table, Button } from 'antd';

const Wrap = styled.div`
  padding: 16px;
  border: 2px solid purple;
`;

const components = { header: { cell: ResizeableTitle } };

export default ({ data, forceUpdate, dispatch, tableWidthConfs, storeKey }: ContentProps) => {
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
      {JSON.stringify(data)}
      <Button style={{ float: 'right' }} type="link" onClick={forceUpdate}>
        强制刷新
      </Button>
    </Wrap>
  );
};
