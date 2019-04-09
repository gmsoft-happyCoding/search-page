import { useEffect, useState, useCallback } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import isFunction from 'lodash/isFunction';
import isEqual from 'lodash/isEqual';

export default (
  values: any[],
  listener: (prevValues: any[], values: any[]) => void | Function,
  notFireFirst?: boolean // 第一次初始化 prevValues 和 values 相等时不触发 listener
) => {
  const [prevValues, setPrevValues] = useState(cloneDeep(values));
  const doChange = useCallback(() => {
    const returnCb = listener(prevValues, values);
    setPrevValues(values);
    if (returnCb && isFunction(returnCb)) {
      returnCb();
    }
  }, [setPrevValues, listener, prevValues, values]);
  useEffect(() => {
    if (notFireFirst === true) {
      if (!isEqual(prevValues, values)) {
        doChange();
      }
    } else {
      doChange();
    }
  }, [...values, notFireFirst]);
};
