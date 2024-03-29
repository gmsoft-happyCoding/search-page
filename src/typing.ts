/* eslint-disable import/export */
import { FormComponentProps } from 'antd/lib/form';
import { Dispatch } from 'react';
import { WrapperProps } from './filters/FormWrapper';

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
  (filters: Filters, pagination: PaginationI, abortSignal?: AbortSignal): Promise<ApiResult>;
}

export type FiltersFormType<P = {}> = React.ComponentType<FormComponentProps & WrapperProps & P>;

export interface ForceUpdateArgs {
  filters?: Filters;
  pagination?: Partial<PaginationI>;
  /**
   * 删除数据的条数, 会根据删除的条数, 重新计算页码
   */
  delCount?: number;
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

export type SearchPageContentContextI<T = any> = ContentProps<T>;

export type ContentI = React.ReactElement<any> | React.ComponentType<ContentProps>;

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
