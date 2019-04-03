import React, { useMemo, forwardRef, useCallback } from 'react';
import ContentWrap from './ContentWrap';
import createFilters from './createFilters';
import Pagination from './Pagination';
import useSearchPage from './useSearchPage';
import actions from './useSearchPage/actions';
import { FiltersFormType, GetDataApi, ContentFunction } from './typing';

interface Args {
  filtersDefault?: object;
  getDataApi: GetDataApi;
  FiltersForm: FiltersFormType;
  loadingDelay?: number;
  showKeys?: Array<string>;
}

interface Props {
  children?: ContentFunction;
}

const createSearchPage = ({
  filtersDefault,
  FiltersForm,
  getDataApi,
  loadingDelay = 500,
  showKeys,
}: Args) => {
  const SearchPage: React.FC<Props> = ({ children }, ref) => {
    const [state, dispatch] = useSearchPage(filtersDefault, getDataApi);
    const Filters = useMemo(() => createFilters(FiltersForm), []);

    // 强制刷新, 通过 ref 和 children render props 暴露给外部
    const forceUpdate = useCallback(() => dispatch(actions.forceUpdate()), []);

    if (ref) ref.current = { forceUpdate };

    return (
      <>
        <Filters filters={state.filters} dispatch={dispatch} state={state} showKeys={showKeys} />
        <ContentWrap
          data={state.data}
          loading={state.loading}
          loadingDelay={loadingDelay}
          forceUpdate={forceUpdate}
        >
          {children}
        </ContentWrap>
        <Pagination pagination={state.pagination} dispatch={dispatch} total={state.total} />
      </>
    );
  };

  return forwardRef(SearchPage);
};

export default createSearchPage;
