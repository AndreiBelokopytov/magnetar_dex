import { Synth } from "@synthetixio/contracts-interface";
import { BigNumber, Contract, FixedNumber } from "ethers";
import { formatEther } from "ethers/lib/utils";
import { makeAutoObservable } from "mobx";

export class SynthUI {
  private _contract?: Contract;
  private _name: string;
  private _sign: string;
  private _description: string;
  private _balance = BigNumber.from(0);
  private _currencyRate = BigNumber.from(0);

  get contract(): Contract | undefined {
    return this._contract;
  }

  get name(): string {
    return this._name;
  }

  get sign(): string {
    return this._sign;
  }

  get description(): string {
    return this._description;
  }

  get balance(): BigNumber {
    return this._balance;
  }

  get currencyRate(): BigNumber {
    return this._currencyRate;
  }

  get currencyPrice(): number {
    if (this.currencyRate.isZero()) {
      return 0;
    }
    const fixedBalance = FixedNumber.fromValue(this.balance, 18);
    const fixedCurrencyRate = FixedNumber.fromValue(this.currencyRate, 18);
    return fixedBalance.mulUnsafe(fixedCurrencyRate).toUnsafeFloat();
  }

  get balanceString(): string {
    return formatEther(this.balance);
  }

  get logoUrl(): string {
    return `synths/${this.name}.svg`;
  }

  get currencyRateString(): string {
    return formatEther(this.currencyRate);
  }

  constructor(synth: Synth) {
    this._name = synth.name;
    this._sign = synth.sign;
    this._description = synth.description;
    makeAutoObservable(this);
  }

  setContract(contract?: Contract): void {
    this._contract = contract;
  }

  setBalance(balance: BigNumber): void {
    this._balance = balance;
  }

  setCurrencyRate(currencyRate: BigNumber): void {
    this._currencyRate = currencyRate;
  }
}
