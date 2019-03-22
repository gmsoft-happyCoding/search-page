import { unwrapActions } from '../utils';
import fieldHelper from '../utils/fieldHelper';
import historyHelper from '../utils/historyHelper';
import defaultState from './defaultState';
import createActions from './createActions';
import { Model } from 'dva';
import { NamespaceActions } from '../utils/bindActions';
import { GetDataApi } from '../typing';

export default (namespace: string, filtersDefault: object | undefined, getDataApi: GetDataApi) => {
  // @ts-ignore
  const originActions = createActions(namespace) as NamespaceActions;
  const actions = unwrapActions(originActions);

  const model: Model = {
    namespace,
    state: defaultState(filtersDefault),
    reducers: {
      storeData(state, { payload }) {
        return { ...state, data: payload };
      },
      storeFilters(state, { payload }) {
        const filters = { ...state.filters, ...payload };
        return { ...state, filters };
      },
      storePagination(state, { payload }) {
        const pagination = { ...state.pagination, ...payload };
        return { ...state, pagination };
      },
      resetState() {
        return defaultState(filtersDefault);
      },
    },
    effects: {
      fetchData: [
        function* getData({ payload: { filters, pagination } }, { call, put, select }) {
          // 合并查询条件和分页数据
          if (filters) {
            // 保存(合并)查询条件
            yield put(actions.storeFilters(filters));
            // 如果查询条件改变了, 重置分页到第一页
            yield put(actions.storePagination({ current: 1 }));
          }

          if (pagination) {
            // 保存(合并)查询条件
            yield put(actions.storePagination(pagination));
          }

          // 获取查询条件
          const storeFilters = yield select(state => state[namespace].filters);
          const storePagination = yield select(state => state[namespace].pagination);

          // 保存查询条件到history, 用于刷新或路由返回时恢复
          historyHelper.setState({ filters: storeFilters, pagination: storePagination });

          // 请求数据
          const { data, total } = yield call(
            getDataApi,
            fieldHelper.unwrap(storeFilters),
            storePagination
          );
          // 保存数据
          yield put(actions.storeData(data));
          // 保存数量条数
          yield put(actions.storePagination({ total: parseInt(total || 0, 10) }));
        },
        // @ts-ignore
        { type: 'throttle', ms: 300 },
      ],
      *init(_, { put }) {
        yield put(actions.resetState());
        yield put(actions.fetchData({}));
      },
    },
  };

  return [model, originActions] as [Model, NamespaceActions];
};
