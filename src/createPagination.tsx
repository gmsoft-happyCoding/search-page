import React from 'react';
import { connect } from 'react-redux';
import { Pagination as AntdPagination } from 'antd';
import { bindActions } from './utils';
import { NamespaceActions } from './utils/bindActions';
import { Pagination } from './typing';

interface Args {
  namespace: string;
  actions: NamespaceActions;
}

interface StateProps {
  pagination: Pagination;
}

interface DispatchProps {
  fetchData: (payload: { pagination: { current: number; pageSize: number } }) => Promise<any>;
}

type Props = StateProps & DispatchProps;

function Pagination({ fetchData, pagination }: Props) {
  const onPageChange = (page, pageSize) => {
    fetchData({ pagination: { current: page, pageSize } });
  };

  return (
    <AntdPagination
      style={{ textAlign: 'right', marginTop: 16 }}
      showQuickJumper
      defaultCurrent={1}
      hideOnSinglePage
      showTotal={total => `总数 ${total} 条`}
      current={pagination.current}
      pageSize={pagination.pageSize}
      total={pagination.total}
      onChange={onPageChange}
    />
  );
}

export default ({ namespace, actions }: Args) => {
  const mapStateToProps = state => ({
    pagination: state[namespace].pagination,
  });

  const mapDispatchToProps = dispatch => {
    const boundActions = bindActions(actions)(dispatch);
    return { fetchData: boundActions[`${namespace}BoundActions`].fetchData };
  };

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(Pagination);
};
