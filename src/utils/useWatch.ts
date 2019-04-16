import { useEffect, useRef } from 'react';

export default (value: any, listener: (prevValue: any, value: any) => void) => {
  const prevRef = useRef();
  useEffect(() => {
    if (prevRef.current && prevRef.current !== value) {
      listener(prevRef.current, value);
    }
    prevRef.current = value;
  }, [value]);
};
