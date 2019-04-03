import React, { useCallback } from 'react';
import { Form, Input } from 'antd';
import { map } from 'lodash';
import { Fields, FieldConfig, FiltersFormType } from '../typing';
import FormWapper from './FormWapper';

type Options = {
  /**
   * 是否需要重置按钮
   */
  needReset?: boolean;
  /**
   * 是否需要更多按钮
   */
  needMore?: boolean;
  /**
   * 精简模式下显示几行搜索条件
   */
  rows?: number;
};

export default (
  fields: Fields,
  options: Options = {
    needReset: true,
    needMore: true,
  }
) => {
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
