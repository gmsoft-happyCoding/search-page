import { FormComponentProps } from 'antd/lib/form';
import { Dispatch } from 'react';

export interface PaginationType {
  current: number;
  pageSize: number;
}

export interface ApiResult {
  data: any;
  total: number;
}

export interface State {
  filters: object;
  pagination: PaginationType;
}

export interface GetDataApi {
  (filters: object, pagination: PaginationType): Promise<ApiResult>;
}

export type FiltersFormType = React.ComponentType<
  FormComponentProps<any> & {
    dispatch: Dispatch<any>;
    filters: Fields;
  }
>;

export interface ContentFunction {
  (data?: any, loading?: boolean): React.ReactNode;
}

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

export enum ClearModel {
  /**
   * 默认模式：保留高级搜索条件，但搜索时不会携带高级搜索条件进行搜索，仅保留下次待用
   */
  MODEL_DEFAULT = 'default',
  /**
   * 清除高级搜索条件
   */
  MODEL_RETAIN = 'retain',
  /**
   * 清除所有条件
   */
  MODEL_CLEAR_ALL = 'clear_all',
}
