import { makeAutoObservable } from "mobx";
import { inject, injectable } from "tsyringe";
import { SynthWithLogo, SynthsStore } from "../../stores";
import { SynthsService } from "../../services";
import { BigNumber, ethers } from "ethers";
import { WalletStore } from "../../../wallet/stores";
import { formatEther, parseEther } from "ethers/lib/utils";

const DEFAULT_SYNTH_FROM = "sUSD";
const DEFAULT_SYNTH_TO = "sETH";

@injectable()
export class ExchangeFormVM {
  private _synthFrom?: SynthWithLogo;
  private _synthTo?: SynthWithLogo;
  private _amountFrom = BigNumber.from(0);

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
    return this._synthsService.getProxyForSynth(this._synthFrom);
  }

  get proxyContractTo(): ethers.Contract | undefined {
    if (!this._synthTo) {
      return undefined;
    }
    return this._synthsService.getProxyForSynth(this._synthTo);
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

  get amountFrom(): BigNumber {
    return this._amountFrom;
  }

  get amountFromFormatted(): string {
    return formatEther(this.amountFrom);
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
    this._synthFrom =
      this._synthsStore.synthsWithLogoByName[DEFAULT_SYNTH_FROM];
    this._synthTo = this._synthsStore.synthsWithLogoByName[DEFAULT_SYNTH_TO];
  }

  setAmountFrom(value: string | BigNumber) {
    try {
      if (BigNumber.isBigNumber(value)) {
        this._amountFrom = value;
      } else {
        this._amountFrom = parseEther(value);
      }
    } catch {
      this._amountFrom = BigNumber.from(0);
    }
  }
}
