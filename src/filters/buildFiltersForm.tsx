import React, { useCallback } from 'react';
import { Form, Input } from 'antd';
import { map } from 'lodash';
import { Fields, FieldConfig, FiltersFormType } from '../typing';
import FormWapper, { SimpleMode } from './FormWapper';

type Options = {
  /**
   * 是否需要重置按钮
   */
  needReset?: boolean;
  /**
   * 是否需要更多按钮
   */
  simpleMode?: Partial<SimpleMode>;
  /**
   * 存储在history.state中key, 如果同一个页面有多个SearchPage, 需要避免重复时请指定
   */
  storeKey?: string;
  /**
   * 存储数据使用的history对象, 默认为 top.history
   */
  storeHistory?: History;
};

export default (
  fields: Fields,
  options: Options = {
    needReset: true,
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
