import { BigNumber, BigNumberish } from "ethers";
import { parseUnits } from "ethers/lib/utils";

export class AssertionError extends Error {}

export function assert(condition: boolean, msg?: string): asserts condition {
  if (!condition) {
    throw new AssertionError(msg);
  }
}

export function safeParseUnits(
  value: string,
  unitName?: BigNumberish
): BigNumber {
  try {
    return parseUnits(value, unitName);
  } catch {
    return BigNumber.from(0);
  }
}

export function getErrorMessage(error: unknown): string | undefined {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
}
