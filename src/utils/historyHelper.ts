import { merge, get } from 'lodash';

// eslint-disable-next-line no-restricted-globals
const { history } = top;

// 持久化搜索条件key前缀
const STORE_KEY_PREFIX = '__sp';

export default class HistoryHelper {
  private storeKey: string;
  constructor(storeKey) {
    this.storeKey = storeKey ? `${STORE_KEY_PREFIX}_${storeKey}` : STORE_KEY_PREFIX;
  }

  setState(state: any) {
    const historyState = history.state || {};
    historyState[this.storeKey] = state;
    history.replaceState(historyState, '');
  }

  getState(): object {
    return history.state && history.state[this.storeKey];
  }

  mergeState(...state: object[]) {
    const mergedState = merge({}, ...history.state[this.storeKey], ...state);
    this.setState(mergedState);
  }

  clearState() {
    this.setState(null);
  }

  getValue(path: string, defaultValue: any = null) {
    return get(this.getState(), path, defaultValue);
  }
}
