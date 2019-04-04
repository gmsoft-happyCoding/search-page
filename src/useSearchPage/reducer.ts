import { Types } from './actions';
import Mode from '../filters/mode.enum';

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
    case Types.setFilters: {
      const filters = payload;
      // 搜索条件改变时重置分页到第一页
      const pagination = { ...state.pagination, current: 1 };
      return { ...state, filters, pagination };
    }
    case Types.storePagination: {
      const pagination = { ...state.pagination, ...payload };
      return { ...state, pagination };
    }
    case Types.loadingCount: {
      const count = payload === '+' ? state.loadingCount + 1 : state.loadingCount - 1;
      return { ...state, loadingCount: count };
    }
    case Types.switchMode: {
      return { ...state, mode: state.mode === Mode.Simple ? Mode.Advance : Mode.Simple };
    }
    case Types.forceUpdate: {
      return { ...state, forceUpdate: state.forceUpdate + 1 };
    }
  }
};
