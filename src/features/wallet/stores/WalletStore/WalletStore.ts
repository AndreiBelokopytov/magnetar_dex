import { makeAutoObservable } from "mobx";
import { singleton } from "tsyringe";

@singleton()
export class WalletStore {
  private _address?: string;

  get address() {
    return this._address;
  }

  constructor() {
    makeAutoObservable(this);
  }

  setAddress(value: string) {
    this._address = value;
  }
}
