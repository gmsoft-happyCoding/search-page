import React from 'react';
import { get } from 'lodash';

export function checkChildren(chlidren) {
  try {
    if (chlidren.length) {
      // eslint-disable-next-line no-unused-expressions
      chlidren[0].props.children.props.id;
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('chlidren', chlidren);

    // eslint-disable-next-line no-console
    console.error('请确保Form.Item 是 FormWrapper 的 Chlidren!');
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
 * 过滤无效的chilrd
 */
export function getValidChidren(children) {
  const validChidren: any[] = [];
  if (children) {
    // 去除无效元素 @like false|null|undefined
    React.Children.forEach(children, child => {
      if (React.isValidElement(child)) {
        validChidren.push(child);
      }
    });
  }

  return validChidren;
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
