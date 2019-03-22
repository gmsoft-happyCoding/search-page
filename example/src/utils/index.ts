import stateContainer from './stateContainer';
import bindActions from './bindActions';
import unwrapActions from './unwrapActions';
import { setConfirm, resetConfirm } from './confirmation';
import * as popup from './popup';

export default {
  stateContainer,
  bindActions,
  unwrapActions,
  setRouterConfirm: setConfirm,
  resetRouterConfirm: resetConfirm,
  popup,
};

export {
  stateContainer,
  bindActions,
  unwrapActions,
  setConfirm as setRouterConfirm,
  resetConfirm as resetRouterConfirm,
  popup,
};
