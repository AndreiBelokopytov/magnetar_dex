import { inject, singleton } from "tsyringe";
import { BigNumber, Contract } from "ethers";
import { Synthetix, Web3Provider } from "../../providers";
import { Synth, SynthsStore } from "../../stores";

@singleton()
export class SynthsService {
  private readonly _synthetixContract: Contract;

  constructor(
    @inject(Synthetix) private readonly _synthetix: Synthetix,
    @inject(SynthsStore) private readonly _synthsStore: SynthsStore,
    @inject(Web3Provider) private readonly _web3Provider: Web3Provider
  ) {
    this._synthetixContract = new Contract(
      this._synthetix.contracts.ProxySynthetix.address,
      this._synthetix.contracts.Synthetix.interface,
      this._web3Provider.getSigner()
    );
  }

  async fetchSynths(): Promise<void> {
    if (this._synthsStore.synths.length > 0) {
      return;
    }
    const synths = this._synthetix.synths.map((synth) => ({
      ...synth,
      logoUrl: `synths/${synth.name}.svg`,
      contract: this._getProxyContractBySynthName(synth.name),
      balance: BigNumber.from(0),
      currencyRate: BigNumber.from(0),
    }));
    this._synthsStore.setSynths(synths);
  }

  async fetchBalance(synth: Synth, address: string): Promise<void> {
    if (!synth.contract) {
      return;
    }
    const balance = await synth.contract.balanceOf(address);
    this._synthsStore.update(synth.name, (value) => ({
      ...value,
      balance,
    }));
  }

  async fetchExchangeRate(synth: Synth): Promise<void> {
    const currencyRate =
      await this._synthetix.contracts.ExchangeRates.rateForCurrency(
        this._synthetix.toBytes32(synth.name)
      );
    this._synthsStore.update(synth.name, (value) => ({
      ...value,
      currencyRate,
    }));
  }

  async fetchAllBalances(address: string): Promise<void> {
    await Promise.all(
      this._synthsStore.synths.map((synth) => this.fetchBalance(synth, address))
    );
  }

  async fetchAllExchangeRates(): Promise<void> {
    await Promise.all(
      this._synthsStore.synths.map((synth) => this.fetchExchangeRate(synth))
    );
  }

  private _getProxyContractBySynthName(name: string): Contract | undefined {
    const contractName = `Proxys${name.slice(1)}`;
    return this._synthetix.contracts[contractName];
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
