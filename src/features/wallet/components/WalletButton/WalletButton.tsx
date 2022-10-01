import { Button } from "@chakra-ui/react";
import { observer } from "mobx-react";
import { useCallback } from "react";
import { Address } from "web3-toolkit";
import { useInjectedInstance, usePersistentValue } from "../../../../shared";
import { MetaMaskButton } from "./MetaMaskButton";
import { WalletButtonVM } from "./WalletButton.vm";

export const WalletButton = observer(() => {
  const vm = useInjectedInstance(WalletButtonVM);
  usePersistentValue<string>(vm);

  const handleMetaMaskConnect = useCallback(
    (addresses: string[]) => {
      vm.connectWallet(addresses[0]);
    },
    [vm]
  );

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
  return <MetaMaskButton onConnect={handleMetaMaskConnect} />;
});
