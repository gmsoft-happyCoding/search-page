import { mapValues } from 'lodash';

export enum Types {
  storeData = 'STORE_DATA',
  storeFilters = 'STORE_FILTERS',
  storePagination = 'STORE_PAGINATION',
  resetState = 'RESET_STATE',
  loading = 'LOADING',
}

const actionCreator = (type: Types) => (payload: any) => ({ type, payload });

export default mapValues(Types, (value: Types) => actionCreator(value));
