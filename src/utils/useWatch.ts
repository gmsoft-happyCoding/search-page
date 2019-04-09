import { useEffect, useState, useCallback } from 'react';
import { isEqual, isFunction } from 'lodash';

export default (
  values: any,
  listener: (prevValues: any, values: any) => void | Function,
  notFireFirst?: boolean // 第一次初始化 prevValues 和 values 相等时不触发 listener
) => {
  const [prevValues, setPrevValues] = useState(values);
  const notifyChange = useCallback(() => {
    const callback = listener(prevValues, values);
    setPrevValues(values);
    if (callback && isFunction(callback)) {
      callback();
    }
  }, [setPrevValues, listener, prevValues, values]);
  useEffect(() => {
    if (notFireFirst === true) {
      if (!isEqual(prevValues, values)) {
        notifyChange();
      }
    } else {
      notifyChange();
    }
  }, [...values, notFireFirst]);
};
