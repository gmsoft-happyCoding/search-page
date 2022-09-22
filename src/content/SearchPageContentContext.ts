import { createContext } from 'react';
import { noop } from 'lodash';
import { SearchPageContentContextI } from '../typing';

export default createContext<SearchPageContentContextI>({
  data: [],
  total: 0,
  forceUpdate: noop,
  loading: false,
  filters: [],
  pagination: { current: 1, pageSize: 10 },
  dispatch: noop,
  tableWidthConfs: [],
});
