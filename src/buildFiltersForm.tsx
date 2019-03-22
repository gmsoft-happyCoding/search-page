import React, { useCallback } from 'react';
import { Form, Row, Col, Input } from 'antd';
import { map } from 'lodash';
import { FormComponentProps } from 'antd/lib/form';

export interface FieldConfig {
  /**
   * 第一版简单实现, 只支持 input
   * 复杂的表单还是自己写吧
   */
  type: 'input';
  label: string;
  placeholder?: string;
}

export interface Fields {
  [key: string]: FieldConfig;
}

export default (fields: Fields) => ({ form }: FormComponentProps) => {
  const { resetFields, getFieldDecorator } = form;

  const reset = useCallback(() => {
    resetFields();
  }, [resetFields]);

  const getFields = useCallback(
    () =>
      map(fields, (config, key) => (
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
