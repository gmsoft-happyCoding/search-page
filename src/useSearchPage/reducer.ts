import { Types } from './actions';

export default (state, { type, payload }) => {
  // eslint-disable-next-line default-case
  switch (type) {
    case Types.storeData: {
      return { ...state, ...payload };
    }
    case Types.storeFilters: {
      const filters = { ...state.filters, ...payload };
      // 搜索条件改变时重置分页到第一页
      const pagination = { ...state.pagination, current: 1 };
      return { ...state, filters, pagination };
    }
    case Types.storePagination: {
      const pagination = { ...state.pagination, ...payload };
      return { ...state, pagination };
    }
    case Types.loading: {
      return { ...state, loading: payload };
    }
  }
};
