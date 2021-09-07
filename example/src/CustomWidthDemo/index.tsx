import React, { useRef, useCallback } from 'react';
import createSearchPage, { GetDataApi, Mode, SearchMode } from 'search-page';
import { Button } from 'antd';
import { repeat } from 'lodash';
import FiltersForm from './FiltersForm';
import Content from './Content';

const getDataApi: GetDataApi = async (filters, pagination) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const result = await Promise.resolve({
    data: {
      data: repeat('*', 5)
        .split('')
        .map((i, index) => ({
          id: index,
          name: i,
        })),
    },
    info: { filters, pagination },
    total: 20,
  });
  return result;
};

const SearchPage = createSearchPage({
  filtersDefault: { orgName: 'gmsoft', name1: '1', name12: '2' },
  defaultMode: Mode.Simple,
  getDataApi,
  FiltersForm,
  storeKey: 'CustomWidthDemo',
  searchMode: SearchMode.TRIGGER,
  hideOnSinglePage: false,
});

const Demo = () => {
  const searchPageRef = useRef({ forceUpdate: () => undefined });
  const forceUpdate = useCallback(() => {
    searchPageRef.current.forceUpdate();
  }, []);
  return (
    <div style={{ padding: 16 }}>
      <SearchPage ref={searchPageRef}>{Content}</SearchPage>
      <Button onClick={forceUpdate}>强制刷新</Button>
    </div>
  );
};

export default Demo;
