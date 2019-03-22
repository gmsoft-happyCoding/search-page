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
