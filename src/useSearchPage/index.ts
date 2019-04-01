import { useEffect, useReducer, useCallback, useMemo } from 'react';
import { debounce } from 'lodash';
import defaultState from './defaultState';
import actions from './actions';
import reducer from './reducer';
import { historyHelper, fieldHelper } from '../utils';

// 节流函数阈值
const DEBOUNCE_WAIT = 500;
// 请求计数器, 清零时才清除loading状态
let fetchCounting = 0;

export default (filtersDefault, getDataApi) => {
  const initState = useMemo(() => defaultState(filtersDefault), [filtersDefault]);
  const [state, dispatch] = useReducer(reducer, initState);

  const debouncedGetDataApi = useCallback(
    debounce(
      (storeFilters, storePagination) => {
        // show loading
        dispatch(actions.loading(true));
        fetchCounting += 1;
        // 请求数据
        getDataApi(fieldHelper.unwrap(storeFilters), storePagination)
          .then(data => {
            // 保存数据(包括total)
            dispatch(actions.storeData(data));
            // 保存查询条件到history, 用于刷新或路由返回时恢复
            historyHelper.setState({
              filters: storeFilters,
              pagination: storePagination,
              total: data.total,
            });
          })
          .finally(() => {
            fetchCounting -= 1;
            if (fetchCounting === 0) {
              // hide loading
              dispatch(actions.loading(false));
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

  useEffect(() => {
    // 加载数据
    debouncedGetDataApi(state.filters, state.pagination);
  }, [state.filters, state.pagination, state.forceUpdate, debouncedGetDataApi]);

  return [state, dispatch];
};
