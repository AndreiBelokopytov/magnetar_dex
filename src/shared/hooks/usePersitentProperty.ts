import { useEffect } from "react";

type Disposer = () => void;

export interface PersistentValueDelegate<Value> {
  readonly persistencyKey: string;
  restore(value?: Value): void;
  onValueChange(cb: (value?: Value) => void): Disposer;
}

export const usePersistentProperty = <Value>(
  delegate: PersistentValueDelegate<Value>
): void => {
  useEffect(() => {
    const dispose = delegate.onValueChange((value) => {
      if (value) {
        localStorage.setItem(delegate.persistencyKey, JSON.stringify(value));
      } else {
        localStorage.removeItem(delegate.persistencyKey);
      }
    });
    return () => dispose();
  }, [delegate]);

  useEffect(() => {
    const cachedItem = localStorage.getItem(delegate.persistencyKey);
    const isEmptyItem = cachedItem === null || cachedItem === "";
    const value = !isEmptyItem ? JSON.parse(cachedItem) : undefined;
    delegate.restore(value);
  }, [delegate]);
};
