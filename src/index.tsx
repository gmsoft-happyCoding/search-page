import createSearchPage from './createSearchPage';
import buildFiltersForm from './filters/buildFiltersForm';
import FormWrapper from './filters/FormWrapper';
import FilterMode from './enums/FilterMode';
import SearchMode from './enums/SearchMode';
import { NO_DATA } from './useSearchPage/defaultState';
import ResizeableTitle, { getColumnConfs } from './components/ResizeableTitle';

export * from './typing';
/**
 * 导出命名为Mode, 为了不产生破坏性更新
 */
export {
  buildFiltersForm,
  FormWrapper,
  FilterMode as Mode,
  SearchMode,
  NO_DATA,
  ResizeableTitle,
  getColumnConfs,
};
export default createSearchPage;
