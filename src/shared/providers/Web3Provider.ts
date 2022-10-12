import { providers } from "ethers";
import { container, InjectionToken } from "tsyringe";

export const Web3Provider: InjectionToken = Symbol("Web3Provider");

export type Web3Provider = providers.Web3Provider;

container.register(Web3Provider, {
  useValue: new providers.Web3Provider(window.ethereum),
});
