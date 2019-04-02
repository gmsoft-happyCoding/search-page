# search-page

> 搜索类页面的封装实现, 使用 react

[![NPM](https://img.shields.io/npm/v/search-page.svg)](https://www.npmjs.com/package/search-page)

## Install

```bash
yarn add search-page
```

## screenshot

![[example/screenshot.png]](https://raw.githubusercontent.com/gmsoft-happyCoding/search-page/master/example/screenshot.png)

## features

- [x] 自动记住页面状态，刷新或 history.back()，不会丢失页面状态
- [x] 数据请求自动节流，阈值 300ms
- [x] 自动显示 loading 状态， 为了避免闪烁默认 delay 500ms
- [x] 支持高级搜索，展开收起，收起时清除高级搜索部分的限制条件
- [x] 根据配置自动生成 form (目前只支持 input),非input组件或自定义组件使用Wrapper包裹传入即可

## Usage

#### Demo.tsx

```tsx
import React from 'react';
import createSearchPage, { GetDataApi } from 'search-page';
import { stateContainer } from '../utils';
import { demo } from '../constant/namespace';
import FiltersForm from './FiltersForm';
import Content from './Content';

// 数据请求API
const getDataApi: GetDataApi = async (filters, pagination) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const result = await Promise.resolve({ data: { filters, pagination }, total: 100 });
  return result;
};

const SearchPage = createSearchPage({
  filtersDefault: { orgName: 'gmsoft' },
  getDataApi,
  FiltersForm,
});

const Demo = () => (
  <div style={{ padding: 16 }}>
    <SearchPage>{Content}</SearchPage>
  </div>
);

export default Demo;
```

---

#### Content.tsx

```tsx
import React from 'react';
import styled from 'styled-components';

const Wrap = styled.div`
  ...some style;
`;

export default data => <Wrap>{JSON.stringify(data)}</Wrap>;
```

---

#### FiltersForm.tsx

```tsx
/**
 * buildFiltersForm 目前只支持 input 类型
 * 如果搜索条件复杂, 建议你自己手写组件
 */
import React from 'react';
import { Form, Input, Select } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
// import { FormWrapper, WrapperProps, FiltersFormType } from 'search-page';
import { FormWrapper, Fields, buildFiltersForm } from 'search-page';

const fields: Fields = {
  orgName: { type: 'input', label: '单位名称' },
  orgCode: { type: 'input', label: '组织机构代码' },
  orgCode2: { type: 'input', label: '组织机构代码222' },
  orgCode3: { type: 'input', label: '组织机构代码' },
  orgCode4: { type: 'input', label: '组织机构代码' },
};

// build模式
export default buildFiltersForm(
  fields, // 渲染配置
  {
    showKeys: ['orgName', 'orgCode'], // 可选，精简模式下要显示的搜索条件的key,数组,默认渲染前两个
    needReset: false, // 可选，是否需要清空操作
    needMore: true, // 可选，是否需要更多操作，如果为false，将渲染全部搜索条件
  }
);

// 自定义或非input模式
/* const { Option } = Select;

interface Props extends WrapperProps {
  form: WrappedFormUtils;
}

const FiltersForm = (props: Props) => {
  const {
    form: { getFieldDecorator },
  } = props;

  return (
    # 需要把props透传给Wrapper
    # rows配置精简模式下需要显示的搜索条件行数，一行三个，栅格权重8
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

export default FiltersForm; */
```

---

#### 自己手写组件 FiltersForm.tsx 示例

```tsx
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
```

> 详见 https://github.com/gmsoft-happyCoding/search-page/tree/master/example

---

## License

MIT © [angular-moon](https://github.com/angular-moon)
