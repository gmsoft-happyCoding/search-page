import React, { useMemo, forwardRef, useCallback } from 'react';
import HistoryHelper from 'history-helper';
import { PaginationProps } from 'antd/lib/pagination';
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
  ForceUpdateArgs,
  ForceUpdate,
} from './typing';
import SearchMode from './enums/SearchMode';

const { wrap } = fieldHelper;

interface Args {
  /**
   * 默认显示条件
   */
  filtersDefault?: FiltersDefault;
  /**
   * 默认的显示模式
   * @default FilterMode.SimpleMode
   */
  defaultMode?: FilterMode;
  /**
   * 是否显示分页
   * @default false
   */
  noPagination?: boolean;
  /**
   * 每页数量
   * @default 10
   */
  pageSize?: number;
  /**
   * 每页数量选项
   * @default ['5', '10', '20', '30', '40']
   */
  pageSizeOptions?: Array<string>;
  /**
   * 是否可以改变 pageSize
   * @default true
   */
  showSizeChanger?: boolean;
  /**
   * 只有一页隐藏分页信息
   * @default true
   */
  hideOnSinglePage?: boolean;
  /**
   * 自定义分页
   */
  paginationProps?: PaginationProps;
  /**
   * 数据源api
   */
  getDataApi: GetDataApi;
  /**
   * 过滤表单
   */
  FiltersForm?: FiltersFormType;
  /**
   * 显示loading的延迟毫秒数
   * @default 500
   */
  loadingDelay?: number;
  /**
   * 不论是否成功返回data, 总是渲染显示内容
   */
  alwaysRenderContent?: boolean;
  /**
   * 不存储状态
   * @default false
   */
  noStore?: boolean;
  /**
   * 存储在history.state中key, 如果同一个页面有多个SearchPage, 需要避免重复时请指定
   */
  storeKey?: string;
  /**
   * 存储数据使用的history对象, 默认为 top.history
   * @default top.history
   */
  storeHistory?: History;
  /**
   * 搜索模式, 即时搜索 or 按钮触发
   * @default SearchMode.TIMELY
   */
  searchMode?: SearchMode;
}

interface Props {
  children?: Content;
}

const createSearchPage = ({
  filtersDefault = {},
  defaultMode = FilterMode.Simple,
  noPagination = false,
  pageSize = 10,
  pageSizeOptions = ['5', '10', '20', '30', '40'],
  showSizeChanger = true,
  hideOnSinglePage = true,
  paginationProps,
  FiltersForm,
  getDataApi,
  loadingDelay = 500,
  alwaysRenderContent = false,
  noStore = false,
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
      noStore ? undefined : historyHelper
    );
    const Filters = useMemo(() => FiltersForm && createFilters(FiltersForm), []);

    // 强制刷新, 通过 ref 和 children render props 暴露给外部
    const forceUpdate: ForceUpdate = useCallback(
      (args?: ForceUpdateArgs) => {
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
        {Filters && (
          <Filters
            filters={state.filters}
            dispatch={dispatch}
            mode={state.mode}
            filtersDefault={filtersDefault}
            historyHelper={noStore ? undefined : historyHelper}
            searchMode={searchMode}
            forceUpdate={forceUpdate}
            loadingCount={state.loadingCount}
          />
        )}
        <ContentWrap
          data={state.data}
          total={state.total}
          tableWidthConfs={state.tableWidthConfs}
          loadingCount={state.loadingCount}
          filters={state.filters}
          pagination={state.pagination}
          loadingDelay={loadingDelay}
          forceUpdate={forceUpdate}
          alwaysRenderContent={alwaysRenderContent}
          dispatch={dispatch}
          storeKey={storeKey}
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
            paginationProps={paginationProps}
          />
        )}
      </>
    );
  };

  return forwardRef(SearchPage);
};

export default createSearchPage;
