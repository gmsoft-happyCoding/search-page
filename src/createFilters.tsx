import { Dispatch } from 'react';
import { Form } from 'antd';
import { fieldHelper } from './utils';
import { FiltersFormType, Fields /* ComponentState */ } from './typing';
import actions from './useSearchPage/actions';
import { keys } from 'lodash';

const { create } = Form;

type Props = {
  dispatch: Dispatch<any>;
  state: any;
  filters: Fields;
  showKeys?: Array<string>;
};

// 根据模式进行过滤性初始化，只初始化当前模式下显示的表单部分，多余的部分不初始化
const mapPropsToFields = (props: Props) => {
  const { filters, state, showKeys } = props;
  const simpleModel = state.status && state.status.simpleModel;
  // 根据simpleModel模式清除简单模式下不显示的数据
  if (Array.isArray(showKeys)) {
    keys(filters).map(key => {
      if (!showKeys.includes(key) && simpleModel) {
        filters[key].value = '';
      }
    });
  }

  return fieldHelper.createFields(filters);
};

const onFieldsChange = ({ dispatch }: Props, changedFields) => {
  dispatch(actions.storeFilters(changedFields));
};

export default (FiltersForm: FiltersFormType) =>
  create<Props>({ mapPropsToFields, onFieldsChange })(FiltersForm);
3;
