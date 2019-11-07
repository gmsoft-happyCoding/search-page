/* eslint-disable import/export */
import { FormComponentProps } from 'antd/lib/form';
import { WrapperProps } from './filters/FormWapper';

export interface PaginationI {
  current: number;
  pageSize: number;
}

export interface ApiResult {
  data: any;
  total: number;
}

export interface Filters {
  [key: string]: any;
}

export interface FiltersDefault {
  [key: string]: any;
}

export interface State {
  filters: Filters;
  pagination: PaginationI;
}

export interface GetDataApi {
  (filters: Filters, pagination: PaginationI): Promise<ApiResult>;
}

export type FiltersFormType<P = {}> = React.ComponentType<FormComponentProps & WrapperProps & P>;

export interface forceUpdateArgs {
  filters?: Filters;
  pagination?: Partial<PaginationI>;
}

export interface ForceUpdate {
  (): void;
}

export interface ForceUpdate {
  (args?: forceUpdateArgs): void;
}

export interface ContentProps<T = any> {
  data: T;
  forceUpdate: ForceUpdate;
  loading: boolean;
  filters: Filters;
  pagination: PaginationI;
}

export type Content = React.ComponentType<ContentProps>;

export interface FieldConfig {
  /**
   * 第一版简单实现, 只支持 input
   * 复杂的表单还是自己写吧
   */
  type: 'input';
  label: string;
  placeholder?: string;
}

export interface Fields {
  [key: string]: FieldConfig;
}
