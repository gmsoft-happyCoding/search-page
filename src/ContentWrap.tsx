import React, { useMemo } from 'react';
import { Spin } from 'antd';
import { Content } from './typing';
import fieldHelper, { Fields } from './utils/fieldHelper';

type Props = {
  children?: Content;
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
  if (children) {
    const ContentComponent = children;
    const memoFilters = useMemo(() => fieldHelper.unwrap(filters), [filters]);

    return (
      <Spin spinning={loadingCount !== 0} delay={loadingDelay} tip="数据加载中...">
        <ContentComponent
          data={data}
          forceUpdate={forceUpdate}
          loading={loadingCount !== 0}
          filters={memoFilters}
        />
      </Spin>
    );
  }
  return null;
};

export default ContentWrap;
