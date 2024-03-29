import React, { useRef, useCallback, useMemo } from 'react';
import createSearchPage, { GetDataApi } from 'search-page';
import { get } from 'lodash';
import { Button } from 'antd';
import FiltersForm from './FiltersForm';
import Content from './Content';

const Demo = () => {
  const searchPageRef = useRef({ forceUpdate: () => undefined });

  const forceUpdate = useCallback(() => {
    searchPageRef.current.forceUpdate();
  }, []);

  const getDataApi: GetDataApi = async (filters, pagination) => {
    await new Promise(resolve =>
      // eslint-disable-next-line no-promise-executor-return
      setTimeout(resolve, Math.max(5000 - get(filters, 'orgName.length', 0) * 500), 0)
    );
    const result = await Promise.resolve({ data: { filters, pagination }, total: 100 });
    return result;
  };

  const SearchPage = useMemo(
    () =>
      createSearchPage({
        filtersDefault: { orgName: 'gmsoft', orgCode4: '9527' },
        pageSize: 5,
        noPagination: false,
        getDataApi,
        FiltersForm,
        hideOnSinglePage: false,
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
