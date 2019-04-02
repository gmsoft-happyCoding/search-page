/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/interactive-supports-focus */
import React, { useCallback, useState } from 'react';
import { Form, Row, Col, Input, Icon, Divider } from 'antd';
import styled from 'styled-components';
import { map, compact, filter } from 'lodash';
import { FormComponentProps } from 'antd/lib/form';
import { Fields, FieldConfig, ClearModel } from './typing';
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

function getActionSpan(fields: Fields, showKeys: Array<string>, simpleModel: boolean) {
  const fieldsLength = filter(
    Object.keys(fields),
    key => (simpleModel && showKeys.includes(key)) || !simpleModel
  ).length;
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
 * 获取当前模式、配置下可视的搜索项有多少个
 * @param fields
 * @param showKeys
 * @param simpleModel
 */
function getVisibleCount(fields: Fields, showKeys: Array<string>, simpleModel: boolean) {
  return filter(Object.keys(fields), key => (simpleModel && showKeys.includes(key)) || !simpleModel)
    .length;
}

/**
 * 获取操作区在当前模式下，label渲染样式
 * @param fields
 * @param showKeys
 * @param simpleModel
 */
function getActionLabel(fields: Fields, showKeys: Array<string>, simpleModel: boolean) {
  return getVisibleCount(fields, showKeys, simpleModel) % 3 === 0 ? null : '\u00A0';
}

function getInVisibleKeys(fields: Fields, showKeys: Array<string>) {
  return Object.keys(fields).filter(item => !showKeys.includes(item));
}

/**
 * 获取操作区在当前模式下的差异化渲染样式
 * @param fields
 * @param showKeys
 * @param simpleModel
 */
function getActionStyle(fields: Fields, showKeys: Array<string>, simpleModel: boolean) {
  return getVisibleCount(fields, showKeys, simpleModel) % 3 === 0 ? {} : { verticalAlign: -11 };
}

function handleCondition(
  model: boolean,
  resetFields: Function,
  fields: Fields,
  showKeys: Array<string>,
  clearModel: ClearModel
) {
  if (model) {
    switch (clearModel) {
      case ClearModel.MODEL_CLEAR_ALL:
        resetFields();
        break;
      case ClearModel.MODEL_RETAIN:
      default:
        resetFields(getInVisibleKeys(fields, showKeys));
    }
  }
}

interface Props {
  dispatch: Function;
  state: any;
  children: React.ReactNode;
  needReset?: boolean;
  needMore?: boolean;
  clearModel?: ClearModel;
}

/**
 * 渲染搜索Form表单
 * @param fields
 * @param showKeys
 * @param needReset
 * @param needMore
 */
function buildFiltersForm(
  fields: Fields,
  {
    showKeys = [],
    needReset = true,
    needMore = true,
    clearModel = ClearModel.MODEL_RETAIN,
  }: {
    showKeys?: Array<string>;
    needReset?: boolean;
    needMore?: boolean;
    clearModel?: ClearModel;
  }
) {
  return (props: Props & FormComponentProps) => {
    const { form, dispatch, state } = props;
    const { resetFields, getFieldDecorator } = form;
    const [simpleModel, setModel] = useState(state.status && state.status.simpleModel);

    // 如果不指定精简模式下显示的搜索字段则默认显示前两个搜索条件
    if (showKeys.length === 0) {
      Object.keys(fields)
        .slice(0, 3)
        .map(key => showKeys.push(key));
    }

    const reset = useCallback(() => {
      resetFields();
    }, [resetFields]);

    const switchModal = () => {
      // 处理搜索条件变化
      handleCondition(!simpleModel, resetFields, fields, showKeys, clearModel);
      dispatch(actions.storeStatus({ simpleModel: !simpleModel }));
      historyHelper.merageState(state, { status: { simpleModel: !simpleModel } });
      setModel(!simpleModel);
    };

    const getFields = () =>
      compact(
        map(fields, (config: FieldConfig, key: string) => {
          // 判断模式，精简模式根据showIndex进行渲染，高级模式下渲染全部搜索条件
          if ((simpleModel && showKeys.includes(key)) || !simpleModel || !needMore) {
            return (
              <Col span={8} key={key}>
                <Form.Item label={config.label}>
                  {getFieldDecorator(key)(<Input placeholder={config.placeholder} />)}
                </Form.Item>
              </Col>
            );
          }
          return null;
        })
      );

    return (
      <RootLayout>
        <Form layout="vertical">
          <Row gutter={24}>
            {getFields()}
            <Col span={getActionSpan(fields, showKeys, simpleModel)} style={{ textAlign: 'right' }}>
              {needReset || needMore ? (
                <Form.Item label={getActionLabel(fields, showKeys, simpleModel)}>
                  {/* 是否需要重置操作 */}
                  {needReset ? (
                    <a
                      className="action"
                      onClick={reset}
                      role="button"
                      style={getActionStyle(fields, showKeys, simpleModel)}
                    >
                      重置筛选条件
                    </a>
                  ) : null}
                  {/* 分割线 */}
                  {needReset && needMore ? (
                    <Divider type="vertical" style={{ verticalAlign: -13 }} />
                  ) : null}
                  {/* 是否需要更多操作 */}
                  {needMore ? (
                    <a
                      className="more-wrapper action"
                      onClick={switchModal}
                      role="button"
                      style={getActionStyle(fields, showKeys, simpleModel)}
                    >
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
                  ) : null}
                </Form.Item>
              ) : null}
            </Col>
          </Row>
        </Form>
      </RootLayout>
    );
  };
}

export default buildFiltersForm;
