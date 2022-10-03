import { makeAutoObservable } from "mobx";
import { singleton } from "tsyringe";
import { Synth, SynthWithLogo } from "./SynthsStore.types";
import { keyBy, mapValues } from "lodash";

@singleton()
export class SynthsStore {
  private _synths: Synth[] = [];

  get synthsByName(): Record<string, Synth> {
    return keyBy(this._synths, (synth) => synth.name);
  }

  get synthsWithLogoByName(): Record<string, SynthWithLogo> {
    return mapValues(this.synthsByName, this._synthToSynthWithLogoUrl);
  }

  constructor() {
    makeAutoObservable(this);
  }

  setSynths(synths: Synth[]) {
    this._synths = synths;
  }

  private _synthToSynthWithLogoUrl(synth: Synth): SynthWithLogo {
    return {
      ...synth,
      logoUrl: `synths/${synth.name}.svg`,
    };
  }
}
