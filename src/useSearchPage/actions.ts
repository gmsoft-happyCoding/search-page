import { mapValues } from 'lodash';

export enum Types {
  storeData = 'STORE_DATA',
  storeFilters = 'STORE_FILTERS',
  setFilters = 'SET_FILTERS',
  storePagination = 'STORE_PAGINATION',
  switchModel = 'SWITCH_MODEL',
  loadingCount = 'LOADING_COUNT',
  forceUpdate = 'FORCE_UPDATE',
}

const actionCreator = (type: Types) => (payload: any) => ({ type, payload });

export default mapValues(Types, (value: Types) => actionCreator(value));
