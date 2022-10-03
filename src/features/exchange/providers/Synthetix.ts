import { container, InjectionToken } from "tsyringe";
import synthetix, { SynthetixJS } from "@synthetixio/contracts-interface";
// @ts-ignore
import config from "config";

export const Synthetix: InjectionToken = Symbol("Synthetix");

export type Synthetix = SynthetixJS;

container.register(Synthetix, {
  useValue: synthetix({ network: config.network }),
});
