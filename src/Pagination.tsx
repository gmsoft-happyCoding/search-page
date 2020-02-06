import React, { useMemo, Dispatch, useCallback } from 'react';
import { Pagination as AntdPagination } from 'antd';
import styled from 'styled-components';
import actions from './useSearchPage/actions';
import { PaginationI } from './typing';

const StyledPagination = styled(AntdPagination)`
  & .ant-pagination-total-text {
    float: left;
    color: #999999;
  }
`;

const createsShowTotal = (pageSize: number) => (total: number, range: [number, number]) => {
  const pageCount = Math.ceil(total / pageSize);
  const currentPage = (range[0] - 1) / pageSize + 1;
  return `共 ${total} 条记录 第 ${currentPage} / ${pageCount} 页`;
};

interface StateProps {
  pagination: PaginationI;
  total: number;
}

interface DispatchProps {
  dispatch: Dispatch<any>;
}

type Props = StateProps & DispatchProps;

function Pagination({ dispatch, pagination, total }: Props) {
  const showTotal = useMemo(() => createsShowTotal(pagination.pageSize), [pagination.pageSize]);

  const onPageChange = useCallback(
    (current, pageSize) => {
      dispatch(actions.storePagination({ current, pageSize }));
    },
    [dispatch]
  );

  const onShowSizeChange = useCallback(
    (_, pageSize) => {
      const prePageSize = pagination.pageSize;
      const prePage = pagination.current;
      /**
       * 当前页(分页改变之前)第一条数据的索引
       */
      const preFristIndex = (prePage - 1) * prePageSize + 1;
      switch (true) {
        case preFristIndex > pageSize:
          dispatch(
            actions.storePagination({
              current: Math.ceil(preFristIndex / pageSize),
              pageSize,
            })
          );
          break;
        case preFristIndex < pageSize:
          dispatch(
            actions.storePagination({
              current: Math.floor(pageSize / preFristIndex),
              pageSize,
            })
          );
          break;
        default:
          dispatch(
            actions.storePagination({
              current: 1,
              pageSize,
            })
          );
      }
    },
    [dispatch, pagination]
  );

  return (
    <StyledPagination
      style={{ textAlign: 'right', marginTop: 16 }}
      showQuickJumper
      showSizeChanger
      pageSizeOptions={['5', '10', '20', '30', '40']}
      defaultCurrent={1}
      hideOnSinglePage
      showTotal={showTotal}
      current={pagination.current}
      pageSize={pagination.pageSize}
      total={total}
      onChange={onPageChange}
      onShowSizeChange={onShowSizeChange}
    />
  );
}

export default Pagination;
