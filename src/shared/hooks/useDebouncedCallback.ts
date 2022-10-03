import { DependencyList, useCallback } from "react";
import { debounce } from "lodash";

export const useDebouncedCallback = <T>(
  fn: (...args: any[]) => T,
  time: number,
  deps: DependencyList
) => {
  return useCallback(debounce(fn, time), deps);
};
