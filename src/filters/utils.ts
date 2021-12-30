import React from 'react';
import { get } from 'lodash';
import { ColProps } from 'antd/lib/col';

export function checkChildren(children) {
  try {
    if (children.length) {
      // eslint-disable-next-line no-unused-expressions
      children[0].props.children.props.id;
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('children', children);

    // eslint-disable-next-line no-console
    console.error('请确保Form.Item 是 FormWrapper 的 Children!');
  }
}

/**
 * 只要 enable 不为 false 即为真, 主要是为了兼容undefined
 * @param enable
 */
export function switchModeIsEnable(enable) {
  return enable !== false;
}

/**
 * 过滤无效的 child
 */
export function getValidChildren(children) {
  const validChildren: any[] = [];
  if (children) {
    // 去除无效元素 @like false|null|undefined
    React.Children.forEach(children, child => {
      if (React.isValidElement(child)) {
        validChildren.push(child);
      }
    });
  }

  return validChildren;
}

/**
 * 获取子项的key
 * props.children.props.id
 */
export function getChildKey(child) {
  return get(child, 'props.children.props.id');
}

/**
 * 获取子项的label
 * props.label
 */
export function getChildLabel(child) {
  return get(child, 'props.label');
}

const setLocalStorage = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};
const getLocalStorage = (key: string) => {
  try {
    return JSON.parse(localStorage.getItem(key) || 'null');
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('getLocalStorage', err);
  }
  return null;
};

const customFiltersLocalStorageKey = (key: string) => `search-page-custom-filters-case-${key}`;

/** 在 localStorage 中缓存 定制化搜索项目数据 */
export const setCustomFiltersLocalStorage = (key: string, value: any) => {
  setLocalStorage(customFiltersLocalStorageKey(key), value);
};

/** 取出 localStorage 中缓存 定制化搜索项目数据 */
export const getCustomFiltersLocalStorage = (key: string) =>
  getLocalStorage(customFiltersLocalStorageKey(key)) || [];

// sm 屏幕 ≥ 576px 响应式栅格
const SM_POINT = 576;
// md 屏幕 ≥ 768px 响应式栅格
const MD_POINT = 768;
// lg 屏幕 ≥ 992px 响应式栅格
const LG_POINT = 992;
// xl 屏幕 ≥ 1200px 响应式栅格
const XL_POINT = 1200;
// xxl 屏幕 ≥ 1600px 响应式栅格
const XXL_POINT = 1600;

// 分隔点属性
const pointProps = ['xxl', 'xl', 'lg', 'md', 'sm', 'xs', 'span'];

/**
 * 尝试依次向下取值
 */
function getGridSize(pointPropsIndex: number, colProps: ColProps) {
  for (let i = pointPropsIndex; i < pointProps.length; i++) {
    const size = get(colProps, pointProps[i]);
    if (size) return size;
  }
  // default size
  return 8;
}

/**
 * 计算每一列显示多少个元素
 */
function calcPerRowCount(colProps: ColProps) {
  const windowWidth = window.document.body.clientWidth;

  let pointPropsIndex = 0;

  if (windowWidth >= XXL_POINT) {
    pointPropsIndex = 0;
  } else if (windowWidth >= XL_POINT) {
    pointPropsIndex = 1;
  } else if (windowWidth >= LG_POINT) {
    pointPropsIndex = 2;
  } else if (windowWidth >= MD_POINT) {
    pointPropsIndex = 3;
  } else if (windowWidth >= SM_POINT) {
    pointPropsIndex = 4;
  } else if (windowWidth < SM_POINT) {
    pointPropsIndex = 5;
  }

  return 24 / getGridSize(pointPropsIndex, colProps);
}

/**
 * 根据设置的 行数 和 栅格 计算 simpleMode 下默认显示的筛选条件个数
 * @param _rows 设置的行数
 * @param colProps 设置的theme.colProps
 */
export const getCountByRows = (_rows: number = 1, colProps: ColProps = {}) => {
  /**
   * 兼容旧版允许设置rows为分数的情况例如，2/3
   * 在响应式布局的情况下，分母不再固定为3，设置分数不再由意义
   */
  const rows = Math.round(_rows);

  // 至少显示一个
  if (rows === 0) return 1;

  /**
   * 操作按钮需要占用一个位置
   * 至少要显示一个筛选条件
   */
  return calcPerRowCount(colProps) * rows - 1 || 1;
};
