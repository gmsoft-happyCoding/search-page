import React, { useMemo, forwardRef, useCallback } from 'react';
import HistoryHelper from 'history-helper';
import ContentWrap from './ContentWrap';
import createFilters from './filters/createFilters';
import Pagination from './Pagination';
import useSearchPage from './useSearchPage';
import actions from './useSearchPage/actions';
import fieldHelper from './utils/fieldHelper';
import FilterMode from './enums/FilterMode';
import {
  FiltersFormType,
  GetDataApi,
  Content,
  FiltersDefault,
  forceUpdateArgs,
  ForceUpdate,
} from './typing';
import SearchMode from './enums/SearchMode';

const { wrap } = fieldHelper;

interface Args {
  filtersDefault?: FiltersDefault;
  defaultMode?: FilterMode;
  noPagination?: boolean;
  pageSize?: number;
  pageSizeOptions?: Array<string>;
  /**
   * 是否可以改变 pageSize
   */
  showSizeChanger?: boolean;
  hideOnSinglePage?: boolean;
  getDataApi: GetDataApi;
  FiltersForm: FiltersFormType;
  loadingDelay?: number;
  /**
   * 不论是否成功返回data, 总是渲染显示内容
   */
  alwaysRenderContent?: boolean;
  /**
   * 存储在history.state中key, 如果同一个页面有多个SearchPage, 需要避免重复时请指定
   */
  storeKey?: string;
  /**
   * 存储数据使用的history对象, 默认为 top.history
   */
  storeHistory?: History;
  /**
   * 搜索模式, 即时搜索 or 按钮触发
   */
  searchMode?: SearchMode;
}

interface Props {
  children?: Content;
}

const createSearchPage = ({
  filtersDefault = {},
  defaultMode = FilterMode.Simple,
  pageSize = 10,
  pageSizeOptions = ['5', '10', '20', '30', '40'],
  showSizeChanger = true,
  hideOnSinglePage = true,
  noPagination = false,
  FiltersForm,
  getDataApi,
  loadingDelay = 500,
  alwaysRenderContent = false,
  storeKey,
  storeHistory,
  searchMode = SearchMode.TIMELY,
}: Args) => {
  const historyHelper = new HistoryHelper(storeKey, storeHistory);

  const SearchPage: React.FC = ({ children }: Props, ref) => {
    const [state, dispatch] = useSearchPage(
      searchMode,
      filtersDefault,
      pageSize,
      defaultMode,
      getDataApi,
      historyHelper
    );
    const Filters = useMemo(() => createFilters(FiltersForm), []);

    // 强制刷新, 通过 ref 和 children render props 暴露给外部
    const forceUpdate: ForceUpdate = useCallback(
      (args?: forceUpdateArgs) => {
        // 更新filters, 页码会跳转到第一页
        if (args && args.filters) {
          return dispatch(actions.storeFilters(wrap(args.filters)));
        }
        if (args && args.pagination) {
          return dispatch(actions.storePagination(args.pagination));
        }
        dispatch(actions.forceUpdate());
      },
      [dispatch]
    );

    if (ref) ref.current = { forceUpdate };

    return (
      <>
        <Filters
          filters={state.filters}
          dispatch={dispatch}
          mode={state.mode}
          filtersDefault={filtersDefault}
          storeKey={storeKey}
          storeHistory={storeHistory}
          searchMode={searchMode}
          forceUpdate={forceUpdate}
          loadingCount={state.loadingCount}
        />
        <ContentWrap
          data={state.data}
          loadingCount={state.loadingCount}
          filters={state.filters}
          pagination={state.pagination}
          loadingDelay={loadingDelay}
          forceUpdate={forceUpdate}
          alwaysRenderContent={alwaysRenderContent}
        >
          {children}
        </ContentWrap>
        {noPagination ? null : (
          <Pagination
            hideOnSinglePage={hideOnSinglePage}
            pagination={state.pagination}
            showSizeChanger={showSizeChanger}
            pageSizeOptions={pageSizeOptions}
            dispatch={dispatch}
            total={state.total}
          />
        )}
      </>
    );
  };

  return forwardRef(SearchPage);
};

export default createSearchPage;
