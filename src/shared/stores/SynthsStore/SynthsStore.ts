import { makeAutoObservable } from "mobx";
import { singleton } from "tsyringe";
import { SynthUI } from "./SynthUI";

@singleton()
export class SynthsStore {
  private _synths = new Map<string, SynthUI>();

  get synths(): SynthUI[] {
    return [...this._synths.values()];
  }

  constructor() {
    makeAutoObservable(this);
  }

  setSynths(synths: SynthUI[]) {
    this._synths = new Map(synths.map((synth) => [synth.name, synth]));
  }

  findByName(name: string): SynthUI | undefined {
    return this._synths.get(name);
  }
}
