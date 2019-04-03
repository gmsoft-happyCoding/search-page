import { useEffect, useReducer, useCallback, useMemo } from 'react';
import { debounce } from 'lodash';
import defaultState from './defaultState';
import actions from './actions';
import reducer from './reducer';
import { historyHelper, fieldHelper } from '../utils';

// 节流函数阈值
const DEBOUNCE_WAIT = 500;

export default (filtersDefault, getDataApi) => {
  const initState = useMemo(() => defaultState(filtersDefault), [filtersDefault]);
  const [state, dispatch] = useReducer(reducer, initState);

  const debouncedGetDataApi = useCallback(
    debounce(
      (storeFilters, storePagination, storeSimpleModel) => {
        // 请求发起, 计数+1
        dispatch(actions.loadingCount('+'));
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
              simpleModel: storeSimpleModel,
            });
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
    debouncedGetDataApi(state.filters, state.pagination, state.simpleModel);
  }, [state.filters, state.pagination, state.forceUpdate, debouncedGetDataApi]);

  return [state, dispatch];
};
