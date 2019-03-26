import { Dispatch } from 'react';
import { Form } from 'antd';
import { fieldHelper } from './utils';
import { FiltersFormType, Fields } from './typing';
import actions from './useSearchPage/actions';

const { create } = Form;

type Props = {
  dispatch: Dispatch<any>;
  filters: Fields;
};

const mapPropsToFields = ({ filters }: Props) => fieldHelper.createFields(filters);

const onFieldsChange = ({ dispatch }: Props, changedFields) => {
  dispatch(actions.storeFilters(changedFields));
};

export default (FiltersForm: FiltersFormType) =>
  create<Props>({ mapPropsToFields, onFieldsChange })(FiltersForm);
