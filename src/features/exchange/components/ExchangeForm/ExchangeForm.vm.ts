import { makeAutoObservable, runInAction } from "mobx";
import { inject, injectable } from "tsyringe";
import { SynthWithLogo, SynthsStore } from "../../stores";
import { SynthsService } from "../../services";
import { BigNumber, ethers, FixedNumber } from "ethers";
import { WalletStore } from "../../../wallet/stores";
import { formatEther } from "ethers/lib/utils";

const DEFAULT_SYNTH_FROM = "sUSD";
const DEFAULT_SYNTH_TO = "sETH";

@injectable()
export class ExchangeFormVM {
  private _synthFrom?: SynthWithLogo;
  private _synthTo?: SynthWithLogo;
  private _amountFrom = "";

  get synthFrom(): SynthWithLogo | undefined {
    return this._synthFrom;
  }

  get synthTo(): SynthWithLogo | undefined {
    return this._synthTo;
  }

  get proxyContractFrom(): ethers.Contract | undefined {
    if (!this._synthFrom) {
      return undefined;
    }
    return this._synthsService.getProxyContractForSynth(this._synthFrom);
  }

  get proxyContractTo(): ethers.Contract | undefined {
    if (!this._synthTo) {
      return undefined;
    }
    return this._synthsService.getProxyContractForSynth(this._synthTo);
  }

  get balanceFrom(): Promise<BigNumber> {
    if (!this.proxyContractFrom || !this._walletStore.address) {
      return Promise.resolve(BigNumber.from(0));
    }
    return this.proxyContractFrom.balanceOf(this._walletStore.address);
  }

  get halfBalanceFrom(): Promise<BigNumber> {
    return this.balanceFrom.then((value) =>
      value ? value.div(2) : BigNumber.from(0)
    );
  }

  get balanceFromFormatted(): Promise<string> {
    return this.balanceFrom.then(formatEther);
  }

  get halfBalanceFromFormatted(): Promise<string> {
    return this.halfBalanceFrom.then(formatEther);
  }

  get amountFrom(): string {
    return this._amountFrom;
  }

  get amountTo(): Promise<string> {
    return this._calcAmountToExchange(this._amountFrom).then((amount) =>
      amount ? formatEther(amount) : ""
    );
  }

  constructor(
    @inject(SynthsStore) private readonly _synthsStore: SynthsStore,
    @inject(WalletStore) private readonly _walletStore: WalletStore,
    @inject(SynthsService) private readonly _synthsService: SynthsService
  ) {
    makeAutoObservable<
      ExchangeFormVM,
      "_synthsStore" | "_walletStore" | "_synthsService"
    >(this, {
      _synthsStore: false,
      _walletStore: false,
      _synthsService: false,
    });
  }

  async init(): Promise<void> {
    await this._synthsService.fetchSynths();
    runInAction(() => {
      this._synthFrom =
        this._synthsStore.synthsWithLogoByName[DEFAULT_SYNTH_FROM];
      this._synthTo = this._synthsStore.synthsWithLogoByName[DEFAULT_SYNTH_TO];
    });
  }

  setAmountFrom(value: string | BigNumber) {
    if (BigNumber.isBigNumber(value)) {
      try {
        this._amountFrom = formatEther(value);
      } catch {
        this._amountFrom = "";
      }
    }
    if (typeof value === "string") {
      this._amountFrom = value;
    }
  }

  private async _calcAmountToExchange(
    amount: string
  ): Promise<BigNumber | undefined> {
    if (!this.synthTo) {
      return undefined;
    }
    const exchangeRate = await this._synthsService.getExchangeRateForSynth(
      this.synthTo
    );
    const fixedExchangeRate = FixedNumber.fromValue(exchangeRate, 18);
    const fixedAmount = FixedNumber.from(amount);
    if (fixedExchangeRate.isZero()) {
      return BigNumber.from(0);
    }
    const result = fixedAmount.divUnsafe(fixedExchangeRate);
    return BigNumber.from(result.toHexString());
  }
}
