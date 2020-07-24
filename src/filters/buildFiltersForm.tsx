/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useCallback } from 'react';
import { Form, Input } from 'antd';
import { map } from 'lodash';
import { Fields, FieldConfig, FiltersFormType } from '../typing';
import FormWapper, { WrapperProps } from './FormWapper';

type Options = Omit<
  WrapperProps,
  | 'filters'
  | 'dispatch'
  | 'mode'
  | 'filtersDefault'
  | 'storeKey'
  | 'storeHistory'
  | 'searchMode'
  | 'forceUpdate'
  | 'loadingCount'
  | 'children'
>;

export default (fields: Fields, options: Options) => {
  const FiltersForm: FiltersFormType = props => {
    const {
      form: { getFieldDecorator },
    } = props;

    const getFields = useCallback(
      () =>
        map(fields, (config: FieldConfig, key: string) => (
          <Form.Item label={config.label} key={key}>
            {getFieldDecorator(key)(<Input placeholder={config.placeholder} />)}
          </Form.Item>
        )),
      [getFieldDecorator]
    );

    return (
      <FormWapper {...options} {...props}>
        {getFields()}
      </FormWapper>
    );
  };

  return FiltersForm;
};
