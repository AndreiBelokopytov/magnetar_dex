import { Button } from "@chakra-ui/react";
import { observer } from "mobx-react";
import { useEffect } from "react";
import { Address, MetaMaskOnboardingStatus, useMetaMask } from "web3-toolkit";
import {
  useEffectOnce,
  useInjectedInstance,
  usePersistentProperty,
} from "../../../../shared";
import { WalletButtonVM } from "./WalletButton.vm";

export const WalletButton = observer(() => {
  const { onboardingState, connect } = useMetaMask();

  const isMetaMaskLoading =
    onboardingState.status === MetaMaskOnboardingStatus.connecting ||
    onboardingState.status === MetaMaskOnboardingStatus.onboarding;

  const vm = useInjectedInstance(WalletButtonVM);
  usePersistentProperty<string>(vm);

  useEffectOnce(() => {
    if (
      vm.hasAccount &&
      onboardingState.status === MetaMaskOnboardingStatus.notConnected
    ) {
      connect();
    }
  });

  useEffect(() => {
    if (onboardingState.status === MetaMaskOnboardingStatus.connected) {
      vm.connectWallet(onboardingState.accounts[0]);
    }
  }, [connect, onboardingState.accounts, onboardingState.status, vm]);

  if (!vm.isReady) {
    return null;
  }
  if (vm.address) {
    return (
      <Button variant="outline">
        <Address>{vm.address}</Address>
      </Button>
    );
  }
  return (
    <Button
      isLoading={isMetaMaskLoading}
      loadingText="Connecting"
      onClick={connect}
    >
      {"Connect wallet"}
    </Button>
  );
});
