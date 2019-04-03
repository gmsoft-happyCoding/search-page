import { Dispatch } from 'react';
import { Form } from 'antd';
import { fieldHelper } from '../utils';
import { FiltersFormType, Fields, FiltersDefault } from '../typing';
import actions from '../useSearchPage/actions';

const { create } = Form;

interface Props {
  dispatch: Dispatch<any>;
  filters: Fields;
  filtersDefault: FiltersDefault;
  simpleModel?: boolean;
  children?: React.ReactNode;
  needReset?: boolean;
  needMore?: boolean;
  rows?: number;
}

// 根据模式进行过滤性初始化，只初始化当前模式下显示的表单部分，多余的部分不初始化
const mapPropsToFields = (props: Props) => {
  const { filters } = props;
  return fieldHelper.createFields(filters);
};

const onFieldsChange = ({ dispatch }: Props, changedFields) => {
  dispatch(actions.storeFilters(changedFields));
};

export default (FiltersForm: FiltersFormType) =>
  create({ mapPropsToFields, onFieldsChange })(FiltersForm) as React.ComponentType<Props>;
