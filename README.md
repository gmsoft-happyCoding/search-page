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
- [x] 支持高级搜索，展开收起，收起时重置高级搜索部分的条件为默认值(filtersDefault)
- [x] 根据配置自动生成 form (目前只支持 input),非 input 组件或自定义组件使用 [FormWrapper](<#FiltersForm.tsx-(使用-FormWrapper)>)

---

## Usage

#### Demo.tsx

```tsx
import React, { useRef, useCallback } from 'react';
import createSearchPage, { GetDataApi } from 'search-page';
import { Button } from 'antd';
import FiltersForm from './FiltersForm';
import Content from './Content';

const getDataApi: GetDataApi = async (filters, pagination) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const result = await Promise.resolve({ data: { filters, pagination }, total: 100 });
  return result;
};

const SearchPage = createSearchPage({
  filtersDefault: { orgName: 'gmsoft' },
  pageSize: 40,
  noPagination: false,
  getDataApi,
  FiltersForm,
});

const Demo = () => {
  const searchPageRef = useRef({ forceUpdate: () => undefined });
  const forceUpdate = useCallback(() => {
    searchPageRef.current.forceUpdate();
  }, []);
  return (
    <div style={{ padding: 16 }}>
      <SearchPage ref={searchPageRef}>{Content}</SearchPage>
      <Button onClick={forceUpdate}>强制刷新</Button>
    </div>
  );
};

export default Demo;
```

---

#### Content.tsx

```tsx
import React from 'react';
import styled from 'styled-components';
import { ContentProps } from 'search-page';

const Wrap = styled.div`
  padding: 16px;
  border: 2px solid purple;
  background-color: #8000802e;
  color: purple;
`;

const Content = ({ data, forceUpdate, loading, filters }: ContentProps) => (
  <Wrap>
    data: {JSON.stringify(data)}
    <br />
    filters: {JSON.stringify(filters)}
    <a style={{ float: 'right' }} onClick={forceUpdate}>
      强制刷新
    </a>
  </Wrap>
);

export default Content;
```

---

#### FiltersForm.tsx (使用 buildFiltersForm)

```tsx
/**
 * buildFiltersForm 目前只支持 input 类型
 * 如果搜索条件复杂, 请使用FormWrapper
 */
import { buildFiltersForm, Fields } from 'search-page';

const fields: Fields = {
  orgName: { type: 'input', label: '单位名称' },
  orgCode1: { type: 'input', label: '组织机构代码1' },
  orgCode2: { type: 'input', label: '组织机构代码2' },
  orgCode3: { type: 'input', label: '组织机构代码3' },
  orgCode4: { type: 'input', label: '组织机构代码4' },
};

export default buildFiltersForm(fields, {
  // 可选，是否需要重置操作
  needReset: true,
  // 精简模式配置
  simpleMode: {
    enable: true,
    count: 2,
    // count 优先级高于 rows
    // row: 1
  },
});
```

---

#### FiltersForm.tsx (使用 FormWrapper)

```tsx
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
```

---

#### HandwrittenFormDemo.tsx (完全自己手写)

```tsx
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
            <a className="action" onClick={reset} role="button">
              重置筛选条件
            </a>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default FiltersForm;
```

---

#### 如果同一个页面有多个 SearchPage

```
  请在以下方法或组件调用中指定 [storeKey]

  createSearchPage

  buildFiltersForm
  or
  FormWapper
```

#### 支持指定存储数据使用的 history 对象

```
  请在以下方法或组件调用中指定 [storeHistory]

  createSearchPage

  buildFiltersForm
  or
  FormWapper
```

#### forceUpdate 支持传递参数 `forceUpdateArgs`

```ts
export interface PaginationI {
  current: number;
  pageSize: number;
}

export interface Filters {
  [key: string]: any;
}

interface forceUpdateArgs {
  filters?: Filters;
  pagination?: Partial<PaginationI>;
}
```

> 详见 https://github.com/gmsoft-happyCoding/search-page/tree/master/example

---

## License

MIT © [angular-moon](https://github.com/angular-moon)
