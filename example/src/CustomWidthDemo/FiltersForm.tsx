import React from 'react';
import { Input, Select } from 'antd';
import { FormWrapper, FiltersFormType } from 'search-page';
import { withRouter, RouteComponentProps } from 'react-router-dom';

const { Option } = Select;
// 包装容器，自定义栅格的时候使用
const { FormItem } = FormWrapper;

const colProps = { lg: 6, md: 8, sm: 12, xs: 24 };

const FiltersForm: FiltersFormType<RouteComponentProps<any>> = props => {
  const {
    form: { getFieldDecorator, getFieldValue },
  } = props;
  const name2 = getFieldValue('name2');

  return (
    <FormWrapper
      {...props}
      simpleMode={{ count: 2 }}
      defaultCustomFiltersConf={{
        storageKey: 'FormWrapperDemo',
        notAllowCustomKeys: ['orgName'],
        labels: { orgName: '组织架构名称' },
      }}
      resetRetainFiltersDefaultKeys={[]}
      // theme={{ rowProps: { gutter: 16 } }}
    >
      {/* 需要自定义栅格时请使用包装容器 */}
      <FormItem colProps={{ span: 12 }} label="orgName">
        {getFieldDecorator('orgName')(<Input placeholder="Please input your name" />)}
      </FormItem>
      {/* 包装容器FormItem的栅格属性span默认为8 */}
      <FormItem colProps={{ span: 12 }} label="name1">
        {getFieldDecorator('name1')(
          <Select>
            <Option value="1">选项一</Option>
            <Option value="2">选项二</Option>
          </Select>
        )}
      </FormItem>
      {/* 与Antd原有FormItem可以混用，原Form.Item占据默认栅格大小：8 */}
      <FormItem colProps={colProps} label="name2">
        {getFieldDecorator('name2')(
          <Select>
            <Option value="1">选项一</Option>
            <Option value="2">选项二</Option>
          </Select>
        )}
      </FormItem>
      {name2 === '1' && (
        <FormItem colProps={colProps} label="name3">
          {getFieldDecorator('name3')(
            <Select>
              <Option value="1">选项一</Option>
              <Option value="2">选项二</Option>
            </Select>
          )}
        </FormItem>
      )}
      <FormItem colProps={colProps} label="name4">
        {getFieldDecorator('name4')(
          <Select>
            <Option value="1">选项一</Option>
            <Option value="2">选项二</Option>
          </Select>
        )}
      </FormItem>
      <FormItem colProps={colProps} label="name5">
        {getFieldDecorator('name5')(
          <Select>
            <Option value="1">选项一</Option>
            <Option value="2">选项二</Option>
          </Select>
        )}
      </FormItem>
      <FormItem colProps={colProps} label="name6">
        {getFieldDecorator('name6')(
          <Select>
            <Option value="1">选项一</Option>
            <Option value="2">选项二</Option>
          </Select>
        )}
      </FormItem>
      <FormItem colProps={colProps} label="name7">
        {getFieldDecorator('name7')(
          <Select>
            <Option value="1">选项一</Option>
            <Option value="2">选项二</Option>
          </Select>
        )}
      </FormItem>
      <FormItem colProps={colProps} label="name8">
        {getFieldDecorator('name8')(
          <Select>
            <Option value="1">选项一</Option>
            <Option value="2">选项二</Option>
          </Select>
        )}
      </FormItem>
      <FormItem colProps={colProps} label="name9">
        {getFieldDecorator('name9')(
          <Select>
            <Option value="1">选项一</Option>
            <Option value="2">选项二</Option>
          </Select>
        )}
      </FormItem>
      <FormItem colProps={colProps} label="name10">
        {getFieldDecorator('name10')(
          <Select>
            <Option value="1">选项一</Option>
            <Option value="2">选项二</Option>
          </Select>
        )}
      </FormItem>
      <FormItem colProps={colProps} label="name11">
        {getFieldDecorator('name11')(
          <Select>
            <Option value="1">选项一</Option>
            <Option value="2">选项二</Option>
          </Select>
        )}
      </FormItem>
      <FormItem colProps={colProps} label="name12">
        {getFieldDecorator('name12')(
          <Select>
            <Option value="1">选项一</Option>
            <Option value="2">选项二</Option>
          </Select>
        )}
      </FormItem>
      <FormItem colProps={colProps} label="name13">
        {getFieldDecorator('name13')(
          <Select>
            <Option value="1">选项一</Option>
            <Option value="2">选项二</Option>
          </Select>
        )}
      </FormItem>
      <FormItem colProps={colProps} label="name14">
        {getFieldDecorator('name14')(
          <Select>
            <Option value="1">选项一</Option>
            <Option value="2">选项二</Option>
          </Select>
        )}
      </FormItem>
      <FormItem colProps={colProps} label="name15">
        {getFieldDecorator('name15')(
          <Select>
            <Option value="1">选项一</Option>
            <Option value="2">选项二</Option>
          </Select>
        )}
      </FormItem>
      <FormItem colProps={colProps} label="name16">
        {getFieldDecorator('name16')(
          <Select>
            <Option value="1">选项一</Option>
            <Option value="2">选项二</Option>
          </Select>
        )}
      </FormItem>
      <FormItem colProps={colProps} label="name17">
        {getFieldDecorator('name17')(
          <Select>
            <Option value="1">选项一</Option>
            <Option value="2">选项二</Option>
          </Select>
        )}
      </FormItem>
      <FormItem colProps={colProps} label="name18">
        {getFieldDecorator('name18')(
          <Select>
            <Option value="1">选项一</Option>
            <Option value="2">选项二</Option>
          </Select>
        )}
      </FormItem>
      <FormItem colProps={colProps} label="name19">
        {getFieldDecorator('name19')(
          <Select>
            <Option value="1">选项一</Option>
            <Option value="2">选项二</Option>
          </Select>
        )}
      </FormItem>
    </FormWrapper>
  );
};

export default withRouter(FiltersForm);
