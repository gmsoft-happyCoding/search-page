/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/interactive-supports-focus */
import React, { useCallback, Dispatch, useMemo } from 'react';
import { Form, Row, Col, Icon, Divider } from 'antd';
import styled from 'styled-components';
import { compact, get, merge, pick, zipObject } from 'lodash';
import { FormComponentProps } from 'antd/lib/form';
import { Filters, FiltersDefault } from '../typing';
import actions from '../useSearchPage/actions';
import { HistoryHelper, useWatch } from '../utils';
import fieldHelper from '../utils/fieldHelper';
import Mode from './mode.enum';

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

function checkChildren(chlidren) {
  try {
    chlidren[0].props.children.props.id;
  } catch (e) {
    console.error('请确保Form.Item 是 FormWrapper 的 Chlidren!');
  }
}

/**
 * 获取可见的搜索条件个数，依据模式和精简模式下配置显示的行数确定
 * @param fields  全部搜索条件
 * @param simpleModeCount  当前显示的行数
 * @param mode  模式
 */
function getVisibleCountEx(fields: React.ReactNode, simpleModeCount: number, mode: Mode) {
  const count = React.Children.count(fields);
  return mode === Mode.Simple ? simpleModeCount : count;
}

/**
 * 获取在当前模式下操作区所占栅格比重
 * @param fields  全部搜索条件
 * @param simpleModeCount  当前显示的行数
 * @param mode 模式
 */
function getActionSpanEx(fields: React.ReactNode, simpleModeCount: number, mode: Mode) {
  const fieldsLength = getVisibleCountEx(fields, simpleModeCount, mode);
  switch (fieldsLength % 3) {
    case 0:
      return 24;
    case 1:
      return 16;
    case 2:
      return 8;
    default:
      return 8;
  }
}

/**
 * 生成lable占位，布局需要，条件同操作区生成判定条件
 * @param fields
 * @param simpleModeCount
 * @param mode
 */
function getActionLabelEx(fields: React.ReactNode, simpleModeCount: number, mode: Mode) {
  return getVisibleCountEx(fields, simpleModeCount, mode) % 3 === 0 ? null : '\u00A0';
}
/**
 * 操作区布局hack，根据不同模式进行不同的marginTop hack，布局需要
 * @param fields
 * @param simpleModeCount
 * @param mode
 */
function getActionStyleEx(fields: React.ReactNode, simpleModeCount: number, mode: Mode) {
  return getVisibleCountEx(fields, simpleModeCount, mode) % 3 === 0 ? {} : { marginTop: 11 };
}

/**
 * 只要 enable 不为 false 即为真, 主要是为了兼容undefined
 * @param enable
 */
function switchModeIsEnable(enable) {
  return enable === false ? false : true;
}

/**
 * 过滤无效的chilrd
 */
function getValidChidren(children) {
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
const getChildKey = child => get(child, 'props.children.props.id');

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

export interface WrapperProps {
  dispatch: Dispatch<any>;
  children: React.ReactNodeArray;
  filters: Filters;
  filtersDefault: FiltersDefault;
  needReset?: boolean;
  mode: Mode;
  simpleMode: SimpleMode;
  /**
   * 存储在history.state中key, 如果同一个页面有多个SearchPage, 需要避免重复时请指定
   */
  storeKey?: string;
}

const FormWrapper = function(props: WrapperProps & FormComponentProps) {
  const { dispatch, children, needReset, simpleMode, filtersDefault, mode, storeKey } = props;

  const historyHelper = useMemo(() => new HistoryHelper(storeKey), [storeKey]);

  // 只要 enable 不为 false 即为真, 主要是为了兼容undefined
  const smEnable = switchModeIsEnable(simpleMode.enable);
  let validChidren = getValidChidren(children);
  let simpleModeCount = validChidren.length;
  let advancedKeys: Array<string> = [];
  if (smEnable) {
    // 默认显示 2 个搜索条件
    simpleModeCount = Math.min(
      validChidren.length,
      simpleMode.count || (simpleMode.rows || 2 / 3) * 3
    );
    // 检查children的结构是否满足要求
    checkChildren(validChidren);
    // 获取高级模式的keys
    advancedKeys = validChidren.slice(simpleModeCount).map(getChildKey);
  }
  useWatch(children, (preChildren, children) => {
    // 子项个数变化时，将原有filters中对应缺失的值清空
    const preValidChildKeys = getValidChidren(preChildren).map(getChildKey);
    const currentValidChildKeys = getValidChidren(children).map(getChildKey);
    const removeKeys = preValidChildKeys.filter(key => !currentValidChildKeys.includes(key));
    if (removeKeys.length) {
      dispatch(actions.removeFilters(removeKeys));
    }
  });

  const getFields = () =>
    compact(
      React.Children.map(validChidren, (child: any, i) => {
        if (mode === Mode.Simple && i >= simpleModeCount) {
          return null;
        }
        return <Col span={8}>{child}</Col>;
      })
    );

  // reset回调
  const reset = useCallback(() => {
    dispatch(actions.setFilters(wrap(filtersDefault)));
  }, [dispatch, filtersDefault]);

  // 模式切换
  const switchMode = useCallback(
    e => {
      e.preventDefault();
      const prevMode = mode;
      // 存储模式状态
      dispatch(actions.switchMode());
      // 持久化模式状态
      historyHelper.mergeState({ mode: prevMode === Mode.Simple ? Mode.Advance : Mode.Simple });
      // 重置更多部分的筛选条件
      const advanceDefault = pick(filtersDefault, advancedKeys);
      const advanceNull = zipObject(advancedKeys);
      if (prevMode === Mode.Advance)
        dispatch(actions.storeFilters(wrap(merge(advanceNull, advanceDefault))));
    },
    [mode]
  );

  return (
    <RootLayout>
      <Form layout="vertical">
        <Row type="flex" justify="start" gutter={24}>
          {getFields()}
          <Col
            span={getActionSpanEx(validChidren, simpleModeCount, mode)}
            style={{ textAlign: 'right' }}
          >
            {needReset || smEnable ? (
              <Form.Item
                label={getActionLabelEx(validChidren, simpleModeCount, mode)}
                style={getActionStyleEx(validChidren, simpleModeCount, mode)}
              >
                {/* 是否需要重置操作 */}
                {needReset ? (
                  <a className="action" onClick={reset} role="button">
                    重置筛选条件
                  </a>
                ) : null}
                {/* 是否需要更多操作 */}
                {smEnable && React.Children.count(validChidren) > simpleModeCount ? (
                  <>
                    {/* 分割线 */}
                    {needReset && smEnable ? <Divider type="vertical" /> : null}
                    <a onClick={switchMode} role="button">
                      {mode === Mode.Simple ? (
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
                ) : null}
              </Form.Item>
            ) : null}
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
};

export default FormWrapper;
