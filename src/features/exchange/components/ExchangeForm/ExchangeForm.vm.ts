import { makeAutoObservable, runInAction } from "mobx";
import { inject, injectable } from "tsyringe";
import { SynthWithLogo, SynthsStore } from "../../stores";
import { SynthsService } from "../../services";
import { BigNumber, FixedNumber } from "ethers";
import { WalletStore } from "../../../wallet/stores";
import { formatEther } from "ethers/lib/utils";
import { getErrorMessage, safeParseUnits } from "../../../../shared";

const DEFAULT_SYNTH_FROM = "sUSD";
const DEFAULT_SYNTH_TO = "sETH";

@injectable()
export class ExchangeFormVM {
  private _sourceSynth?: SynthWithLogo;
  private _destSynth?: SynthWithLogo;
  private _sourceBalance?: BigNumber;
  private _sourceAmount = "";
  private _sourceExchangeRate?: BigNumber;
  private _destExchangeRate?: BigNumber;
  private _isExchangeInProgress = false;

  onExchangeError?: (message: string) => void;
  onExchangeSuccess?: () => void;

  get sourceSynth(): SynthWithLogo | undefined {
    return this._sourceSynth;
  }

  get destSynth(): SynthWithLogo | undefined {
    return this._destSynth;
  }

  get sourceBalance(): BigNumber {
    return this._sourceBalance ?? BigNumber.from(0);
  }

  get sourceAmount(): string {
    return this._sourceAmount;
  }

  get sourceAmountNumber(): BigNumber {
    return safeParseUnits(this.sourceAmount);
  }

  get destAmountNumber(): BigNumber {
    if (!this._sourceExchangeRate || !this._destExchangeRate) {
      return BigNumber.from(0);
    }
    const fixedSourceExchangeRate = FixedNumber.fromValue(
      this._sourceExchangeRate,
      18
    );
    const fixedDestExchangeRate = FixedNumber.fromValue(
      this._destExchangeRate,
      18
    );
    const fixedAmount = FixedNumber.fromValue(this.sourceAmountNumber, 18);
    if (fixedSourceExchangeRate.isZero()) {
      return BigNumber.from(0);
    }
    const result = fixedAmount
      .mulUnsafe(fixedSourceExchangeRate)
      .divUnsafe(fixedDestExchangeRate);
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

  get isExchangeInProgress(): boolean {
    return this._isExchangeInProgress;
  }

  constructor(
    @inject(SynthsStore) private readonly _synthsStore: SynthsStore,
    @inject(WalletStore) private readonly _walletStore: WalletStore,
    @inject(SynthsService) private readonly _synthsService: SynthsService
  ) {
    makeAutoObservable<
      ExchangeFormVM,
      "_synthsStore" | "_walletStore" | "_synthsService"
    >(
      this,
      {
        _synthsStore: false,
        _walletStore: false,
        _synthsService: false,
      },
      {
        autoBind: true,
      }
    );
  }

  async init(): Promise<void> {
    await this._fetchSynths();
    await this.fetchSourceBalance();
    await this.fetchExchangeRates();
  }

  setSourceAmount(value: string | BigNumber): void {
    if (BigNumber.isBigNumber(value)) {
      this._sourceAmount = formatEther(value);
    }
    if (typeof value === "string") {
      this._sourceAmount = value;
    }
  }

  async fetchSourceBalance(): Promise<void> {
    if (!this._sourceSynth) {
      return;
    }
    const sourceBalance = await this._sourceSynth.contract.balanceOf(
      this._walletStore.address
    );
    runInAction(() => (this._sourceBalance = sourceBalance));
  }

  async exchange(): Promise<void> {
    if (!this.sourceSynth || !this.destSynth) {
      return;
    }
    if (this.formError) {
      return;
    }
    this._isExchangeInProgress = true;
    try {
      await this._synthsService.exchangeSynths(
        this.sourceSynth,
        this.destSynth,
        this.sourceAmountNumber
      );
      this._clearForm();
      this.onExchangeSuccess?.();
    } catch (err) {
      const message = getErrorMessage(err);
      if (message) {
        this.onExchangeError?.(message);
      }
    } finally {
      this._isExchangeInProgress = false;
    }
  }

  async fetchExchangeRates(): Promise<void> {
    if (!this.destSynth || !this.sourceSynth) {
      return;
    }
    const destExchangeRate = await this._synthsService.getExchangeRateForSynth(
      this.destSynth
    );
    const sourceExchangeRate =
      await this._synthsService.getExchangeRateForSynth(this.sourceSynth);
    runInAction(() => {
      this._destExchangeRate = destExchangeRate;
      this._sourceExchangeRate = sourceExchangeRate;
    });
  }

  private async _fetchSynths(): Promise<void> {
    await this._synthsService.fetchSynths();
    runInAction(() => {
      this._sourceSynth =
        this._synthsStore.synthsWithLogoByName[DEFAULT_SYNTH_FROM];
      this._destSynth =
        this._synthsStore.synthsWithLogoByName[DEFAULT_SYNTH_TO];
    });
  }

  private _clearForm(): void {
    this._sourceAmount = "";
  }
}
