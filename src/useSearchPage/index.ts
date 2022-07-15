/* eslint-disable function-paren-newline */
import { useEffect, useReducer, useCallback, useRef } from 'react';
import { debounce } from 'lodash';
import HistoryHelper from 'history-helper';
import defaultState from './defaultState';
import actions from './actions';
import reducer from './reducer';
import { fieldHelper, makeCancelable } from '../utils';
import SearchMode from '../enums/SearchMode';
import { FiltersDefault, GetDataApi, RefreshOpt } from '../typing';
import FilterMode from '../enums/FilterMode';
import { useAutoRefresh } from '../utils/useAutoRefresh.hook';

// 节流函数阈值
const DEBOUNCE_WAIT = 500;

export default (
  searchMode: SearchMode,
  filtersDefault: FiltersDefault,
  pageSize: number,
  defaultMode: FilterMode,
  getDataApi: GetDataApi,
  refreshOpt: RefreshOpt,
  historyHelper?: HistoryHelper
) => {
  const [state, dispatch] = useReducer(reducer, undefined, () =>
    defaultState(filtersDefault, pageSize, defaultMode, historyHelper)
  );

  // 保存已发起请求的 promise
  const cancelablePromise = useRef<any>();

  const debouncedGetDataApi = useCallback(
    debounce(
      (storeFilters, storePagination, storeMode) => {
        // 取消之前发起的promise, 避免因为响应顺序引起的乱序
        if (cancelablePromise.current && cancelablePromise.current.cancel) {
          // 请求取消, 成功取消: 计数-1
          cancelablePromise.current.cancel(() => {
            dispatch(actions.loadingCount('-'));
          });
        }
        // 请求发起, 计数+1
        dispatch(actions.loadingCount('+'));

        // 请求数据
        cancelablePromise.current = makeCancelable(getDataApi, [
          fieldHelper.unwrap(storeFilters),
          storePagination,
        ]);

        return cancelablePromise.current.promise
          .then(data => {
            // 请求完成, 计数-1
            dispatch(actions.loadingCount('-'));
            // 保存数据(包括total)
            dispatch(actions.storeData(data));
            // 保存查询条件到history, 用于刷新或路由返回时恢复
            if (historyHelper) {
              historyHelper.setState({
                filters: storeFilters,
                pagination: storePagination,
                total: data.total,
                mode: storeMode,
                tableWidthConfs: state.tableWidthConfs,
              });
            }
          })
          .catch(error => {
            // 请求异常, 非取消时: 计数-1
            if (!error || !error.isCanceled) {
              dispatch(actions.loadingCount('-'));
            }
            // eslint-disable-next-line no-console
            if (console && console.error) {
              // eslint-disable-next-line no-console
              console.error(error);
            }
          });
      },
      DEBOUNCE_WAIT,
      {
        leading: true,
        trailing: true,
      }
    ),
    [getDataApi]
  );

  useAutoRefresh(
    () => debouncedGetDataApi(state.filters, state.pagination, state.mode),
    refreshOpt
  );

  /**
   * 即时模式, 筛选条件, 分页, 显示模式改变时加载数据
   */
  useEffect(() => {
    if (searchMode === SearchMode.TIMELY) {
      debouncedGetDataApi(state.filters, state.pagination, state.mode);
    }
  }, [state.filters, state.pagination, debouncedGetDataApi, state.mode, searchMode]);

  /**
   * 手动触发模式, 分页, 显示模式改变时加载数据
   */
  useEffect(() => {
    if (searchMode === SearchMode.TRIGGER) {
      debouncedGetDataApi(state.filters, state.pagination, state.mode);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    state.pagination.current,
    state.pagination.pageSize,
    state.mode,
    searchMode,
    debouncedGetDataApi,
  ]);

  /**
   * 强制刷新
   */
  useEffect(() => {
    if (state.forceUpdate > 0) {
      debouncedGetDataApi(state.filters, state.pagination, state.mode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.forceUpdate]);

  return [state, dispatch];
};
