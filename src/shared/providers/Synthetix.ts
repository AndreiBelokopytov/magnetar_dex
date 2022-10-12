import { container, InjectionToken } from "tsyringe";
import synthetix, { SynthetixJS } from "@synthetixio/contracts-interface";
// @ts-ignore
import config from "config";
import { providers } from "ethers";

export const Synthetix: InjectionToken = Symbol("Synthetix");

export type Synthetix = SynthetixJS;

const alchemyProvider = new providers.AlchemyProvider(
  config.network,
  config.alchemyApiKey
);

container.register(Synthetix, {
  useValue: synthetix({ network: config.network, provider: alchemyProvider }),
});
