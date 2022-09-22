import React, { useRef, useCallback, useState } from 'react';
import createSearchPage, { GetDataApi, Mode, SearchMode } from 'search-page';
import { Button } from 'antd';
import FiltersForm from './FiltersForm';
import Content from './Content';

const getDataApi: GetDataApi = async (filters, pagination) => {
  // eslint-disable-next-line no-promise-executor-return
  await new Promise(resolve => setTimeout(resolve, 1000));
  const result = await Promise.resolve({ data: { filters, pagination }, total: 0 });
  return result;
};

const SearchPage = createSearchPage({
  filtersDefault: { orgName: 'gmsoft', name1: '1', name12: '2' },
  defaultMode: Mode.Simple,
  getDataApi,
  FiltersForm,
  // storeKey: 'FormWrapperDemo',
  noStore: true,
  searchMode: SearchMode.TIMELY,
  hideOnSinglePage: false,
  pageSize: 20,
});

const Demo = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<Array<string>>([]);

  const searchPageRef = useRef({ forceUpdate: () => undefined });
  const forceUpdate = useCallback(() => {
    searchPageRef.current.forceUpdate();
  }, []);
  return (
    <div style={{ padding: 16 }}>
      selectedRowKeys: {JSON.stringify(selectedRowKeys)}
      <SearchPage ref={searchPageRef}>
        <Content setSelectedRowKeys={setSelectedRowKeys} />
      </SearchPage>
      <Button onClick={forceUpdate}>强制刷新</Button>
    </div>
  );
};

export default Demo;
