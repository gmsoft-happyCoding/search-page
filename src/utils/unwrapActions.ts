import { NamespaceActions } from './bindActions';
import { ActionFunctionAny, Action } from 'redux-actions';

type Actions = {
  [actionName: string]: ActionFunctionAny<Action<any>>;
};

interface Unwrap {
  (actions: NamespaceActions | any): Actions;
}

const unwrap: Unwrap = actions => Object.values(actions)[0] as Actions;

export default unwrap;
