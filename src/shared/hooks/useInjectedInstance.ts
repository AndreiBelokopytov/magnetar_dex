import { useRef } from "react";
import { container, InjectionToken } from "tsyringe";

export const useInjectedInstance = <T>(token: InjectionToken<T>) => {
  return useRef(container.resolve(token)).current;
};
