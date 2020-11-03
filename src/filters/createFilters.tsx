import { Form } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { fieldHelper } from '../utils';
import { WrapperProps } from './FormWapper';
import { FiltersFormType } from '../typing';
import actions from '../useSearchPage/actions';

const { create } = Form;

type Props = Pick<
  WrapperProps,
  | 'filters'
  | 'dispatch'
  | 'mode'
  | 'filtersDefault'
  | 'historyHelper'
  | 'searchMode'
  | 'forceUpdate'
  | 'loadingCount'
> &
  FormComponentProps;

// 根据模式进行过滤性初始化，只初始化当前模式下显示的表单部分，多余的部分不初始化
const mapPropsToFields = (props: Props) => {
  const { filters } = props;
  return fieldHelper.createFields(filters);
};

const onFieldsChange = ({ dispatch }: Props, changedFields) => {
  dispatch(actions.storeFilters(changedFields));
};

export default (FiltersForm: FiltersFormType) =>
  create({ mapPropsToFields, onFieldsChange })(FiltersForm);
