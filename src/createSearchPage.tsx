import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Model } from 'dva';
import createContentWrap from './createContentWrap';
import createFilters from './createFilters';
import createPagination from './createPagination';
import createModel from './models/createModel';
import { FiltersForm, GetDataApi, ContentFunction } from './typing';

interface Args {
  namespace: string;
  filtersDefault?: object;
  getDataApi: GetDataApi;
  FiltersForm: FiltersForm;
  loadingDelay?: number;
}

interface OwnProps {
  children?: ContentFunction;
}

interface DispatchProps {
  dispatch: Dispatch<any>;
}

type Props = OwnProps & DispatchProps;

const createSearchPage = ({
  namespace,
  filtersDefault,
  getDataApi,
  FiltersForm,
  loadingDelay = 500,
}: Args) => {
  const [model, actions] = createModel(namespace, filtersDefault, getDataApi);

  const SearchPage: React.SFC<Props> = ({ children, dispatch }) => {
    useEffect(() => {
      // @ts-ignore
      dispatch(actions[namespace].init());
    }, [actions, dispatch, namespace]);

    const Filters = createFilters({ namespace, FiltersForm, actions });
    const ContentWrap = createContentWrap({ namespace, loadingDelay });
    const Pagination = createPagination({ namespace, actions });

    return (
      <>
        <Filters />
        <ContentWrap>{children}</ContentWrap>
        <Pagination />
      </>
    );
  };

  const connectdSearchPage = connect()(SearchPage);

  return [model, connectdSearchPage] as [Model, React.FunctionComponent<OwnProps>];
};

export default createSearchPage;
