import React from 'react';
import { Form, Input, Select } from 'antd';
import { FormWrapper, FiltersFormType } from 'search-page';
import { withRouter, RouteComponentProps } from 'react-router-dom';

const { Option } = Select;
// 包装容器，自定义栅格的时候使用
const { FormItem } = FormWrapper;

const FiltersForm: FiltersFormType<RouteComponentProps<any>> = props => {
  const {
    form: { getFieldDecorator, getFieldValue },
  } = props;
  const name2 = getFieldValue('name2');

  return (
    <FormWrapper
      {...props}
      simpleMode={{ rows: 1 }}
      defaultCustomFiltersConf={{
        storageKey: 'FormWrapperDemo',
        notAllowCustomKeys: ['orgName'],
        labels: { orgName: '组织架构名称' },
      }}
      resetRetainFiltersDefaultKeys={[]}
    >
      {/* 需要自定义栅格时请使用包装容器 */}
      <FormItem span={8} label="orgName">
        {getFieldDecorator('orgName')(<Input placeholder="Please input your name" />)}
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
      {name2 === '1' && (
        <Form.Item label="name3">
          {getFieldDecorator('name3')(
            <Select>
              <Option value="1">选项一</Option>
              <Option value="2">选项二</Option>
            </Select>
          )}
        </Form.Item>
      )}
      <Form.Item label="name4">
        {getFieldDecorator('name4')(
          <Select>
            <Option value="1">选项一</Option>
            <Option value="2">选项二</Option>
          </Select>
        )}
      </Form.Item>
      <Form.Item label="name5">
        {getFieldDecorator('name5')(
          <Select>
            <Option value="1">选项一</Option>
            <Option value="2">选项二</Option>
          </Select>
        )}
      </Form.Item>
      <Form.Item label="name6">
        {getFieldDecorator('name6')(
          <Select>
            <Option value="1">选项一</Option>
            <Option value="2">选项二</Option>
          </Select>
        )}
      </Form.Item>
      <Form.Item label="name7">
        {getFieldDecorator('name7')(
          <Select>
            <Option value="1">选项一</Option>
            <Option value="2">选项二</Option>
          </Select>
        )}
      </Form.Item>
      <Form.Item label="name8">
        {getFieldDecorator('name8')(
          <Select>
            <Option value="1">选项一</Option>
            <Option value="2">选项二</Option>
          </Select>
        )}
      </Form.Item>
      <Form.Item label="name9">
        {getFieldDecorator('name9')(
          <Select>
            <Option value="1">选项一</Option>
            <Option value="2">选项二</Option>
          </Select>
        )}
      </Form.Item>
      <Form.Item label="name10">
        {getFieldDecorator('name10')(
          <Select>
            <Option value="1">选项一</Option>
            <Option value="2">选项二</Option>
          </Select>
        )}
      </Form.Item>
      <Form.Item label="name11">
        {getFieldDecorator('name11')(
          <Select>
            <Option value="1">选项一</Option>
            <Option value="2">选项二</Option>
          </Select>
        )}
      </Form.Item>
      <Form.Item label="name12">
        {getFieldDecorator('name12')(
          <Select>
            <Option value="1">选项一</Option>
            <Option value="2">选项二</Option>
          </Select>
        )}
      </Form.Item>
      <Form.Item label="name13">
        {getFieldDecorator('name13')(
          <Select>
            <Option value="1">选项一</Option>
            <Option value="2">选项二</Option>
          </Select>
        )}
      </Form.Item>
      <Form.Item label="name14">
        {getFieldDecorator('name14')(
          <Select>
            <Option value="1">选项一</Option>
            <Option value="2">选项二</Option>
          </Select>
        )}
      </Form.Item>
      <Form.Item label="name15">
        {getFieldDecorator('name15')(
          <Select>
            <Option value="1">选项一</Option>
            <Option value="2">选项二</Option>
          </Select>
        )}
      </Form.Item>
      <Form.Item label="name16">
        {getFieldDecorator('name16')(
          <Select>
            <Option value="1">选项一</Option>
            <Option value="2">选项二</Option>
          </Select>
        )}
      </Form.Item>
      <Form.Item label="name17">
        {getFieldDecorator('name17')(
          <Select>
            <Option value="1">选项一</Option>
            <Option value="2">选项二</Option>
          </Select>
        )}
      </Form.Item>
      <Form.Item label="name18">
        {getFieldDecorator('name18')(
          <Select>
            <Option value="1">选项一</Option>
            <Option value="2">选项二</Option>
          </Select>
        )}
      </Form.Item>
      <Form.Item label="name19">
        {getFieldDecorator('name19')(
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
