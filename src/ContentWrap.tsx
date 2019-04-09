import React from 'react';
import { Spin } from 'antd';
import { ContentFunction } from './typing';
import fieldHelper, { Fields } from './utils/fieldHelper';

type Props = {
  children?: ContentFunction;
  data: any;
  filters: Fields;
  loadingCount: number;
  loadingDelay: number;
  forceUpdate: () => void;
};

const ContentWrap = ({
  children,
  data,
  filters,
  loadingCount,
  loadingDelay,
  forceUpdate,
}: Props) => {
  if (children && typeof children === 'function') {
    return (
      <Spin spinning={loadingCount !== 0} delay={loadingDelay} tip="数据加载中...">
        {children(data, forceUpdate, loadingCount !== 0, fieldHelper.unwrap(filters))}
      </Spin>
    );
  }
  return null;
};

export default ContentWrap;
