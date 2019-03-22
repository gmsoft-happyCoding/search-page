import { createActions } from 'redux-actions';

const identity = (_: any) => _;

const actions = {
  fetchData: identity,
  storeData: identity,
  storeFilters: identity,
  storePagination: identity,
  resetState: identity,
  init: identity,
};

export default (namespace: string) =>
  createActions({
    [namespace]: actions,
  });
