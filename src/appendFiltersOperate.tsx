/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/interactive-supports-focus */
import React, { useCallback, useState } from 'react';
import { Form, Row, Col, Icon, Divider } from 'antd';
import styled from 'styled-components';
import { compact } from 'lodash';
import { FormComponentProps } from 'antd/lib/form';
import { mapValues } from 'lodash';
import { ClearModel } from './typing';
import actions from './useSearchPage/actions';
import { historyHelper } from './utils';

const RootLayout = styled.div`
  margin-bottom: 10px;
  & .ant-form-vertical .ant-form-item {
    margin: 0;
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

function getVisibleCountEx(fields: React.ReactNode[], rows: number, simpleModel: boolean) {
  if (simpleModel) {
    return fields.length < rows * 3 ? fields.length : rows * 3;
  }
  return fields.length;
}

/**
 * 获取在
 * @param fields
 * @param simpleModel
 */
function getActionSpanEx(fields: React.ReactNode[], rows: number, simpleModel: boolean) {
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

function getActionLabelEx(fields: React.ReactNode[], rows: number, simpleModel: boolean) {
  return getVisibleCountEx(fields, rows, simpleModel) % 3 === 0 ? null : '\u00A0';
}
function getActionStyleEx(fields: React.ReactNode[], rows: number, simpleModel: boolean) {
  return getVisibleCountEx(fields, rows, simpleModel) % 3 === 0 ? {} : { marginTop: 11 };
}
function handleConditionEx(model: boolean, resetFields: Function, advancedKeys: Array<String>) {
  if (model) {
    resetFields(advancedKeys);
  }
}

export interface WrapperProps {
  dispatch: Function;
  state: any;
  children?: React.ReactNode[];
  needReset?: boolean;
  needMore?: boolean;
  rows?: number;
}

export default function FormWrapper(props: WrapperProps & FormComponentProps) {
  const { form, dispatch, state, children, needReset, needMore, rows } = props;
  const { resetFields } = form;
  const [simpleModel, setModel] = useState(state.status && state.status.simpleModel);

  const advancedKeys = Array<string>();
  const getFields = () =>
    compact(
      React.Children.map(children, (child: any, i) => {
        // 如果是精简模式，且渲染个数超过两个，就不再渲染
        if (i >= rows! * 3) {
          try {
            advancedKeys.push(child.props.children.props.id);
          } catch (e) {
            console.error(
              'FormItem获取ID的key路径上存在空指针，获取ID失败，请检查JSX结构是否符合要求'
            );
          }
          if (simpleModel) {
            return null;
          }
        }
        return <Col span={8}>{child}</Col>;
      })
    );

  const clearFilter = filter =>
    mapValues(filter, val => {
      return { ...val, value: null };
    });

  const reset = useCallback(() => {
    resetFields();
    historyHelper.setState({
      filters: clearFilter(state.filters),
    });
  }, [resetFields]);

  const getCurrentFilter = (filters: Object, simpleModel: boolean, advancedKeys: string[]) =>
    mapValues(filters, (val, key) => {
      if (!advancedKeys.includes(key) || !simpleModel) {
        return val;
      }
      return { ...val, value: null }; // 清除使用undefined在合并时不会生效
    });

  const switchModal = () => {
    // 处理搜索条件变化
    handleConditionEx(!simpleModel, resetFields, advancedKeys);
    // 存储业务状态redux
    dispatch(actions.storeStatus({ simpleModel: !simpleModel }));
    // 状态持久化
    historyHelper.setState({
      status: { simpleModel: !simpleModel },
      filters: getCurrentFilter(state.filters, !simpleModel, advancedKeys),
    });
    // 变更搜索模式，局部状态
    setModel(!simpleModel);
  };
  return (
    <RootLayout>
      <Form layout="vertical">
        <Row gutter={24}>
          {getFields()}
          <Col
            span={getActionSpanEx(children || [], rows!, simpleModel)}
            style={{ textAlign: 'right' }}
          >
            {needReset || needMore ? (
              <Form.Item
                label={getActionLabelEx(children || [], rows!, simpleModel)}
                style={getActionStyleEx(props.children || [], rows!, simpleModel)}
              >
                {/* 是否需要重置操作 */}
                {needReset ? (
                  <a className="action" onClick={reset} role="button">
                    重置筛选条件
                  </a>
                ) : null}
                {/* 是否需要更多操作 */}
                {needMore && (children || []).length > rows! * 3 ? (
                  <>
                    {/* 分割线 */}
                    {needReset && needMore ? <Divider type="vertical" /> : null}
                    <a className="more-wrapper action" onClick={switchModal} role="button">
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
  needReset: true,
  needMore: true,
  clearModel: ClearModel.MODEL_RETAIN,
  rows: 1,
};
