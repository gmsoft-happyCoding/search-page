import React, { useMemo, forwardRef, useCallback } from 'react';
import HistoryHelper from 'history-helper';
import ContentWrap from './ContentWrap';
import createFilters from './filters/createFilters';
import Pagination from './Pagination';
import useSearchPage from './useSearchPage';
import actions from './useSearchPage/actions';
import fieldHelper from './utils/fieldHelper';
import { Mode } from './filters/mode.enum';
import {
  FiltersFormType,
  GetDataApi,
  Content,
  FiltersDefault,
  forceUpdateArgs,
  ForceUpdate,
} from './typing';

const { wrap } = fieldHelper;

interface Args {
  filtersDefault?: FiltersDefault;
  defaultMode?: Mode;
  pageSize?: number;
  pageSizeOptions?: Array<string>;
  noPagination?: boolean;
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
}

interface Props {
  children?: Content;
}

const createSearchPage = ({
  filtersDefault = {},
  defaultMode = Mode.Simple,
  pageSize = 10,
  pageSizeOptions = ['5', '10', '20', '30', '40'],
  noPagination = false,
  FiltersForm,
  getDataApi,
  loadingDelay = 500,
  alwaysRenderContent = false,
  storeKey,
  storeHistory,
}: Args) => {
  const historyHelper = new HistoryHelper(storeKey, storeHistory);

  const SearchPage: React.FC = ({ children }: Props, ref) => {
    const [state, dispatch] = useSearchPage(
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
            pagination={state.pagination}
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
