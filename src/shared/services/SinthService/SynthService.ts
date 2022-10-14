import { inject, singleton } from "tsyringe";
import { BigNumber, Contract } from "ethers";
import { Synthetix, Web3Provider } from "../../providers";
import { SynthsStore, SynthUI } from "../../stores";
import { Synth } from "@synthetixio/contracts-interface";

@singleton()
export class SynthService {
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
    const synths = this._synthetix.synths.map((synth) => {
      const contract = this._getProxyContractForSynth(synth);
      const synthUI = new SynthUI(synth);
      synthUI.setContract(contract);
      return synthUI;
    });
    this._synthsStore.setSynths(synths);
  }

  async fetchBalance(synth: SynthUI, address: string): Promise<void> {
    if (!synth.contract) {
      return;
    }
    const balance = await synth.contract.balanceOf(address);
    synth.setBalance(balance);
  }

  async fetchCurrencyRate(synth: SynthUI): Promise<void> {
    const currencyRate =
      await this._synthetix.contracts.ExchangeRates.rateForCurrency(
        this._synthetix.toBytes32(synth.name)
      );
    synth.setCurrencyRate(currencyRate);
  }

  async fetchAllBalances(address: string): Promise<void> {
    await Promise.all(
      this._synthsStore.synths.map((synth) => this.fetchBalance(synth, address))
    );
  }

  async fetchAllExchangeRates(): Promise<void> {
    await Promise.all(
      this._synthsStore.synths.map((synth) => this.fetchCurrencyRate(synth))
    );
  }

  private _getProxyContractForSynth(synth: Synth): Contract | undefined {
    const contractName = `Proxys${synth.name.slice(1)}`;
    return this._synthetix.contracts[contractName];
  }

  async exchangeSynths(
    source: SynthUI,
    dest: SynthUI,
    amount: BigNumber
  ): Promise<void> {
    await this._synthetixContract.exchange(
      this._synthetix.toBytes32(source.name),
      amount,
      this._synthetix.toBytes32(dest.name)
    );
  }
}
