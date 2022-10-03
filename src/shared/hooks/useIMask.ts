import React, { useEffect, useRef } from "react";
import IMask from "imask";
import MaskedNumberOptions = IMask.MaskedNumberOptions;

type Props = Omit<IMask.MaskedNumberOptions, "mask"> & {
  value?: string;
};

const DEFAULT_SIGNED = false;
const DEFAULT_RADIX = ".";
const DEFAULT_THOUSANDS_SEPARATOR = " ";
const DEFAULT_MAP_TO_RADIX: string[] = [];

export const useIMask = (
  inputRef: React.RefObject<HTMLInputElement>,
  props: Props | undefined = {}
): IMask.InputMask<MaskedNumberOptions> | undefined => {
  const mask = useRef<IMask.InputMask<MaskedNumberOptions>>();
  const {
    signed = DEFAULT_SIGNED,
    thousandsSeparator = DEFAULT_THOUSANDS_SEPARATOR,
    padFractionalZeros = false,
    normalizeZeros = false,
    scale,
    radix = DEFAULT_RADIX,
    mapToRadix = DEFAULT_MAP_TO_RADIX,
    min,
    max,
    value, // use with controlled input
  } = props;

  useEffect(() => {
    if (mask.current && value && value !== mask.current?.value) {
      mask.current?.updateValue();
    }
  }, [value]);

  useEffect(() => {
    if (!inputRef.current) {
      return;
    }
    mask.current = IMask(inputRef.current, {
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
  return mask.current;
};
