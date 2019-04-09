import React from 'react';
import { Form, Input, Select } from 'antd';
import { FormWrapper, FiltersFormType } from 'search-page';

const { Option } = Select;

const FiltersForm: FiltersFormType = props => {
  const {
    form: { getFieldDecorator, getFieldValue },
  } = props;

  return (
    <FormWrapper {...props} simpleMode={{ rows: 1 }}>
      {getFieldValue('name1') === '2' && (
        <Form.Item label="Name0">
          {getFieldDecorator('name0')(<Input placeholder="Please input your name" />)}
        </Form.Item>
      )}
      <Form.Item label="Name1">
        {getFieldDecorator('name1')(
          <Select>
            <Option value="1">选项一</Option>
            <Option value="2">选项二</Option>
          </Select>
        )}
      </Form.Item>
      <Form.Item label="Name2">
        {getFieldDecorator('name2')(<Input placeholder="Please input your name" />)}
      </Form.Item>
      <Form.Item label="Name3">
        {getFieldDecorator('name3')(<Input placeholder="Please input your name" />)}
      </Form.Item>
    </FormWrapper>
  );
};

export default FiltersForm;
