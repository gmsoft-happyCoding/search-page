import { get } from 'lodash';
import { useEffect } from 'react';
import { RefreshOpt } from '..';

export function useAutoRefresh(cb: Function, opt: RefreshOpt) {
  useEffect(() => {
    function eventHandle() {
      const lastGetDataUnix = +window.localStorage.getItem('SearchPage:lastGetDataUnix')! || 0;
      if (
        document.visibilityState === 'visible' &&
        +lastGetDataUnix < Date.now() - get(opt, 'interval', 3000) &&
        get(opt, 'enable', true)
      ) {
        window.localStorage.setItem('SearchPage:lastGetDataUnix', Date.now().toString());
        cb();
      }
    }
    window.document.addEventListener('visibilitychange', eventHandle);
    return () => {
      window.document.removeEventListener('visibilitychange', eventHandle);
    };
  }, [cb, opt]);
}
