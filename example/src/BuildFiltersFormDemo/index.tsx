import React, { useRef, useCallback, useMemo } from 'react';
import createSearchPage, { GetDataApi } from 'search-page';
import { Button } from 'antd';
import FiltersForm from './FiltersForm';
import Content from './Content';

const Demo = () => {
  const searchPageRef = useRef({ forceUpdate: () => undefined });
  const forceUpdate = useCallback(() => {
    searchPageRef.current.forceUpdate();
  }, []);

  const getDataApi: GetDataApi = async (filters, pagination) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const result = await Promise.resolve({ data: { filters, pagination }, total: 100 });
    return result;
  };

  const SearchPage = useMemo(
    () =>
      createSearchPage({
        filtersDefault: { orgName: 'gmsoft', orgCode4: '9527' },
        getDataApi,
        FiltersForm,
        storeKey: 'BuildFiltersFormDemo',
      }),
    []
  );
  return (
    <div style={{ padding: 16 }}>
      <SearchPage ref={searchPageRef}>{Content}</SearchPage>
      <Button onClick={forceUpdate}>强制刷新</Button>
    </div>
  );
};

export default Demo;
