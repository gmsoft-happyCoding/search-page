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

export interface Filters {
  [key: string]: any;
}

export interface State {
  filters: Filters;
  pagination: PaginationType;
}

export interface GetDataApi {
  (filters: Filters, pagination: PaginationType): Promise<ApiResult>;
}

export type FiltersFormType = React.ComponentType<
  FormComponentProps<any> & {
    dispatch: Dispatch<any>;
    filters: Fields;
    children: React.ReactNode;
    state: any;
    showKeys?: Array<string>;
    needReset?: boolean;
    needMore?: boolean;
    rows?: number;
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
  value?: any;
}

export interface Fields {
  [key: string]: FieldConfig;
}

export enum ClearModel {
  /**
   * [暂未实现]保留高级搜索条件，但搜索时不会携带高级搜索条件进行搜索，仅保留下次待用
   */
  MODEL_COMPATIBLE = 'COMPATIBLE',
  /**
   * 清除高级搜索条件
   */
  MODEL_RETAIN = 'retain',
  /**
   * 清除所有条件
   */
  MODEL_CLEAR_ALL = 'clear_all',
}

export interface ComponentState {
  /**
   * 高级搜索是否打开
   */
  openAdvanced: boolean;
}
