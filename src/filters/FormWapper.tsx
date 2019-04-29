/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/interactive-supports-focus */
import React, { useCallback, Dispatch } from 'react';
import { Form, Row, Col, Icon, Divider } from 'antd';
import styled from 'styled-components';
import { compact, get, merge, pick, zipObject } from 'lodash';
import { FormComponentProps } from 'antd/lib/form';
import { Filters, FiltersDefault } from '../typing';
import actions from '../useSearchPage/actions';
import { historyHelper } from '../utils';
import fieldHelper from '../utils/fieldHelper';
import Mode from './mode.enum';

const { wrap } = fieldHelper;

const RootLayout = styled.div`
  margin-bottom: 8px;
  & .ant-form-vertical .ant-form-item {
    margin-bottom: 8px;
  }
  .more-wrapper {
    position: relative;
  }
  .more {
    display: inline-block;
    transition: transform 0.3s;
  }
  .more.active {
    transform: rotateX(90deg);
  }
  .more-absolute {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
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
}

export default function FormWrapper(props: WrapperProps & FormComponentProps) {
  const { dispatch, children, needReset, simpleMode, filtersDefault, mode } = props;

  // 只要 enable 不为 false 即为真, 主要是为了兼容undefined
  const smEnable = switchModeIsEnable(simpleMode.enable);

  let simpleModeCount = children.length;
  let advancedKeys: Array<string> = [];
  if (smEnable) {
    // 默认显示 2 个搜索条件
    simpleModeCount = Math.min(children.length, simpleMode.count || (simpleMode.rows || 2 / 3) * 3);
    // 检查children的结构是否满足要求
    checkChildren(children);
    // 获取高级模式的keys
    advancedKeys = children
      .slice(simpleModeCount)
      .map(children => get(children, 'props.children.props.id'));
  }

  const getFields = () =>
    compact(
      React.Children.map(children, (child: any, i) => {
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
        <Row gutter={24}>
          {getFields()}
          <Col
            span={getActionSpanEx(children, simpleModeCount, mode)}
            style={{ textAlign: 'right' }}
          >
            {needReset || smEnable ? (
              <Form.Item
                label={getActionLabelEx(children, simpleModeCount, mode)}
                style={getActionStyleEx(props.children, simpleModeCount, mode)}
              >
                {/* 是否需要重置操作 */}
                {needReset ? (
                  <a className="action" onClick={reset} role="button">
                    重置筛选条件
                  </a>
                ) : null}
                {/* 是否需要更多操作 */}
                {smEnable && React.Children.count(children) > simpleModeCount ? (
                  <>
                    {/* 分割线 */}
                    {needReset && smEnable ? <Divider type="vertical" /> : null}
                    <a className="more-wrapper action" onClick={switchMode} role="button">
                      {mode === Mode.Simple ? (
                        <span className={mode === Mode.Simple ? 'more' : 'more active'}>
                          <Label>展开</Label>
                          <Icon type="down" />
                        </span>
                      ) : (
                        <span className="more">
                          <Label>收起</Label>
                          <Icon type="up" />
                        </span>
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
}

FormWrapper.defaultProps = {
  needReset: true,
};
