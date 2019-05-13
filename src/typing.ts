import { FormComponentProps } from 'antd/lib/form';
import { WrapperProps } from './filters/FormWapper';
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

export interface FiltersDefault {
  [key: string]: any;
}

export interface State {
  filters: Filters;
  pagination: PaginationType;
}

export interface GetDataApi {
  (filters: Filters, pagination: PaginationType): Promise<ApiResult>;
}

export type FiltersFormType<p = {}> = React.ComponentType<FormComponentProps & WrapperProps & p>;

export interface ContentProps<T = any> {
  data: T;
  forceUpdate: () => void;
  loading: boolean;
  filters: Filters;
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
