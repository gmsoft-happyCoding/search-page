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
- [ ] 根据配置自动生成 form (目前只支持 input)

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
  const result = await Promise.resolve({ data: { filters, pagination }, total: 100 });
  return result;
};

// 创建 model 和 组件
const [model, SearchPage] = createSearchPage({
  namespace: demo,
  filtersDefault: { orgName: 'gmsoft' },
  getDataApi,
  FiltersForm,
});

// 注入model
stateContainer.injectModel(model);

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
import { buildFiltersForm, Fields } from 'search-page';

const fields: Fields = {
  orgName: { type: 'input', label: '单位名称' },
  orgCode: { type: 'input', label: '组织机构代码' },
};

export default buildFiltersForm(fields);
```

> 详见 https://github.com/gmsoft-happyCoding/search-page/tree/master/example

---

## License

MIT © [angular-moon](https://github.com/angular-moon)
