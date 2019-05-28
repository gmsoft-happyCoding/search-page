import React, { useMemo, forwardRef, useCallback } from 'react';
import ContentWrap from './ContentWrap';
import createFilters from './filters/createFilters';
import Pagination from './Pagination';
import useSearchPage from './useSearchPage';
import actions from './useSearchPage/actions';
import { HistoryHelper } from './utils';
import { FiltersFormType, GetDataApi, Content, FiltersDefault } from './typing';

interface Args {
  filtersDefault?: FiltersDefault;
  pageSize?: 10 | 20 | 30 | 40;
  noPagination?: boolean;
  getDataApi: GetDataApi;
  FiltersForm: FiltersFormType;
  loadingDelay?: number;
  /**
   * 存储在history.state中key, 如果同一个页面有多个SearchPage, 需要避免重复时请指定
   */
  storeKey?: string;
}

interface Props {
  children?: Content;
}

const createSearchPage = ({
  filtersDefault = {},
  pageSize = 10,
  noPagination = false,
  FiltersForm,
  getDataApi,
  loadingDelay = 500,
  storeKey,
}: Args) => {
  const historyHelper = new HistoryHelper(storeKey);

  const SearchPage: React.FC<Props> = ({ children }, ref) => {
    const [state, dispatch] = useSearchPage(filtersDefault, pageSize, getDataApi, historyHelper);
    const Filters = useMemo(() => createFilters(FiltersForm), []);

    // 强制刷新, 通过 ref 和 children render props 暴露给外部
    const forceUpdate = useCallback(() => dispatch(actions.forceUpdate()), []);

    if (ref) ref.current = { forceUpdate };

    return (
      <>
        <Filters
          filters={state.filters}
          dispatch={dispatch}
          mode={state.mode}
          filtersDefault={filtersDefault}
        />
        <ContentWrap
          data={state.data}
          loadingCount={state.loadingCount}
          filters={state.filters}
          pagination={state.pagination}
          loadingDelay={loadingDelay}
          forceUpdate={forceUpdate}
        >
          {children}
        </ContentWrap>
        {noPagination ? null : (
          <Pagination pagination={state.pagination} dispatch={dispatch} total={state.total} />
        )}
      </>
    );
  };

  return forwardRef(SearchPage);
};

export default createSearchPage;
