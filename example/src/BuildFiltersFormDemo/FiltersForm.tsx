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

// build模式
export default buildFiltersForm(
  fields, // 渲染配置
  {
    needReset: true, // 可选，是否需要清空操作
    simpleMode: {
      rows: 1,
    },
  }
);
