/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/interactive-supports-focus */
import React, { useCallback } from 'react';
import { Form, Row, Col, Input } from 'antd';
import { map } from 'lodash';
import { FormComponentProps } from 'antd/lib/form';
import { Fields, FieldConfig } from './typing';

export default (fields: Fields) => ({ form }: FormComponentProps) => {
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
        <Col span={8} style={{ textAlign: 'right' }}>
          <Form.Item label="&nbsp;">
            <a className="action" onClick={reset} role="button">
              重置筛选条件
            </a>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};
