import { merge, get } from 'lodash';

// eslint-disable-next-line no-restricted-globals
const { history } = top;

// 持久化搜索条件存放在 history.state[STORE_KEY] 中
const STORE_KEY = '__sp';

function setState(state: any) {
  history.replaceState(merge({}, history.state, { [STORE_KEY]: state }), '');
}

function getState(): object {
  return history.state && history.state[STORE_KEY];
}

function merageState(...state: object[]) {
  const mergedState = merge({}, ...state);
  setState(mergedState);
}

function clearState() {
  setState(null);
}

function getValue(path: string, defaultValue: any = null) {
  return get(getState(), path, defaultValue);
}

export default {
  setState,
  merageState,
  getValue,
  clearState,
  getState,
};
