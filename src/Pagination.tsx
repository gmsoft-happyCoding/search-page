import React, { useMemo, Dispatch } from 'react';
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

  const onPageChange = (current, pageSize) => {
    dispatch(actions.storePagination({ current, pageSize }));
  };

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
      onShowSizeChange={onPageChange}
    />
  );
}

export default Pagination;
