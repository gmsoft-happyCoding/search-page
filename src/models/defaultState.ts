import fieldHelper from '../utils/fieldHelper';
import historyHelper from '../utils/historyHelper';
import { merge } from 'lodash';

// ant design form field is object, transform {key: value} to {key: {value}}
const { wrap } = fieldHelper;

const pagination = {
  current: 1,
  pageSize: 10,
  total: 0,
};

export default filtersDefault => ({
  filters: merge(wrap(filtersDefault), historyHelper.getValue('filters')),
  pagination: merge(pagination, historyHelper.getValue('pagination')),
  data: [],
});
