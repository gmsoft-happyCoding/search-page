import React from 'react';
import createSearchPage, { GetDataApi } from 'search-page';
import FiltersForm from './FiltersForm';
import Content from './Content';

const getDataApi: GetDataApi = async (filters, pagination) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const result = await Promise.resolve({ data: { filters, pagination }, total: 100 });
  return result;
};

const SearchPage = createSearchPage({
  filtersDefault: { orgName: 'gmsoft' },
  getDataApi,
  FiltersForm,
});

const Demo = () => (
  <div style={{ padding: 16 }}>
    <SearchPage>{Content}</SearchPage>
  </div>
);

export default Demo;
