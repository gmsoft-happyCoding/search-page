import React, { useMemo } from 'react';
import { Spin, Empty } from 'antd';
import { Content, PaginationType } from './typing';
import fieldHelper, { Fields } from './utils/fieldHelper';
import { NO_DATA } from './useSearchPage/defaultState';

type Props = {
  children?: Content;
  data: any;
  filters: Fields;
  pagination: PaginationType;
  loadingCount: number;
  loadingDelay: number;
  forceUpdate: () => void;
};

const ContentWrap = ({
  children,
  data,
  filters,
  pagination,
  loadingCount,
  loadingDelay,
  forceUpdate,
}: Props) => {
  if (children) {
    const ContentComponent = children;
    const memoFilters = useMemo(() => fieldHelper.unwrap(filters), [filters]);

    return (
      <Spin spinning={loadingCount !== 0} delay={loadingDelay} tip="数据加载中...">
        {data === NO_DATA ? (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ) : (
          <ContentComponent
            data={data}
            forceUpdate={forceUpdate}
            loading={loadingCount !== 0}
            filters={memoFilters}
            pagination={pagination}
          />
        )}
      </Spin>
    );
  }
  return null;
};

export default ContentWrap;
