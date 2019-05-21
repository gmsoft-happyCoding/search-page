import { merge } from 'lodash';
import fieldHelper from '../utils/fieldHelper';
import { PaginationType } from '../typing';
import Mode from '../filters/mode.enum';

// ant design form field is object, transform {key: value} to {key: {value}}
const { wrap } = fieldHelper;

const pagination: PaginationType = {
  current: 1,
  pageSize: 10,
};

export const NO_DATA = '__no_data__';

export default (filtersDefault, historyHelper) => ({
  filters: merge({}, wrap(filtersDefault), historyHelper.getValue('filters')),
  pagination: merge({}, pagination, historyHelper.getValue('pagination')),
  data: NO_DATA,
  total: historyHelper.getValue('total', 0),
  mode: historyHelper.getValue('mode', Mode.Simple),
  // 请求计数器
  loadingCount: 0,
  // 强制刷新的计数器
  forceUpdate: 0,
});
