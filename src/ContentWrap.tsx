import React, { useMemo } from 'react';
import { Spin, Empty } from 'antd';
import { Content, PaginationI } from './typing';
import fieldHelper, { Fields } from './utils/fieldHelper';
import { NO_DATA } from './useSearchPage/defaultState';

type Props = {
  children?: Content;
  data: any;
  total: number;
  filters: Fields;
  pagination: PaginationI;
  loadingCount: number;
  loadingDelay: number;
  forceUpdate: () => void;
  alwaysRenderContent?: boolean;
};

const ContentWrap = ({
  children,
  data,
  total,
  filters,
  pagination,
  loadingCount,
  loadingDelay,
  forceUpdate,
  alwaysRenderContent,
}: Props) => {
  const memoFilters = useMemo(() => fieldHelper.unwrap(filters), [filters]);
  if (children) {
    const ContentComponent = children;
    return (
      <Spin spinning={loadingCount !== 0} delay={loadingDelay} tip="数据加载中...">
        {data === NO_DATA && !alwaysRenderContent ? (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ) : (
          <ContentComponent
            data={data}
            total={total}
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
