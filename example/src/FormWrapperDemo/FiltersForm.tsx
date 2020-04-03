import React from 'react';
import { Form, Input, Select, Col } from 'antd';
import { FormWrapper, FiltersFormType } from 'search-page';
import { withRouter, RouteComponentProps } from 'react-router-dom';

const { Option } = Select;
// 包装容器，自定义栅格的时候使用
const { FormItem } = FormWrapper;

const FiltersForm: FiltersFormType<RouteComponentProps<any>> = props => {
  const {
    form: { getFieldDecorator },
  } = props;

  return (
    <FormWrapper
      {...props}
      simpleMode={{ rows: 1 }}
      storeKey="FormWrapperDemo"
      resetRetainFiltersDefaultKeys={['name0']}
    >
      {/* 需要自定义栅格时请使用包装容器 */}
      <FormItem span={8} label="name0">
        {getFieldDecorator('name0')(<Input placeholder="Please input your name" />)}
      </FormItem>
      {/* 包装容器FormItem的栅格属性span默认为8 */}
      <FormItem label="name1">
        {getFieldDecorator('name1')(
          <Select>
            <Option value="1">选项一</Option>
            <Option value="2">选项二</Option>
          </Select>
        )}
      </FormItem>
      {/* 与Antd原有FormItem可以混用，原Form.Item占据默认栅格大小：8 */}
      <Form.Item label="name2">
        {getFieldDecorator('name2')(
          <Select>
            <Option value="1">选项一</Option>
            <Option value="2">选项二</Option>
          </Select>
        )}
      </Form.Item>
      <Form.Item label="name3">
        {getFieldDecorator('name3')(
          <Select>
            <Option value="1">选项一</Option>
            <Option value="2">选项二</Option>
          </Select>
        )}
      </Form.Item>
    </FormWrapper>
  );
};

export default withRouter(FiltersForm);
