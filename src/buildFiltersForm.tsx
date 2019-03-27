/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/interactive-supports-focus */
import React, { useCallback } from 'react';
import { Form, Row, Col, Input } from 'antd';
import { map } from 'lodash';
import { FormComponentProps } from 'antd/lib/form';
import { Fields, FieldConfig } from './typing';

function getActionSpan(fields: Fields) {
  const fieldsLength = Object.keys(fields).length;
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

function getActionLabel(fields: Fields) {
  return Object.keys(fields).length % 3 === 0 ? null : '\u00A0';
}

function getActionStyle(fields: Fields) {
  return Object.keys(fields).length % 3 === 0 ? {} : { verticalAlign: -11 };
}

export default (fields: Fields, needReset: boolean = true) => ({ form }: FormComponentProps) => {
  const { resetFields, getFieldDecorator } = form;

  const reset = useCallback(() => {
    resetFields();
  }, [resetFields]);

  const getFields = useCallback(
    () =>
      map(fields, (config: FieldConfig, key: string) => (
        <Col span={8} key={key}>
          <Form.Item label={config.label}>
            {getFieldDecorator(key)(<Input placeholder={config.placeholder} />)}
          </Form.Item>
        </Col>
      )),
    [getFieldDecorator]
  );

  return (
    <Form layout="vertical">
      <Row gutter={24}>
        {getFields()}
        <Col span={getActionSpan(fields)} style={{ textAlign: 'right' }}>
          {needReset ? (
            <Form.Item label={getActionLabel(fields)}>
              <a className="action" onClick={reset} role="button" style={getActionStyle(fields)}>
                重置筛选条件
              </a>
            </Form.Item>
          ) : null}
        </Col>
      </Row>
    </Form>
  );
};
