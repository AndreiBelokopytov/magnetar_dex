import { Synth as SynthBase } from "@synthetixio/contracts-interface";

export type Synth = SynthBase;

export type SynthWithLogo = Synth & {
  logoUrl: string;
};
