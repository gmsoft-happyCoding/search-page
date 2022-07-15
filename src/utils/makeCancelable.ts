/* eslint-disable prefer-promise-reject-errors */
interface FetchFunctionI {
  (...args: any): Promise<any>;
}

const makeCancelable = (fetch: FetchFunctionI, argsArray: Array<any> = []) => {
  let _hasCanceled = false;
  let _done = false;

  const abortController = new AbortController();

  const wrappedPromise = new Promise((resolve, reject) => {
    fetch
      .apply(null, [...argsArray, abortController.signal])
      .then(
        val => (_hasCanceled ? reject({ isCanceled: true }) : resolve(val)),
        error => (_hasCanceled ? reject({ isCanceled: true }) : reject(error))
      )
      .finally(() => {
        _done = true;
      });
  });

  return {
    promise: wrappedPromise,
    cancel(callback: Function) {
      if (!_done && !_hasCanceled) {
        _hasCanceled = true;
        abortController.abort();
        if (callback) callback();
      }
    },
  };
};
export default makeCancelable;
