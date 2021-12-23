/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useCallback } from 'react';
import { Form, Input } from 'antd';
import { map } from 'lodash';
import { Fields, FieldConfig, FiltersFormType } from '../typing';
import FormWrapper, { WrapperProps } from './FormWrapper';

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
      <FormWrapper {...options} {...props}>
        {getFields()}
      </FormWrapper>
    );
  };

  return FiltersForm;
};
