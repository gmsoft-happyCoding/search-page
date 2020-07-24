/* eslint-disable function-paren-newline */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/interactive-supports-focus */
import React, { useCallback, Dispatch, useMemo, useEffect, useState, CSSProperties } from 'react';
import { Form, Row, Col, Icon, Divider, Button } from 'antd';
import styled from 'styled-components';
import { compact, get, merge, pick, zipObject, uniq, keys, difference } from 'lodash';
import { FormComponentProps } from 'antd/lib/form';
import HistoryHelper from 'history-helper';
import { FormItemProps } from 'antd/lib/form/FormItem';
import { ButtonProps } from 'antd/lib/button';
import { ColProps } from 'antd/lib/col';
import { RowProps } from 'antd/lib/row';
import CustomFilterController from './CustomFilterController';
import { Filters, FiltersDefault } from '../typing';
import actions from '../useSearchPage/actions';
import { useWatch } from '../utils';
import fieldHelper from '../utils/fieldHelper';
import FilterMode from '../enums/FilterMode';
import { ForceUpdate } from '../../dist/typing';
import {
  checkChildren,
  getValidChidren,
  getChildKey,
  getChildLabel,
  switchModeIsEnable,
  getCustomFiltersLocalStorage,
  setCustomFiltersLocalStorage,
} from './utils';
import SearchMode from '../enums/SearchMode';

interface WrapperFormItem extends FormItemProps {
  span?: number;
  colProps?: ColProps;
  children: React.ReactNode;
}

function FormItem({ span, colProps, ...rest }: WrapperFormItem) {
  return (
    <Col span={span || 8} {...colProps}>
      <Form.Item {...rest} />
    </Col>
  );
}

const { wrap } = fieldHelper;

const MoreSpan = styled.span`
  display: inline-block;
`;

const RootLayout = styled.div`
  margin-bottom: 8px;
  & .ant-form-vertical .ant-form-item {
    padding-bottom: 0;
    margin-bottom: 16px;
  }
`;

const Label = styled.span`
  margin-right: 4px;
`;

export interface SimpleMode {
  /**
   * 是否启用
   * @default true
   */
  enable?: boolean;
  /**
   * 精简模式显示的搜索条件数量, 优先级高于 rows
   */
  count?: number;
  /**
   * 精简模式显示的搜索条件行数
   */
  rows?: number;
}

export interface ThemeI {
  rowProps?: RowProps;
  colProps?: ColProps;
}

export interface WrapperProps {
  dispatch: Dispatch<any>;
  children: React.ReactNode | React.ReactNodeArray;
  filters: Filters;
  filtersDefault: FiltersDefault;
  searchMode: SearchMode;
  forceUpdate: ForceUpdate;
  loadingCount: number;
  /**
   * default true
   */
  needReset?: boolean;
  /**
   * 默认重置筛选条件为 filtersDefault
   * 通过此配置可以设置要重置时要保留的 filtersDefaultKeys
   * 如果想全部清空, 请设置为 []
   */
  resetRetainFiltersDefaultKeys?: Array<string>;
  /**
   * 显示模式
   */
  mode: FilterMode;
  /**
   * 精简模式的配置
   */
  simpleMode: SimpleMode;
  /**
   * 存储在history.state中key, 如果同一个页面有多个SearchPage, 需要避免重复时请指定
   */
  storeKey?: string;
  /**
   * 存储数据使用的history对象, 默认为 top.history
   */
  storeHistory?: History;
  /**
   * 定制化筛选条件
   */
  defaultCustomFiltersConf?: {
    /**
     * 定制配置存储在 localStorage 中 key
     */
    storageKey: string;
    /**
     * 禁止定制的项
     */
    notAllowCustomKeys?: string[];
    /**
     * 筛选配置面板label定制
     */
    labels?: { [key: string]: string };
    /**
     * Popover.props.getPopupContainer
     */
    getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
    /**
     * Popover.props.overlayStyle
     * @default { maxWidth: 450 }
     */
    popoverOverlayStyle?: CSSProperties;
  };
  /**
   * 搜索按钮文字
   */
  searchButtonText?: string;
  /**
   * 搜索按钮props
   */
  searchButtonProps?: ButtonProps;
  /**
   * 主题设置
   */
  theme?: ThemeI;
}

const FormWrapper = (props: WrapperProps & FormComponentProps) => {
  const {
    dispatch,
    children,
    forceUpdate,
    loadingCount,
    needReset,
    resetRetainFiltersDefaultKeys,
    simpleMode,
    filtersDefault,
    mode,
    storeKey,
    storeHistory,
    defaultCustomFiltersConf,
    searchMode,
    searchButtonText,
    searchButtonProps,
    theme,
  } = props;

  const doSearch = useCallback(() => forceUpdate(), [forceUpdate]);

  const [filtersConfig, setFiltersConfig] = useState<
    { key: string; name: string; disabled?: boolean }[]
  >([]);

  const [showFiltersKeys, setShowFiltersKeys] = useState<string[]>(() => {
    if (get(defaultCustomFiltersConf, 'storageKey')) {
      return getCustomFiltersLocalStorage(get(defaultCustomFiltersConf, 'storageKey'));
    }
    return [];
  });

  const updateShowFiltersKeys = useCallback(
    (newKeys: string[]) => {
      if (get(defaultCustomFiltersConf, 'storageKey')) {
        setCustomFiltersLocalStorage(get(defaultCustomFiltersConf, 'storageKey'), newKeys);
        setShowFiltersKeys(() => newKeys);
      }
    },
    [defaultCustomFiltersConf]
  );

  const historyHelper = useMemo(() => new HistoryHelper(storeKey, storeHistory), [
    storeHistory,
    storeKey,
  ]);

  // 只要 enable 不为 false 即为真, 主要是为了兼容undefined
  const smEnable = useMemo(() => switchModeIsEnable(simpleMode.enable), [simpleMode]);

  /** 取出有效的 chilrd */
  const validChidren = useMemo(() => {
    if (defaultCustomFiltersConf) {
      return getValidChidren(children).filter(child =>
        showFiltersKeys.includes(getChildKey(child))
      );
    }
    return getValidChidren(children);
  }, [children, showFiltersKeys, defaultCustomFiltersConf]);
  useEffect(() => {
    if (smEnable) {
      // 检查children的结构是否满足要求
      checkChildren(validChidren);
    }
  }, [validChidren, smEnable]);

  /** 有效子节点个数 */
  const simpleModeCount = useMemo(() => {
    if (smEnable) {
      // 默认显示 2 个搜索条件
      return Math.min(
        validChidren.length,
        simpleMode.count || Math.floor((simpleMode.rows || 2 / 3) * 3)
      );
    }
    return validChidren.length;
  }, [validChidren.length, simpleMode, smEnable]);

  const advancedKeys = useMemo<string[]>(() => {
    if (smEnable) {
      return validChidren.slice(simpleModeCount).map(getChildKey);
    }
    return [];
  }, [smEnable, validChidren, simpleModeCount]);

  useEffect(() => {
    if (defaultCustomFiltersConf && defaultCustomFiltersConf.storageKey) {
      const allConf = getValidChidren(children).map(item => ({
        id: getChildKey(item),
        label: getChildLabel(item),
      }));
      const defaultKeys = uniq([
        ...getCustomFiltersLocalStorage(defaultCustomFiltersConf.storageKey),
        ...keys(filtersDefault),
      ]);
      const { notAllowCustomKeys, labels } = defaultCustomFiltersConf;
      setFiltersConfig(() =>
        allConf.map(item => ({
          key: item.id,
          name: get(labels, item.id, item.label),
          disabled: (notAllowCustomKeys || []).includes(item.id),
        }))
      );
      if (notAllowCustomKeys) {
        updateShowFiltersKeys(uniq([...defaultKeys, ...notAllowCustomKeys]));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useWatch(showFiltersKeys, (preKeys, currentKeys) => {
    const removeKeys = difference(preKeys, currentKeys);
    if (removeKeys.length) {
      dispatch(actions.removeFilters(removeKeys));
    }
  });

  useWatch(children, (preChildren, currentChildren) => {
    // 子项个数变化时，将原有filters中对应缺失的值清空
    const preValidChildKeys = getValidChidren(preChildren).map(getChildKey);
    const currentValidChildKeys = getValidChidren(currentChildren).map(getChildKey);
    const removeKeys = preValidChildKeys.filter(key => !currentValidChildKeys.includes(key));
    if (removeKeys.length) {
      dispatch(actions.removeFilters(removeKeys));
    }
    if (defaultCustomFiltersConf) {
      const allConf = getValidChidren(children).map(item => ({
        id: getChildKey(item),
        label: getChildLabel(item),
      }));
      const { notAllowCustomKeys, labels } = defaultCustomFiltersConf;
      setFiltersConfig(() =>
        allConf.map(item => ({
          key: item.id,
          name: get(labels, item.id, item.label),
          disabled: (notAllowCustomKeys || []).includes(item.id),
        }))
      );
    }
  });
  // 表单项节点
  const fieldsNodes = useMemo(
    () =>
      compact(
        React.Children.map(validChidren, (child: any, i) => {
          if (mode === FilterMode.Simple && i >= simpleModeCount) {
            return null;
          }

          if (FormItem === get(child, 'type')) {
            return child;
          }
          return (
            <Col span={8} {...theme!.colProps}>
              {child}
            </Col>
          );
        })
      ),
    [validChidren, mode, simpleModeCount, theme]
  );

  // reset回调
  const reset = useCallback(() => {
    dispatch(
      actions.setFilters(
        wrap(
          resetRetainFiltersDefaultKeys
            ? pick(filtersDefault, resetRetainFiltersDefaultKeys)
            : filtersDefault
        )
      )
    );
  }, [dispatch, filtersDefault, resetRetainFiltersDefaultKeys]);

  // 模式切换
  const switchMode = useCallback(
    e => {
      e.preventDefault();
      const prevMode = mode;
      // 存储模式状态
      dispatch(actions.switchMode());
      // 持久化模式状态
      historyHelper.mergeState({
        mode: prevMode === FilterMode.Simple ? FilterMode.Advance : FilterMode.Simple,
      });
      // 重置更多部分的筛选条件
      const advanceDefault = pick(filtersDefault, advancedKeys);
      const advanceNull = zipObject(advancedKeys);
      if (prevMode === FilterMode.Advance) {
        dispatch(actions.storeFilters(wrap(merge(advanceNull, advanceDefault))));
      }
    },
    [advancedKeys, dispatch, filtersDefault, historyHelper, mode]
  );

  return (
    <RootLayout>
      <Form layout="vertical">
        <Row type="flex" justify="start" gutter={24} {...theme!.rowProps}>
          {fieldsNodes}
          {/* hack 靠右,靠下对齐
           * see: https://stackoverflow.com/questions/22429003/how-to-right-align-flex-item/22429853#22429853
           * https://stackoverflow.com/questions/31000885/align-an-element-to-bottom-with-flexbox
           */}
          <Col style={{ textAlign: 'right', marginTop: 'auto', marginLeft: 'auto' }}>
            {(needReset || smEnable) && (
              <Form.Item>
                {/* 是否需要重置操作 */}
                {needReset && (
                  <a className="action" onClick={reset} role="button">
                    重置筛选条件
                  </a>
                )}
                {!!defaultCustomFiltersConf && (
                  <>
                    {/* 分割线 */}
                    <Divider type="vertical" />
                    <CustomFilterController
                      allConfigs={filtersConfig}
                      getPopupContainer={defaultCustomFiltersConf.getPopupContainer}
                      popoverOverlayStyle={
                        defaultCustomFiltersConf.popoverOverlayStyle || { maxWidth: 450 }
                      }
                      activeKeys={showFiltersKeys}
                      onChange={updateShowFiltersKeys}
                    />
                  </>
                )}
                {/* 是否需要更多操作 */}
                {smEnable && React.Children.count(validChidren) > simpleModeCount && (
                  <>
                    {/* 分割线 */}
                    {needReset && smEnable && <Divider type="vertical" />}
                    <a onClick={switchMode} role="button">
                      {mode === FilterMode.Simple ? (
                        <MoreSpan>
                          <Label>展开</Label>
                          <Icon type="down" />
                        </MoreSpan>
                      ) : (
                        <MoreSpan>
                          <Label>收起</Label>
                          <Icon type="up" />
                        </MoreSpan>
                      )}
                    </a>
                  </>
                )}
                {searchMode === SearchMode.TRIGGER && (
                  <>
                    <Divider type="vertical" />
                    <Button
                      type="primary"
                      loading={loadingCount > 0}
                      onClick={doSearch}
                      {...searchButtonProps}
                    >
                      {searchButtonText}
                    </Button>
                  </>
                )}
              </Form.Item>
            )}
          </Col>
        </Row>
      </Form>
    </RootLayout>
  );
};

FormWrapper.defaultProps = {
  needReset: true,
  simpleMode: {
    enable: true,
    rows: 2 / 3,
  },
  searchButtonText: '查询',
  theme: {
    rowProps: {},
    colProps: {},
  },
};

FormWrapper.FormItem = FormItem;

export default FormWrapper;
