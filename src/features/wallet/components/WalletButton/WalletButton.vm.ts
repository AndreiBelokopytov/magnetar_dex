import { autorun, makeAutoObservable } from "mobx";
import { injectable, inject } from "tsyringe";
import { PersistentValueDelegate } from "../../../../shared";
import { WalletStore } from "../../stores";

@injectable()
export class WalletButtonVM implements PersistentValueDelegate<string> {
  private _isReady = false;
  private _restoredAddress?: string;

  readonly persistencyKey = "eth_address";

  get isReady(): boolean {
    return this._isReady;
  }

  get address(): string | undefined {
    return this._walletStore.address;
  }

  get hasAccount(): boolean {
    return !!this._restoredAddress;
  }

  constructor(@inject(WalletStore) private readonly _walletStore: WalletStore) {
    makeAutoObservable<WalletButtonVM, "_walletStore">(this, {
      _walletStore: false,
    });
  }

  connectWallet(address: string) {
    this._walletStore.setAddress(address);
  }

  restore(address?: string) {
    if (address) {
      this._restoredAddress = address;
    }
    this._isReady = true;
  }

  onValueChange(cacheValue: (value?: string) => void): () => void {
    const dispose = autorun(() => {
      if (this.address) {
        cacheValue(this.address);
      }
    });
    return dispose;
  }
}
