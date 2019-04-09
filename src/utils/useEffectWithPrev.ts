import { useEffect, useState, useCallback } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import isFunction from 'lodash/isFunction';
import isEqual from 'lodash/isEqual';

export default (
  callBack: (prevListens: any[], listens: any[]) => void | Function,
  listens,
  useEqual?: boolean
) => {
  const [prevListens, setPrevListens] = useState(cloneDeep(listens));
  const doChange = useCallback(() => {
    const returnCb = callBack(prevListens, listens);
    setPrevListens(listens);
    if (returnCb && isFunction(returnCb)) {
      returnCb();
    }
  }, [setPrevListens, callBack, prevListens, listens]);
  useEffect(() => {
    if (useEqual === true) {
      if (!isEqual(prevListens, listens)) {
        doChange();
      }
    } else {
      doChange();
    }
  }, [...listens, useEqual]);
};
