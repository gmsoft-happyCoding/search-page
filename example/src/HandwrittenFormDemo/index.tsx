import React, { useRef, useCallback } from 'react';
import createSearchPage, { GetDataApi } from 'search-page';
import { Button } from 'antd';
import FiltersForm from './FiltersForm';
import Content from './Content';

const getDataApi: GetDataApi = async (filters, pagination) => {
  // eslint-disable-next-line no-promise-executor-return
  await new Promise(resolve => setTimeout(resolve, 100));
  const result = await Promise.resolve({ data: { filters, pagination }, total: 100 });
  return result;
};

const SearchPage = createSearchPage({
  filtersDefault: { orgName: 'gmsoft' },
  getDataApi,
  FiltersForm,
  storeKey: 'HandwrittenFormDemo',
  paginationProps: {
    size: 'small',
    showQuickJumper: false,
    showSizeChanger: false,
    showTotal: () => null,
  },
});

const Demo = () => {
  const searchPageRef = useRef({ forceUpdate: () => undefined });
  const forceUpdate = useCallback(() => {
    searchPageRef.current.forceUpdate();
  }, []);
  return (
    <div style={{ padding: 16 }}>
      <SearchPage ref={searchPageRef}>
        <Content />
      </SearchPage>
      <Button onClick={forceUpdate}>强制刷新</Button>
    </div>
  );
};

export default Demo;
