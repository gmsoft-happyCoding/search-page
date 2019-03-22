import { bindActions } from './utils';
import { connect } from 'react-redux';
import { Form } from 'antd';
import { fieldHelper } from './utils';
import { NamespaceActions } from './utils/bindActions';
import { FiltersForm } from './typing';

const { create } = Form;

type Args = {
  namespace: string;
  FiltersForm: FiltersForm;
  actions: NamespaceActions;
};

export default ({ namespace, FiltersForm, actions }: Args) => {
  const mapStateToProps = state => ({
    filters: state[namespace] ? state[namespace].filters : {},
  });

  const mapDispatchToProps = bindActions(actions);

  const mapPropsToFields = ({ filters }) => fieldHelper.createFields(filters);

  const onFieldsChange = (props, changedFields) => {
    props[`${namespace}BoundActions`].fetchData({ filters: changedFields });
  };

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(create({ mapPropsToFields, onFieldsChange })(FiltersForm));
};
