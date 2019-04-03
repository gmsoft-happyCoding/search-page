import React from 'react';
import { Spin } from 'antd';
import { ContentFunction } from './typing';

type Props = {
  children?: ContentFunction;
  data: any;
  loadingCount: number;
  loadingDelay: number;
  forceUpdate: () => void;
};

const ContentWrap = ({ children, data, loadingCount, loadingDelay, forceUpdate }: Props) => {
  if (children && typeof children === 'function') {
    return (
      <Spin spinning={loadingCount !== 0} delay={loadingDelay} tip="数据加载中...">
        {children(data, forceUpdate, loadingCount !== 0)}
      </Spin>
    );
  }
  return null;
};

export default ContentWrap;
