import createSearchPage from './createSearchPage';
import buildFiltersForm from './filters/buildFiltersForm';
import FormWrapper from './filters/FormWapper';
import FiliterMode from './enums/FilterMode';
import SearchMode from './enums/SearchMode';
import { NO_DATA } from './useSearchPage/defaultState';

export * from './typing';
/**
 * 导出命名为Mode, 为了不产生破坏性更新
 */
export { buildFiltersForm, FormWrapper, FiliterMode as Mode, SearchMode, NO_DATA };
export default createSearchPage;
