import { useEffect } from "react";

type Props = {
  time: number;
  fireImmediately?: boolean;
};

export const useInterval = (
  cb: () => void,
  { time, fireImmediately = true }: Props
) => {
  useEffect(() => {
    if (fireImmediately) {
      cb();
    }

    setInterval(cb, time);
  }, [cb, fireImmediately, time]);
};
