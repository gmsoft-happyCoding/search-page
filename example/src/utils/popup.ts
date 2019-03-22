import { notification } from 'antd';

export const error = message => {
  notification.error({
    message: '错误',
    description: message,
  });
};

export const success = message => {
  notification.success({
    message: '成功',
    description: message,
  });
};
