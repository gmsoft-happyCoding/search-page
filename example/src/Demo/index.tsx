import React from 'react';
import createSearchPage, { GetDataApi } from 'search-page';
import { stateContainer } from '../utils';
import { demo } from '../constant/namespace';
import FiltersForm from './FiltersForm';
import Content from './Content';

const getDataApi: GetDataApi = async (filters, pagination) => {
  const result = await Promise.resolve({ data: { filters, pagination }, total: 100 });
  return result;
};

const [model, SearchPage] = createSearchPage({
  namespace: demo,
  filtersDefault: { orgName: 'gmsoft' },
  getDataApi,
  FiltersForm,
});

stateContainer.injectModel(model);

const Demo = () => (
  <div style={{ padding: 16 }}>
    <SearchPage>{Content}</SearchPage>
  </div>
);

export default Demo;
