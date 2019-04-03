/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/interactive-supports-focus */
import React, { useCallback } from 'react';
import { Form, Row, Col, Icon, Divider } from 'antd';
import styled from 'styled-components';
import { compact, get, merge, pick, zipObject } from 'lodash';
import { FormComponentProps } from 'antd/lib/form';
import { Filters, FiltersDefault } from '../typing';
import actions from '../useSearchPage/actions';
import { historyHelper } from '../utils';
import fieldHelper from '../utils/fieldHelper';

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

/**
 * 获取可见的搜索条件个数，依据模式和精简模式下配置显示的行数确定
 * @param fields  全部搜索条件
 * @param rows  当前显示的行数
 * @param simpleModel  精简模式标志
 */
function getVisibleCountEx(fields: React.ReactNode, rows: number, simpleModel: boolean) {
  const count = React.Children.count(fields);
  if (simpleModel) {
    return count < rows * 3 ? count : rows * 3;
  }
  return count;
}

/**
 * 获取在当前模式下操作区所占栅格比重
 * @param fields  全部搜索条件
 * @param simpleModel 模式标志
 */
function getActionSpanEx(fields: React.ReactNode, rows: number, simpleModel: boolean) {
  const fieldsLength = getVisibleCountEx(fields, rows, simpleModel);
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
 * @param rows
 * @param simpleModel
 */
function getActionLabelEx(fields: React.ReactNode, rows: number, simpleModel: boolean) {
  return getVisibleCountEx(fields, rows, simpleModel) % 3 === 0 ? null : '\u00A0';
}
/**
 * 操作区布局hack，根据不同模式进行不同的marginTop hack，布局需要
 * @param fields
 * @param rows
 * @param simpleModel
 */
function getActionStyleEx(fields: React.ReactNode, rows: number, simpleModel: boolean) {
  return getVisibleCountEx(fields, rows, simpleModel) % 3 === 0 ? {} : { marginTop: 11 };
}

export interface WrapperProps {
  dispatch: Function;
  children: React.ReactNodeArray;
  filters: Filters;
  filtersDefault: FiltersDefault;
  simpleModel: boolean;
  needReset?: boolean;
  needMore?: boolean;
  rows: number;
}

export default function FormWrapper(props: WrapperProps & FormComponentProps) {
  const { dispatch, children, needReset, needMore, rows, filtersDefault, simpleModel } = props;

  const advancedKeys = children
    .slice(rows * 3)
    .map(children => get(children, 'props.children.props.id'));

  const getFields = () =>
    compact(
      React.Children.map(children, (child: any, i) => {
        if (simpleModel && i >= rows * 3) {
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
  const switchModel = useCallback(() => {
    const prevSimpleModel = simpleModel;
    // 存储模式状态
    dispatch(actions.switchModel());
    // 持久化模式状态
    historyHelper.mergeState({ simpleModel: !prevSimpleModel });
    // 重置更多部分的筛选条件
    const advanceDefault = pick(filtersDefault, advancedKeys);
    const advanceNull = zipObject(advancedKeys);
    if (!prevSimpleModel) dispatch(actions.storeFilters(wrap(merge(advanceNull, advanceDefault))));
  }, [simpleModel]);

  return (
    <RootLayout>
      <Form layout="vertical">
        <Row gutter={24}>
          {getFields()}
          <Col span={getActionSpanEx(children, rows, simpleModel)} style={{ textAlign: 'right' }}>
            {needReset || needMore ? (
              <Form.Item
                label={getActionLabelEx(children, rows, simpleModel)}
                style={getActionStyleEx(props.children, rows, simpleModel)}
              >
                {/* 是否需要重置操作 */}
                {needReset ? (
                  <a className="action" onClick={reset} role="button">
                    重置筛选条件
                  </a>
                ) : null}
                {/* 是否需要更多操作 */}
                {needMore && React.Children.count(children) > rows * 3 ? (
                  <>
                    {/* 分割线 */}
                    {needReset && needMore ? <Divider type="vertical" /> : null}
                    <a className="more-wrapper action" onClick={switchModel} role="button">
                      <span className={simpleModel ? 'more' : 'more active'}>
                        <Label>展开</Label>
                        <Icon type="down" />
                      </span>
                      <span
                        className={simpleModel ? 'more more-absolute active' : 'more more-absolute'}
                      >
                        <Label>收起</Label>
                        <Icon type="up" />
                      </span>
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
  simpleModel: true,
  needReset: true,
  needMore: true,
  rows: 1,
};
