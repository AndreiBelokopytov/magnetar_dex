import { Synth as SynthBase } from "@synthetixio/contracts-interface";
import { Contract } from "ethers";

export type Synth = SynthBase & {
  contract: Contract;
};

export type SynthUI = Synth & {
  logoUrl: string;
};
