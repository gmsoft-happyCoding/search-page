/**
 * buildFiltersForm 目前只支持 input 类型
 * 如果搜索条件复杂, 建议你自己手写组件
 */
import React from 'react';
import { Form, Input, Select } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { FormWrapper, WrapperProps } from 'search-page';
// import { FormWrapper, Fields, buildFiltersForm } from 'search-page';

// const fields: Fields = {
//   orgName: { type: 'input', label: '单位名称' },
//   orgCode: { type: 'input', label: '组织机构代码' },
//   orgCode2: { type: 'input', label: '组织机构代码222' },
//   orgCode3: { type: 'input', label: '组织机构代码' },
//   orgCode4: { type: 'input', label: '组织机构代码' },
// };

// build模式
// export default buildFiltersForm({
//   fields,    //渲染配置
//   showKeys,  //可选，精简模式下要显示的搜索条件的key,数组,默认渲染前两个
//   needReset, //可选，是否需要清空操作
//   needMore,  //可选，是否需要更多操作，如果为false，将渲染全部搜索条件
// });

// 自定义模式
const { Option } = Select;

interface Props extends FormComponentProps {
  dispatch: Function;
  state: any;
}

const ConditionNode = (props: Props) => {
  const {
    form: { getFieldDecorator },
  } = props;

  return (
    <FormWrapper {...props} rows={1}>
      <Form.Item label="Name0">
        {getFieldDecorator('name0')(<Input placeholder="Please input your name" />)}
      </Form.Item>
      <Form.Item label="Name1">
        {getFieldDecorator('name1')(
          <Select>
            <Option value="1">选项一</Option>
            <Option value="2">选项二</Option>
          </Select>
        )}
      </Form.Item>
      <Form.Item label="Name1">
        {getFieldDecorator('name2')(<Input placeholder="Please input your name" />)}
      </Form.Item>
      <Form.Item label="Name1">
        {getFieldDecorator('name3')(<Input placeholder="Please input your name" />)}
      </Form.Item>
    </FormWrapper>
  );
};

export default ConditionNode;
