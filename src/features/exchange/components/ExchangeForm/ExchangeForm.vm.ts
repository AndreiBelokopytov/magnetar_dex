import { makeAutoObservable } from "mobx";
import { inject, injectable } from "tsyringe";
import { SynthWithLogo, SynthsStore } from "../../stores";
import { SynthsService } from "../../services";
import { ethers } from "ethers";
import { WalletStore } from "../../../wallet/stores";
import { formatEther } from "ethers/lib/utils";

const DEFAULT_SYNTH_FROM = "sUSD";
const DEFAULT_SYNTH_TO = "sETH";

@injectable()
export class ExchangeFormVM {
  private _synthFrom?: SynthWithLogo;
  private _synthTo?: SynthWithLogo;

  get synthFrom(): SynthWithLogo | undefined {
    return this._synthFrom;
  }

  get synthTo(): SynthWithLogo | undefined {
    return this._synthTo;
  }

  get proxyFrom(): ethers.Contract | undefined {
    if (!this._synthFrom) {
      return undefined;
    }
    return this._synthsService.getProxyForSynth(this._synthFrom);
  }

  get proxyTo(): ethers.Contract | undefined {
    if (!this._synthTo) {
      return undefined;
    }
    return this._synthsService.getProxyForSynth(this._synthTo);
  }

  get balanceFrom(): Promise<string> {
    if (!this.proxyFrom || !this._walletStore.address) {
      return Promise.resolve("0");
    }
    return this.proxyFrom
      .balanceOf(this._walletStore.address)
      .then(formatEther);
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
}
