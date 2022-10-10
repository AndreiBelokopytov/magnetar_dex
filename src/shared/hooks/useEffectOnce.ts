import { once } from "lodash";
import { useEffect, useRef } from "react";

export const useEffectOnce = (cb: () => void) => {
  const callBackOnce = useRef(once(cb)).current;
  useEffect(() => callBackOnce(), [callBackOnce]);
};
