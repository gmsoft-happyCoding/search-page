import { values, head, compose } from 'ramda';
import { ActionFunctionAny, Action } from 'redux-actions';

type Actions = {
  [actionName: string]: ActionFunctionAny<Action<any>>;
};

const unwrap = compose<any, any, Actions>(
  head,
  values
);

export default unwrap;
