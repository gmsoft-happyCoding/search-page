import { merge } from 'lodash';
import HistoryHelper from 'history-helper';
import fieldHelper from '../utils/fieldHelper';
import { PaginationI } from '../typing';
import FilterMode from '../enums/FilterMode';

// ant design form field is object, transform {key: value} to {key: {value}}
const { wrap } = fieldHelper;

const pagination: PaginationI = {
  current: 1,
  pageSize: 10,
};

export const NO_DATA = '__no_data__';

export default (
  filtersDefault: any,
  pageSize: number,
  defaultMode: FilterMode,
  historyHelper?: HistoryHelper
) => ({
  filters: merge({}, wrap(filtersDefault), historyHelper && historyHelper.getValue('filters')),
  pagination: merge(
    {},
    pagination,
    { pageSize },
    historyHelper && historyHelper.getValue('pagination')
  ),
  data: NO_DATA,
  total: historyHelper ? historyHelper.getValue('total', 0) : 0,
  mode: historyHelper ? historyHelper.getValue('mode', defaultMode) : defaultMode,
  // 请求计数器
  loadingCount: 0,
  // 强制刷新的计数器
  forceUpdate: 0,
  tableWidthConfs: historyHelper ? historyHelper.getValue('tableWidthConfs', []) : [],
});
