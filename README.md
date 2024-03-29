<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [search-page](#search-page)
  - [Install](#install)
  - [Sreenshot](#sreenshot)
  - [Features](#features)
  - [Usage](#usage)
    - [一般性场景（简单使用）](#一般性场景简单使用)
      - [FiltersForm.tsx (使用 FormWrapper)](#filtersformtsx-使用-formwrapper)
      - [HandwrittenFormDemo.tsx (完全自己手写)](#handwrittenformdemotsx-完全自己手写)
    - [配置用户侧自定义表头列宽度（Content.tsx）](#配置用户侧自定义表头列宽度contenttsx)
    - [关于聚焦刷新](#关于聚焦刷新)
      - [典型场景](#典型场景)
    - [支持手动触发模式](#支持手动触发模式)
    - [如果同一个页面有多个 SearchPage 实例](#如果同一个页面有多个-searchpage-实例)
    - [支持指定存储数据使用的 history 对象](#支持指定存储数据使用的-history-对象)
    - [forceUpdate 支持传递参数 `forceUpdateArgs`](#forceupdate-支持传递参数-forceupdateargs)
    - [如果需要定制化筛选条件, 请设置 FromWraper props -> defaultCustomFiltersConf](#如果需要定制化筛选条件-请设置-fromwraper-props---defaultcustomfiltersconf)
    - [支持响应式布局, 请设置 FromWraper props -> theme, 或使用 FromWraper.FormItem props -> colProps](#支持响应式布局-请设置-fromwraper-props---theme-或使用-fromwraperformitem-props---colprops)
  - [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# search-page

> 搜索类页面的封装实现, 使用 react

[![NPM](https://img.shields.io/npm/v/search-page.svg)](https://www.npmjs.com/package/search-page)

## Install

```bash
yarn add search-page
```

## Sreenshot

![[example/screenshot.png]](https://raw.githubusercontent.com/gmsoft-happyCoding/search-page/master/example/screenshot.png)

## Features

- [x] 自动记住页面状态，刷新或 history.back()，不会丢失页面状态
- [x] 数据请求自动节流，阈值 500ms
- [x] 自动显示 loading 状态， 为了避免闪烁默认 delay 500ms
- [x] 支持高级搜索，展开收起，收起时重置高级搜索部分的条件为默认值(filtersDefault)
- [x] 根据配置自动生成 form (目前只支持 input),非 input 组件或自定义组件使用 [FormWrapper](<#FiltersForm.tsx-(使用-FormWrapper)>)
- [x] 支持用户自定义筛选条件
- [x] 支持手动触发搜索
- [x] 支持响应式布局(default: { lg: 6, md: 8, sm: 12, xs: 24 })
- [x] 支持同一页面显示多个实例, 请传递不同的 storeKey
- [x] 如果不想"记住"状态, 请传递 noStore = true
- [x] 支持用户侧表头自定义宽度（不支持百分比设置，react-resizable 的属性缺陷，可以持续关注）
- [x] 加入聚焦自动刷新，页面数据能在页签聚焦时自动刷新

---

## Usage

### 一般性场景（简单使用）

<details>
  <summary>Demo.tsx</summary>
  <pre>
  import React, { useRef, useCallback } from &#x27;react&#x27;;
  import createSearchPage, { GetDataApi } from &#x27;search-page&#x27;;
  import { Button } from &#x27;antd&#x27;;
  import FiltersForm from &#x27;./FiltersForm&#x27;;
  import Content from &#x27;./Content&#x27;;

const getDataApi: GetDataApi = async (filters, pagination) =&gt; {
await new Promise(resolve =&gt; setTimeout(resolve, 1000));
const result = await Promise.resolve({ data: { filters, pagination }, total: 100 });
return result;
};

const SearchPage = createSearchPage({
filtersDefault: { orgName: &#x27;gmsoft&#x27; },
pageSize: 40,
noPagination: false,
getDataApi,
FiltersForm,
});

const Demo = () =&gt; {
const searchPageRef = useRef({ forceUpdate: () =&gt; undefined });
const forceUpdate = useCallback(() =&gt; {
searchPageRef.current.forceUpdate();
}, []);
return (
&lt;div style={{ padding: 16 }}&gt;
&lt;SearchPage ref={searchPageRef}&gt;{Content}&lt;/SearchPage&gt;
&lt;Button onClick={forceUpdate}&gt;强制刷新&lt;/Button&gt;
&lt;/div&gt;
);
};

export default Demo;

  </pre>
</details>
<details>
<summary>Content.tsx</summary>
<pre>
import React from &#x27;react&#x27;;
import styled from &#x27;styled-components&#x27;;
import { ContentProps } from &#x27;search-page&#x27;;

const Wrap = styled.div&#x60;
padding: 16px;
border: 2px solid purple;
background-color: #8000802e;
color: purple;
&#x60;;

const Content = ({ data, forceUpdate, loading, filters }: ContentProps) =&gt; (
&lt;Wrap&gt;
data: {JSON.stringify(data)}
&lt;br /&gt;
filters: {JSON.stringify(filters)}
&lt;a style={{ float: &#x27;right&#x27; }} onClick={forceUpdate}&gt;
强制刷新
&lt;/a&gt;
&lt;/Wrap&gt;
);
export default Content;

</pre>
</details>

</details>
<details>
<summary>FiltersForm.tsx (使用 buildFiltersForm)</summary>
<pre>
/**
 * buildFiltersForm 目前只支持 input 类型
 * 如果搜索条件复杂, 请使用FormWrapper
 */
import { buildFiltersForm, Fields } from &#x27;search-page&#x27;;

const fields: Fields = {
orgName: { type: &#x27;input&#x27;, label: &#x27;单位名称&#x27; },
orgCode1: { type: &#x27;input&#x27;, label: &#x27;组织机构代码 1&#x27; },
orgCode2: { type: &#x27;input&#x27;, label: &#x27;组织机构代码 2&#x27; },
orgCode3: { type: &#x27;input&#x27;, label: &#x27;组织机构代码 3&#x27; },
orgCode4: { type: &#x27;input&#x27;, label: &#x27;组织机构代码 4&#x27; },
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

</pre>
</details>

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
      resetRetainFiltersDefaultKeys={[]}
    >
      {/* 需要自定义栅格时请使用包装容器 */}
      <FormItem span={8} label="orgName">
        {getFieldDecorator('orgName')(<Input placeholder="Please input your name" />)}
      </FormItem>
      {/* 可设置为响应式布局 */}
      <FormItem colProps={{ lg: 6, md: 8, sm: 12, xs: 24 }} label="name1">
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

### 配置用户侧自定义表头列宽度（Content.tsx）

**注意事项：**

1. Table 列配置只能使用 Confs 数组配置模式，不能使用 Jsx 模式
2. 列宽只能指定具体像素，**不能使用百分比**，插件实现问题
3. 列宽数据存储行为与 Filter 条件一致
4. dispatch、tableWidthConfs、storeKey 均为 SearchPage 内部属性，使用时可以直接透传 props 进行简写
5. **最右侧**配置列的 **width 请留空**，不要写

```tsx
import React, { useEffect, useRef, useMemo, useCallback, useState } from 'react';
import styled from 'styled-components';
import { ContentProps, ResizeableTitle, getColumnConfs } from 'search-page';
import { Table, Button } from 'antd';

const Wrap = styled.div`
  padding: 16px;
  border: 2px solid purple;
`;

const components = { header: { cell: ResizeableTitle } };

export default ({ data, forceUpdate, dispatch, tableWidthConfs, storeKey }: ContentProps) => {
  const tableRef = useRef<any>();
  const [columnConfs, setColumnConfs] = useState([
    {
      title: 'id',
      key: 'id',
      dataIndex: 'id',
      width: 100,
    },
    {
      // 所有配置列中，请保持有一个配置列的width不配置，否则会导致拖动自适应出现问题
      title: 'operate',
      key: 'operate',
      dataIndex: 'operate',
    },
  ]);

  const renderColumnsConf = useMemo(
    () =>
      getColumnConfs({
        columnConfs,
        setConfs: setColumnConfs,
        dispatch,
        tableWidthConfs,
        storeKey,
      }),
    [columnConfs, dispatch, storeKey, tableWidthConfs]
  );

  return (
    <Wrap>
      <Table
        ref={tableRef}
        rowKey="id"
        dataSource={data.data}
        columns={renderColumnsConf}
        pagination={false}
        components={components}
        size="small"
      />
      {JSON.stringify(data)}
      <Button style={{ float: 'right' }} type="link" onClick={forceUpdate}>
        强制刷新
      </Button>
    </Wrap>
  );
};
```

---

### 关于聚焦刷新

请在 createSearchPage 中指定 [autoRefresh] 即可，配置如下：

```ts
export interface RefreshOpt {
  /** 只要没有显示传递false，都默认true */
  enable?: boolean;
  /** 切换刷新的间隔时间，间隔时间内切换页签不会进行刷新 */
  interval?: number;
}
```

#### 典型场景

```js
// 页签聚焦自动刷新列表数据（此功能默认启用，默认自动请求间隔时间3000，间隔时间内重复聚焦不会再次触发刷新）
autoRefresh: { interval: 5000 },
// 关闭聚焦自动刷新（如果需要关闭则显示配置为false即可）
autoRefresh: { enable: false },
```

### 支持手动触发模式

```
请在 createSearchPage 中指定 [searchMode]
```

### 如果同一个页面有多个 SearchPage 实例

```
请在 createSearchPage 中指定 [storeKey]
```

### 支持指定存储数据使用的 history 对象

```
请在 createSearchPage 中指定 [storeHistory]
```

### forceUpdate 支持传递参数 `forceUpdateArgs`

```ts
export interface PaginationI {
  current: number;
  pageSize: number;
}

export interface Filters {
  [key: string]: any;
}

interface ForceUpdateArgs {
  filters?: Filters;
  pagination?: Partial<PaginationI>;
}
```

### 如果需要定制化筛选条件, 请设置 FromWraper props -> defaultCustomFiltersConf

```ts
 /**
   * 定制化筛选条件
   */
  defaultCustomFiltersConf?: {
    /**
     * 定制配置存储在 localStorage 中 key
     */
    storageKey: string;
    /**
     * 禁止定制的项
     */
    notAllowCustomKeys?: string[];
    /**
     * 筛选配置面板label定制
     */
    labels?: { [key: string]: string };
    /**
     * Popover.props.getPopupContainer
     */
    getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
    /**
     * Popover.props.overlayStyle
     * @default { maxWidth: 450 }
     */
    popoverOverlayStyle?: CSSProperties;
  };
```

### 支持响应式布局, 请设置 FromWraper props -> theme, 或使用 FromWraper.FormItem props -> colProps

```
export interface ThemeI {
  rowProps?: RowProps;
  colProps?: ColProps;
}
```

> 详见 https://github.com/gmsoft-happyCoding/search-page/tree/master/example

> 如果你使用了 FromWraper.FormItem, 自定义了每个元素的栅格所占宽度,
> 请不要使用 simpleMode.rows(直接使用 simpleMode.count) 设置默认显示的元素数量,
> 因为这可能会导致默认显示的元素数量的计算错误

---

## License

MIT © [angular-moon](https://github.com/angular-moon)
