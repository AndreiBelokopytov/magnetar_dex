import { makeAutoObservable, reaction } from "mobx";
import { inject, injectable } from "tsyringe";
import { SynthsService, SynthsStore, SynthUI } from "../../../../shared";
import { WalletStore } from "../../../wallet/stores";

type Disposer = () => void;

@injectable()
export class PortfolioVM {
  private _disposers: Disposer[] = [];

  get synths(): SynthUI[] {
    return this._synthsStore.synths;
  }

  get address(): string | undefined {
    return this._wallletStore.address;
  }

  constructor(
    @inject(SynthsStore) private readonly _synthsStore: SynthsStore,
    @inject(SynthsService) private readonly _synthsService: SynthsService,
    @inject(WalletStore) private readonly _wallletStore: WalletStore
  ) {
    makeAutoObservable<
      this,
      "_synthsStore" | "_synthsService" | "_walletStore"
    >(
      this,
      {
        _synthsStore: false,
        _synthsService: false,
        _walletStore: false,
      },
      {
        autoBind: true,
      }
    );
  }

  async init(): Promise<void> {
    await this._synthsService.fetchSynths();
    await this._synthsService.fetchAllExchangeRates();

    this._disposers = [
      reaction(
        () => this.address,
        () => {
          if (this.address) {
            this._synthsService.fetchAllBalances(this.address);
          }
        },
        {
          fireImmediately: true,
        }
      ),
    ];
  }

  dispose(): void {
    return this._disposers.forEach((dispose) => dispose());
  }
}
