/* eslint-disable function-paren-newline */
import { useEffect, useReducer, useCallback } from 'react';
import { debounce } from 'lodash';
import defaultState from './defaultState';
import actions from './actions';
import reducer from './reducer';
import { fieldHelper, makeCancelable } from '../utils';

// 节流函数阈值
const DEBOUNCE_WAIT = 500;
// 保存已发起请求的 promise
let cancelablePromise;

export default (filtersDefault, pageSize, defaultMode, getDataApi, historyHelper) => {
  const [state, dispatch] = useReducer(reducer, undefined, () =>
    defaultState(filtersDefault, pageSize, defaultMode, historyHelper)
  );

  const debouncedGetDataApi = useCallback(
    debounce(
      (storeFilters, storePagination, storeMode) => {
        // 取消之前发起的promise, 避免因为响应顺序引起的乱序
        if (cancelablePromise) {
          cancelablePromise.cancel();
        }
        // 请求发起, 计数+1
        dispatch(actions.loadingCount('+'));
        // 请求数据
        cancelablePromise = makeCancelable(
          getDataApi(fieldHelper.unwrap(storeFilters), storePagination)
        );

        cancelablePromise.promise
          .then(data => {
            // 保存数据(包括total)
            dispatch(actions.storeData(data));
            // 保存查询条件到history, 用于刷新或路由返回时恢复
            historyHelper.setState({
              filters: storeFilters,
              pagination: storePagination,
              total: data.total,
              mode: storeMode,
            });
          })
          .catch(error => {
            // 捕获异常, 什么都不做, 避免UI崩溃
            // eslint-disable-next-line no-console
            if (console && console.log) {
              // eslint-disable-next-line no-console
              console.log(error);
            }
          })
          .finally(() => {
            // 请求完成, 计数-1
            dispatch(actions.loadingCount('-'));
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

  useEffect(() => {
    // 加载数据
    debouncedGetDataApi(state.filters, state.pagination, state.mode);
  }, [state.filters, state.pagination, state.forceUpdate, debouncedGetDataApi, state.mode]);

  return [state, dispatch];
};
