import { useEffect, useRef, useState } from "react";

export const useAsyncObservable = <T>(
  asyncValue: Promise<T>
): T | undefined => {
  const latestAsyncValue = useRef<Promise<T>>();
  const [value, setValue] = useState<T | undefined>(undefined);

  useEffect(() => {
    latestAsyncValue.current = asyncValue;
    asyncValue.then((nextValue) => {
      if (asyncValue === latestAsyncValue.current) {
        setValue(nextValue);
      }
    });
  }, [asyncValue]);

  return value;
};
