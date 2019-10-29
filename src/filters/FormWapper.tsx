/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/interactive-supports-focus */
import React, { useCallback, Dispatch, useMemo } from 'react';
import { Form, Row, Col, Icon, Divider } from 'antd';
import styled from 'styled-components';
import { compact, get, merge, pick, zipObject } from 'lodash';
import { FormComponentProps } from 'antd/lib/form';
import HistoryHelper from 'history-helper';
import { FormItemProps } from 'antd/lib/form/FormItem';
import { Filters, FiltersDefault } from '../typing';
import actions from '../useSearchPage/actions';
import { useWatch } from '../utils';
import fieldHelper from '../utils/fieldHelper';
import { Mode } from './mode.enum';
import {
  checkChildren,
  getValidChidren,
  getChildKey,
  switchModeIsEnable,
  getActionLabelEx,
  getActionStyleEx,
  getActionSpanEx,
} from './utils';

function FormItem({ span, ...rest }: WrapperFormItem) {
  return (
    <Col span={span || 8}>
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

export interface WrapperProps {
  dispatch: Dispatch<any>;
  children: React.ReactNode | React.ReactNodeArray;
  filters: Filters;
  filtersDefault: FiltersDefault;
  needReset?: boolean;
  mode: Mode;
  simpleMode: SimpleMode;
  /**
   * 存储在history.state中key, 如果同一个页面有多个SearchPage, 需要避免重复时请指定
   */
  storeKey?: string;
  /**
   * 存储数据使用的history对象, 默认为 top.history
   */
  storeHistory?: History;
}

const FormWrapper = (props: WrapperProps & FormComponentProps) => {
  const {
    dispatch,
    children,
    needReset,
    simpleMode,
    filtersDefault,
    mode,
    storeKey,
    storeHistory,
  } = props;

  const historyHelper = useMemo(() => new HistoryHelper(storeKey, storeHistory), [
    storeHistory,
    storeKey,
  ]);

  // 只要 enable 不为 false 即为真, 主要是为了兼容undefined
  const smEnable = switchModeIsEnable(simpleMode.enable);
  const validChidren = getValidChidren(children);
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
  useWatch(children, (preChildren, currentChildren) => {
    // 子项个数变化时，将原有filters中对应缺失的值清空
    const preValidChildKeys = getValidChidren(preChildren).map(getChildKey);
    const currentValidChildKeys = getValidChidren(currentChildren).map(getChildKey);
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

        if (FormItem === get(child, 'type')) {
          return child;
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
      if (prevMode === Mode.Advance) {
        dispatch(actions.storeFilters(wrap(merge(advanceNull, advanceDefault))));
      }
    },
    [advancedKeys, dispatch, filtersDefault, historyHelper, mode]
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

interface WrapperFormItem extends FormItemProps {
  span?: number;
  children: React.ReactNode;
}

FormWrapper.defaultProps = {
  needReset: true,
  simpleMode: {
    enable: true,
    rows: 2 / 3,
  },
};

FormWrapper.FormItem = FormItem;

export default FormWrapper;
