import React, { useCallback } from 'react';
import Form, { FormComponentProps } from 'antd/lib/form';
import { Row, Col, Input } from 'antd';

const FiltersForm = ({ form }: FormComponentProps) => {
  const { resetFields, getFieldDecorator } = form;

  const reset = useCallback(() => {
    resetFields();
  }, [resetFields]);

  return (
    <Form layout="vertical">
      <Row gutter={24}>
        <Col span={8}>
          <Form.Item label="单位名称">{getFieldDecorator('orgName')(<Input />)}</Form.Item>
        </Col>
        <Col span={16} style={{ textAlign: 'right' }}>
          <Form.Item label="&nbsp;">
            <a className="action" onClick={reset} role="button" tabIndex={0}>
              重置筛选条件
            </a>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default FiltersForm;
