import React, { useMemo } from 'react';
import ContentWrap from './ContentWrap';
import createFilters from './createFilters';
import Pagination from './Pagination';
import useSearchPage from './useSearchPage';
import { FiltersFormType, GetDataApi, ContentFunction } from './typing';

interface Args {
  filtersDefault?: object;
  getDataApi: GetDataApi;
  FiltersForm: FiltersFormType;
  loadingDelay?: number;
}

interface Props {
  children?: ContentFunction;
}

const createSearchPage = ({
  filtersDefault,
  FiltersForm,
  getDataApi,
  loadingDelay = 500,
}: Args) => {
  const SearchPage: React.FC<Props> = ({ children }) => {
    const [state, dispatch] = useSearchPage(filtersDefault, getDataApi);

    const Filters = useMemo(() => createFilters(FiltersForm), []);

    return (
      <>
        <Filters filters={state.filters} dispatch={dispatch} />
        <ContentWrap data={state.data} loading={state.loading} loadingDelay={loadingDelay}>
          {children}
        </ContentWrap>
        <Pagination pagination={state.pagination} dispatch={dispatch} total={state.total} />
      </>
    );
  };

  return SearchPage;
};

export default createSearchPage;
