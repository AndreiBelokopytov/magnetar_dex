import { inject, singleton } from "tsyringe";
import { Synth, SynthsStore } from "../../stores";
import { Synthetix } from "../../providers";
import { BigNumber, ethers } from "ethers";

@singleton()
export class SynthsService {
  private readonly _provider = new ethers.providers.Web3Provider(
    window.ethereum
  );
  private readonly _synthetixContract: ethers.Contract;

  constructor(
    @inject(Synthetix) private readonly _synthetix: Synthetix,
    @inject(SynthsStore) private readonly _synthsStore: SynthsStore
  ) {
    const signer = this._provider.getSigner();
    this._synthetixContract = new ethers.Contract(
      this._synthetix.contracts.ProxySynthetix.address,
      this._synthetix.contracts.Synthetix.interface,
      signer
    );
  }

  async fetchSynths(): Promise<void> {
    this._synthsStore.setSynths(this._synthetix.synths);
  }

  getProxyContractForSynth(synth: Synth): ethers.Contract | undefined {
    const contractName = `Proxys${synth.name.slice(1)}`;
    return this._synthetix.contracts[contractName];
  }

  async getExchangeRateForSynth(synth: Synth): Promise<BigNumber> {
    return this._synthetix.contracts.ExchangeRates.rateForCurrency(
      this._synthetix.toBytes32(synth.name)
    );
  }

  async exchangeSynths(
    source: Synth,
    dest: Synth,
    amount: BigNumber
  ): Promise<void> {
    await this._synthetixContract.exchange(
      this._synthetix.toBytes32(source.name),
      amount,
      this._synthetix.toBytes32(dest.name)
    );
  }
}
