import React from 'react';
import { Spin } from 'antd';
import { ContentFunction } from './typing';

type Props = {
  children?: ContentFunction;
  data: any;
  loading: boolean;
  loadingDelay: number;
  forceUpdate: () => void;
};

const ContentWrap = ({ children, data, loading, loadingDelay, forceUpdate }: Props) => {
  if (children && typeof children === 'function') {
    return (
      <Spin spinning={loading} delay={loadingDelay} tip="数据加载中...">
        {children(data, forceUpdate, loading)}
      </Spin>
    );
  }
  return null;
};

export default ContentWrap;
