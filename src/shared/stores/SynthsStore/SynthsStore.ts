import { makeAutoObservable } from "mobx";
import { singleton } from "tsyringe";
import { Synth } from "./SynthsStore.types";

@singleton()
export class SynthsStore {
  private _synths = new Map<string, Synth>();

  get synths(): Synth[] {
    return [...this._synths.values()];
  }

  constructor() {
    makeAutoObservable(this);
  }

  setSynths(synths: Synth[]) {
    this._synths = new Map(synths.map((synth) => [synth.name, synth]));
  }

  findByName(name: string): Synth | undefined {
    return this._synths.get(name);
  }

  update(name: string, cb: (value: Synth) => Synth): void {
    const synth = this.findByName(name);
    if (!synth) {
      return;
    }
    const updatedSynth = cb(synth);
    this._synths.set(name, updatedSynth);
  }
}
