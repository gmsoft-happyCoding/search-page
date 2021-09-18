import { get } from 'lodash';
import useSWR, { SWRConfiguration } from 'swr';
import { useState, useCallback } from 'react';

type SwrRequestProps = {
  fetcher: (filter, pagenation) => Promise<any>;
  swrOpt?: SWRConfiguration;
  params?: any;
};

export function useSwrRequest({ fetcher, swrOpt = {}, params }: SwrRequestProps) {
  const [forceUpdateKey, setForceUpdateKey] = useState(0);

  const forceUpdate = useCallback(() => setForceUpdateKey(forceUpdateKey + 1), [forceUpdateKey]);

  const { data, error } = useSWR(
    [`/${forceUpdateKey}`, JSON.stringify(params)],
    () => fetcher(get(params, 'filter'), get(params, 'pagination')),
    swrOpt
  );

  return { data, error, forceUpdate };
}
