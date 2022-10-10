import { makeAutoObservable } from "mobx";
import { singleton } from "tsyringe";
import { Synth, SynthUI } from "./SynthsStore.types";
import { keyBy } from "lodash";

@singleton()
export class SynthsStore {
  private _synths: Synth[] = [];

  get synthsByName(): Record<string, SynthUI> {
    return keyBy(this.synths, (synth) => synth.name);
  }

  get synths(): SynthUI[] {
    return this._synths.map(this._synthToSynthUI);
  }

  constructor() {
    makeAutoObservable(this);
  }

  setSynths(synths: Synth[]) {
    this._synths = synths;
  }

  private _synthToSynthUI(synth: Synth): SynthUI {
    return {
      ...synth,
      logoUrl: `synths/${synth.name}.svg`,
    };
  }
}
