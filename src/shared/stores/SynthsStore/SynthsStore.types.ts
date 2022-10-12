import { Synth as SynthBase } from "@synthetixio/contracts-interface";
import { BigNumber, Contract } from "ethers";

export type Synth = SynthBase & {
  contract?: Contract;
  logoUrl?: string;
  balance: BigNumber;
  currencyRate: BigNumber;
};
