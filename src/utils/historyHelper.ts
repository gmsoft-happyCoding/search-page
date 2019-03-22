import { merge, get } from 'lodash';

const { history } = top;

function setState(state) {
  history.replaceState(state, '');
}

function merageState(...state: object[]) {
  history.replaceState(merge(history.state, ...state), '');
}

function clearState() {
  history.replaceState(null, '');
}

function getState(): object {
  return history.state;
}

function getValue(path: string, defaultValue: any = null) {
  return get(history.state, path, defaultValue);
}

export default {
  setState,
  merageState,
  getValue,
  clearState,
  getState,
};
