import { Button } from "@chakra-ui/react";
import { observer } from "mobx-react";
import { useEffect } from "react";
import { Address, useMetaMask } from "web3-toolkit";
import {
  useEffectOnce,
  useInjectedInstance,
  usePersistentProperty,
} from "../../../../shared";
import { WalletButtonVM } from "./WalletButton.vm";

export const WalletButton = observer(() => {
  const { status, accounts, connect } = useMetaMask();

  const isMetaMaskLoading = status.isConnected || status.isOnboarding;

  const vm = useInjectedInstance(WalletButtonVM);
  usePersistentProperty<string>(vm);

  useEffectOnce(() => {
    if (vm.hasAccount && status.isNotConnected) {
      connect();
    }
  });

  useEffect(() => {
    if (status.isConnected) {
      vm.connectWallet(accounts[0]);
    }
  }, [connect, accounts, status, vm]);

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
