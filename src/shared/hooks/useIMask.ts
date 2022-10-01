import React, { useEffect } from "react";
import IMask from "imask";

type Props = Omit<IMask.MaskedNumberOptions, "mask">;

const DEFAULT_SIGNED = false;
const DEFAULT_SCALE = 8;
const DEFAULT_RADIX = ".";
const DEFAULT_THOUSANDS_SEPARATOR = " ";
const DEFAULT_MAP_TO_RADIX: string[] = [];

export const useIMask = (
  inputRef: React.RefObject<HTMLInputElement>,
  props: Props | undefined = {}
) => {
  const {
    signed = DEFAULT_SIGNED,
    thousandsSeparator = DEFAULT_THOUSANDS_SEPARATOR,
    padFractionalZeros = false,
    normalizeZeros = false,
    scale = DEFAULT_SCALE,
    radix = DEFAULT_RADIX,
    mapToRadix = DEFAULT_MAP_TO_RADIX,
    min,
    max,
  } = props;
  useEffect(() => {
    if (!inputRef.current) {
      return;
    }
    IMask(inputRef.current, {
      mask: Number,
      scale,
      signed,
      thousandsSeparator,
      padFractionalZeros,
      normalizeZeros,
      radix,
      mapToRadix,
      min,
      max,
    });
  }, [
    scale,
    mapToRadix,
    max,
    min,
    normalizeZeros,
    padFractionalZeros,
    radix,
    thousandsSeparator,
    inputRef,
    signed,
  ]);
};
