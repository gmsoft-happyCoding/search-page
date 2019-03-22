import { mapValues } from 'lodash';
import { Form } from 'antd';

type Field = {
  [key: string]: any;
  value: any;
};

type Fields = {
  [key: string]: Field;
};

function wrap(obj: object) {
  return mapValues(obj, v => ({ value: v }));
}

function unwrap(obj: object) {
  return mapValues(obj, (field: Field) => field.value);
}

const { createFormField } = Form;

function createFields(fields: Fields) {
  return mapValues(fields, field => createFormField(field));
}

export default {
  wrap,
  unwrap,
  createFields,
};
