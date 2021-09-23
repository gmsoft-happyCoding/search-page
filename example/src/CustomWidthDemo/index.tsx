import React, { useRef, useCallback } from 'react';
import createSearchPage, { GetDataApi, Mode, SearchMode } from 'search-page';
import { Button } from 'antd';
import { repeat } from 'lodash';
import Axios from 'axios';
import FiltersForm from './FiltersForm';
import Content from './Content';

const getDataApi: GetDataApi = async (filters, pagination) => {
  const {
    data,
  } = await Axios.get(
    'http://easy-mock.gm/mock/5ecf521686d71f0b2fed836a/test/yw-gateway/zcjstockexe/flow-uis',
    { params: filters }
  );
  await new Promise(resolve => setTimeout(resolve, 0));
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
  autoRefresh: { enable: false },
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
