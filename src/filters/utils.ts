import React from 'react';
import { get, isNil, isNumber } from 'lodash';
import FilterMode from '../enums/FilterMode';

export function checkChildren(chlidren) {
  try {
    if (chlidren.length) {
      // eslint-disable-next-line no-unused-expressions
      chlidren[0].props.children.props.id;
    }
  } catch (e) {
    console.log('chlidren', chlidren);

    // eslint-disable-next-line no-console
    console.error('请确保Form.Item 是 FormWrapper 的 Chlidren!');
  }
}

/**
 * 获取在当前模式下操作区所占栅格比重
 * @param fields  全部搜索条件
 * @param simpleModeCount 精简模式下显示的元素数
 * @param mode 模式
 */
export function getActionSpanEx(
  fields: React.ReactNode,
  simpleModeCount: number,
  mode: FilterMode
) {
  const childs: React.ReactNode[] = [];
  React.Children.forEach(fields, (child, index) => {
    if (mode === FilterMode.Advance || index < simpleModeCount) {
      childs.push(child);
    }
  });
  // 操作区的栅格大小计算
  let spanCount = 0;
  for (let index = 0; index < childs.length; index++) {
    const node = childs[index];
    const spanConf = get(node, 'props.span');
    if (!isNil(spanConf) && isNumber(spanConf)) {
      spanCount += spanConf;
      spanCount = spanCount > 24 ? spanConf : spanCount;
    } else {
      spanCount += 8;
      spanCount = spanCount > 24 ? 8 : spanCount;
    }
  }
  return 24 - spanCount < 8 ? 24 : 24 - spanCount;
}

/**
 * 生成lable占位，布局需要，条件同操作区生成判定条件
 * @param fields
 * @param simpleModeCount
 * @param mode
 */
export function getActionLabelEx(
  fields: React.ReactNode,
  simpleModeCount: number,
  mode: FilterMode
) {
  return getActionSpanEx(fields, simpleModeCount, mode) === 24 ? null : '\u00A0';
}
/**
 * 操作区布局hack，根据不同模式进行不同的marginTop hack，布局需要
 * @param fields
 * @param simpleModeCount
 * @param mode
 */
export function getActionStyleEx(
  fields: React.ReactNode,
  simpleModeCount: number,
  mode: FilterMode
) {
  return getActionSpanEx(fields, simpleModeCount, mode) === 24 ? {} : { marginTop: 11 };
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
