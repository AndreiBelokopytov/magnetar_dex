import { makeAutoObservable, runInAction } from "mobx";
import { inject, injectable } from "tsyringe";
import { SynthWithLogo, SynthsStore } from "../../stores";
import { SynthsService } from "../../services";
import { BigNumber, ethers, FixedNumber } from "ethers";
import { WalletStore } from "../../../wallet/stores";
import { formatEther } from "ethers/lib/utils";
import { safeParseUnits } from "../../../../shared";
import { debounce } from "lodash";

const DEFAULT_SYNTH_FROM = "sUSD";
const DEFAULT_SYNTH_TO = "sETH";
const REFRESH_EXCHANGE_RATE_THROTTLE_TIME = 30 * 1000;

@injectable()
export class ExchangeFormVM {
  private _sourceSynth?: SynthWithLogo;
  private _destSynth?: SynthWithLogo;
  private _sourceProxyContract?: ethers.Contract;
  private _destProxyContract?: ethers.Contract;
  private _sourceBalance?: BigNumber;
  private _sourceAmount = "";
  private _exchangeRate?: BigNumber;

  get sourceSynth(): SynthWithLogo | undefined {
    return this._sourceSynth;
  }

  get destSynth(): SynthWithLogo | undefined {
    return this._destSynth;
  }

  get sourceBalance(): BigNumber {
    return this._sourceBalance ?? BigNumber.from(0);
  }

  get halvedSourceBalance(): BigNumber {
    return this.sourceBalance.div(2);
  }

  get formattedSourceBalance(): string {
    return formatEther(this.sourceBalance);
  }

  get halvedFormattedSourceBalance(): string {
    return formatEther(this.halvedSourceBalance);
  }

  get sourceAmount(): string {
    return this._sourceAmount;
  }

  get sourceAmountNumber(): BigNumber {
    return safeParseUnits(this.sourceAmount);
  }

  get destAmountNumber(): BigNumber {
    if (!this._exchangeRate) {
      return BigNumber.from(0);
    }
    const fixedExchangeRate = FixedNumber.fromValue(this._exchangeRate, 18);
    const fixedAmount = FixedNumber.fromValue(this.sourceAmountNumber, 18);
    if (fixedExchangeRate.isZero()) {
      return BigNumber.from(0);
    }
    const result = fixedAmount.divUnsafe(fixedExchangeRate);
    return BigNumber.from(result.toHexString());
  }

  get destAmount(): string {
    return this.destAmountNumber ? formatEther(this.destAmountNumber) : "";
  }

  get formError(): string | undefined {
    if (this.sourceAmountNumber.isZero()) {
      return "Enter amount";
    }

    if (this.sourceAmountNumber.gt(this.sourceBalance)) {
      return "Insufficient balance";
    }
  }

  constructor(
    @inject(SynthsStore) private readonly _synthsStore: SynthsStore,
    @inject(WalletStore) private readonly _walletStore: WalletStore,
    @inject(SynthsService) private readonly _synthsService: SynthsService
  ) {
    makeAutoObservable<
      ExchangeFormVM,
      | "_synthsStore"
      | "_walletStore"
      | "_synthsService"
      | "_calcDestAmountDebounced"
    >(this, {
      _synthsStore: false,
      _walletStore: false,
      _synthsService: false,
      _calcDestAmountDebounced: false,
    });
  }

  async init(): Promise<void> {
    await this.fetchSynths();
    await this.fetchSourceBalance();
  }

  setAmountFrom(value: string | BigNumber) {
    if (BigNumber.isBigNumber(value)) {
      this._sourceAmount = formatEther(value);
    }
    if (typeof value === "string") {
      this._sourceAmount = value;
    }
    this._throttledRefreshExchangeRate();
  }

  private async fetchSynths() {
    await this._synthsService.fetchSynths();
    runInAction(() => {
      this._sourceSynth =
        this._synthsStore.synthsWithLogoByName[DEFAULT_SYNTH_FROM];
      this._destSynth =
        this._synthsStore.synthsWithLogoByName[DEFAULT_SYNTH_TO];
      this._sourceProxyContract = this._synthsService.getProxyContractForSynth(
        this._sourceSynth
      );
      this._destProxyContract = this._synthsService.getProxyContractForSynth(
        this._destSynth
      );
    });
  }

  async fetchSourceBalance() {
    if (!this._sourceProxyContract) {
      return;
    }
    const sourceBalance = await this._sourceProxyContract.balanceOf(
      this._walletStore.address
    );
    runInAction(() => (this._sourceBalance = sourceBalance));
  }

  private async _refreshExchangeRate(): Promise<void> {
    if (!this.destSynth) {
      return;
    }
    const exchangeRate = await this._synthsService.getExchangeRateForSynth(
      this.destSynth
    );
    runInAction(() => (this._exchangeRate = exchangeRate));
  }

  private _throttledRefreshExchangeRate = debounce(
    this._refreshExchangeRate,
    REFRESH_EXCHANGE_RATE_THROTTLE_TIME,
    {
      leading: true,
    }
  );
}
