import { makeAutoObservable, reaction } from "mobx";
import { inject, injectable } from "tsyringe";
import { BigNumber, FixedNumber } from "ethers";
import { WalletStore } from "../../../wallet/stores";
import { formatEther } from "ethers/lib/utils";
import {
  safeParseUnits,
  SynthsService,
  SynthsStore,
  SynthUI,
} from "../../../../shared";

const DEFAULT_SOURCE = "sUSD";
const DEFAULT_DEST = "sETH";

const EXCHANGE_ERROR_MESSAGE = "An error occured during exchange. Try later.";

type Disposer = () => void;

@injectable()
export class ExchangeFormVM {
  private _sourceSynthName = DEFAULT_SOURCE;
  private _destSynthName = DEFAULT_DEST;
  private _sourceAmount = "";
  private _isExchangeInProgress = false;
  private _disposers: Disposer[] = [];

  onExchangeError?: (message: string) => void;
  onExchangeSuccess?: () => void;

  get sourceSynth(): SynthUI | undefined {
    return this._synthsStore.findByName(this._sourceSynthName);
  }

  get destSynth(): SynthUI | undefined {
    return this._synthsStore.findByName(this._destSynthName);
  }

  get sourceAmount(): string {
    return this._sourceAmount;
  }

  get sourceAmountNumber(): BigNumber {
    return safeParseUnits(this.sourceAmount);
  }

  get destAmountNumber(): BigNumber {
    if (!this.sourceSynth || !this.destSynth) {
      return BigNumber.from(0);
    }
    const fixedSourceCurrencyRate = FixedNumber.fromValue(
      this.sourceSynth.currencyRate,
      18
    );
    const fixedDestCurrencyRate = FixedNumber.fromValue(
      this.destSynth.currencyRate,
      18
    );
    const fixedAmount = FixedNumber.fromValue(this.sourceAmountNumber, 18);
    if (fixedDestCurrencyRate.isZero()) {
      return BigNumber.from(0);
    }
    const result = fixedAmount
      .mulUnsafe(fixedSourceCurrencyRate)
      .divUnsafe(fixedDestCurrencyRate);
    return BigNumber.from(result.toHexString());
  }

  get destAmount(): string {
    return this.destAmountNumber ? formatEther(this.destAmountNumber) : "";
  }

  get formError(): string | undefined {
    if (!this.sourceSynth || !this.destSynth) {
      return;
    }
    if (this.sourceAmountNumber.isZero()) {
      return "Enter amount";
    }
    if (this.sourceAmountNumber.gt(this.sourceSynth?.balance)) {
      return "Insufficient balance";
    }
  }

  get isExchangeInProgress(): boolean {
    return this._isExchangeInProgress;
  }

  get synths(): SynthUI[] {
    return this._synthsStore.synths;
  }

  get address(): string | undefined {
    return this._walletStore.address;
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

    this._disposers = [
      reaction(
        () => [this._sourceSynthName, this.address],
        () => {
          this.fetchSourceBalance();
          this.fetchSourceCurrencyRate();
        },
        {
          fireImmediately: true,
        }
      ),
      reaction(
        () => this._destSynthName,
        () => {
          this.fetchDestCurrencyRate();
        },
        {
          fireImmediately: true,
        }
      ),
    ];
  }

  dispose(): void {
    this._disposers.forEach((dispose) => dispose());
  }

  setSourceSynth(name: string): void {
    if (name === this._sourceSynthName) {
      return;
    }
    if (name === this._destSynthName) {
      this._destSynthName = this._sourceSynthName;
    }
    this._sourceSynthName = name;
    this._clearForm();
  }

  setDestSynth(name: string): void {
    if (name === this._destSynthName) {
      return;
    }
    if (name === this._destSynthName) {
      this._sourceSynthName = this._destSynthName;
    }
    this._destSynthName = name;
    this._clearForm();
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
    if (!this.sourceSynth || !this.address) {
      return;
    }
    await this._synthsService.fetchBalance(this.sourceSynth, this.address);
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
      console.error("Exchange method error:", err);
      this.onExchangeError?.(EXCHANGE_ERROR_MESSAGE);
    } finally {
      this._isExchangeInProgress = false;
    }
  }

  async fetchSourceCurrencyRate(): Promise<void> {
    if (!this.sourceSynth) {
      return;
    }
    await this._synthsService.fetchCurrencyRate(this.sourceSynth);
  }

  async fetchDestCurrencyRate(): Promise<void> {
    if (!this.destSynth) {
      return;
    }
    await this._synthsService.fetchCurrencyRate(this.destSynth);
  }

  private async _fetchSynths(): Promise<void> {
    await this._synthsService.fetchSynths();
  }

  private _clearForm(): void {
    this._sourceAmount = "";
  }
}
