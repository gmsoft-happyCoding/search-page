import React from 'react';
import { connect } from 'react-redux';
import { Spin } from 'antd';
import { ContentFunction } from './typing';

type OwnProps = {
  children?: ContentFunction;
};

type StateProps = {
  data: any;
  loading: boolean;
  loadingDelay: number;
};

type Props = OwnProps & StateProps;

const ContentWrap = ({ children, data, loading, loadingDelay }: Props) => {
  if (children && typeof children === 'function') {
    return (
      <Spin spinning={loading} delay={loadingDelay} tip="数据加载中...">
        {children(data, loading)}
      </Spin>
    );
  }
  return null;
};

type Args = {
  namespace: string;
  loadingDelay: number;
};

export default ({ namespace, loadingDelay }: Args) => {
  const mapStateToProps = state => ({
    data: state[namespace].data,
    loading: state.loading.effects[`${namespace}/fetchData`],
    loadingDelay,
  });
  return connect(mapStateToProps)(ContentWrap);
};
