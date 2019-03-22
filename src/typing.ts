import { Model } from 'dva';
import { Store } from 'redux';
import { FormComponentProps } from 'antd/lib/form';

export interface Pagination {
  current: number;
  pageSize: number;
  total: number;
}

export interface ApiResult {
  data: any;
  total: number;
}

export interface GetDataApi {
  (filters: object, pagination: Pagination): Promise<ApiResult>;
}

export type FiltersForm = React.ComponentClass<FormComponentProps> | React.SFC<FormComponentProps>;

export interface ContentFunction {
  (data?: any, loading?: boolean): React.ReactNode;
}
