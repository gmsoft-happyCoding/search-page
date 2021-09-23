/* eslint-disable import/export */
import { FormComponentProps } from 'antd/lib/form';
import { WrapperProps } from './filters/FormWapper';
import { Dispatch } from 'react';

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

export interface ForceUpdateArgs {
  filters?: Filters;
  pagination?: Partial<PaginationI>;
}

export interface ForceUpdate {
  (): void;
}

export interface ForceUpdate {
  (args?: ForceUpdateArgs): void;
}

export interface ContentProps<T = any> {
  data: T;
  total: number;
  forceUpdate: ForceUpdate;
  loading: boolean;
  filters: Filters;
  pagination: PaginationI;
  dispatch: Dispatch<any>;
  tableWidthConfs: { key: string; width: number }[];
  storeKey?: string;
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

export interface RefreshOpt {
  /** 只要没有显示传递false，都默认true */
  enable?: boolean;
  /** 切换刷新的间隔时间，间隔时间内切换页签不会进行刷新 */
  interval?: number;
}
