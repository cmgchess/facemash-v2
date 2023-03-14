import { useEffect, useRef } from 'react';

const useKeyUp = (key, cb) => {
  const callbackRef = useRef(cb);
  useEffect(() => {
    callbackRef.current = cb;
  });
  useEffect(() => {
    const handle = (event) => {
      if (event.code === key) callbackRef.current(event);
    }
    document.addEventListener('keyup', handle);
    return () => document.removeEventListener('keyup', handle);
  }, [key]);
}

export default useKeyUp;