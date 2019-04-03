import { merge } from 'lodash';
import fieldHelper from '../utils/fieldHelper';
import historyHelper from '../utils/historyHelper';
import { PaginationType } from '../typing';

// ant design form field is object, transform {key: value} to {key: {value}}
const { wrap } = fieldHelper;

const pagination: PaginationType = {
  current: 1,
  pageSize: 10,
};

export default filtersDefault => ({
  filters: merge({}, wrap(filtersDefault), historyHelper.getValue('filters')),
  pagination: merge({}, pagination, historyHelper.getValue('pagination')),
  data: [],
  total: historyHelper.getValue('total', 0),
  simpleModel: historyHelper.getValue('simpleModel', true),
  // 请求计数器
  loadingCount: 0,
  // 强制刷新的计数器
  forceUpdate: 0,
});
