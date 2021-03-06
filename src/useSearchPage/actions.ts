import { mapValues } from 'lodash';

export enum Types {
  storeData = 'STORE_DATA',
  storeFilters = 'STORE_FILTERS',
  setFilters = 'SET_FILTERS',
  storePagination = 'STORE_PAGINATION',
  switchMode = 'SWITCH_MODE',
  loadingCount = 'LOADING_COUNT',
  forceUpdate = 'FORCE_UPDATE',
  removeFilters = 'REMOVE_FILTERS',
}

const actionCreator = (type: Types) => (payload: any) => ({ type, payload });

export default mapValues(Types, (value: Types) => actionCreator(value));
