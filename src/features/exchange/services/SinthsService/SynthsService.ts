import { inject, singleton } from "tsyringe";
import { Synth, SynthsStore } from "../../stores";
import { Synthetix } from "../../providers";
import { ethers } from "ethers";

@singleton()
export class SynthsService {
  constructor(
    @inject(Synthetix) private readonly _synthetix: Synthetix,
    @inject(SynthsStore) private readonly _synthsStore: SynthsStore
  ) {}

  async fetchSynths(): Promise<void> {
    this._synthsStore.setSynths(this._synthetix.synths);
  }

  getProxyForSynth(synth: Synth): ethers.Contract | undefined {
    const contractName = `Proxys${synth.name.slice(1)}`;
    return this._synthetix.contracts[contractName];
  }
}
