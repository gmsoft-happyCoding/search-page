import React, { useMemo, Dispatch } from 'react';
import { isElement } from 'react-is';
import { Spin, Empty } from 'antd';
import { ContentI, ContentProps, PaginationI } from '../typing';
import fieldHelper, { Fields } from '../utils/fieldHelper';
import { NO_DATA } from '../useSearchPage/defaultState';
import SearchPageContentContext from './SearchPageContentContext';

type Props = {
  children?: ContentI;
  data: any;
  total: number;
  filters: Fields;
  pagination: PaginationI;
  loadingCount: number;
  loadingDelay: number;
  forceUpdate: () => void;
  alwaysRenderContent?: boolean;
  dispatch: Dispatch<any>;
  tableWidthConfs: { key: string; width: number }[];
  storeKey?: string;
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
  dispatch,
  tableWidthConfs,
  storeKey,
}: Props) => {
  const memoFilters = useMemo(() => fieldHelper.unwrap(filters), [filters]);

  const childrenProps = useMemo(
    () => ({
      data,
      total,
      forceUpdate,
      loading: loadingCount !== 0,
      filters: memoFilters,
      pagination,
      dispatch,
      tableWidthConfs,
      storeKey,
    }),
    [
      data,
      dispatch,
      forceUpdate,
      loadingCount,
      memoFilters,
      pagination,
      storeKey,
      tableWidthConfs,
      total,
    ]
  );

  const SpinProps = useMemo(
    () => ({
      spinning: loadingCount !== 0,
      delay: loadingDelay,
      tip: '数据加载中...',
    }),
    [loadingCount, loadingDelay]
  );

  if (children) {
    if (data === NO_DATA && !alwaysRenderContent) {
      return (
        <Spin {...SpinProps}>
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </Spin>
      );
    }

    if (isElement(children)) {
      return (
        <Spin {...SpinProps}>
          <SearchPageContentContext.Provider value={childrenProps}>
            {children}
          </SearchPageContentContext.Provider>
        </Spin>
      );
    }

    const ContentComponent = children as React.ComponentType<ContentProps>;

    return (
      <Spin {...SpinProps}>
        <ContentComponent {...childrenProps} />
      </Spin>
    );
  }

  return null;
};

export default ContentWrap;
