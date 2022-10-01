import { useEffect } from "react";
import { MetaMaskOnboardingStatus, useMetaMask } from "web3-toolkit";
import { Button } from "@chakra-ui/react";

type Props = {
  title: string;
  onConnect?: (addresses: string[]) => void;
};

export const MetaMaskButton = ({ title, onConnect }: Props) => {
  const { onboardingState, connect } = useMetaMask();

  const isMetaMaskConnected =
    onboardingState.status === MetaMaskOnboardingStatus.connected &&
    onboardingState.accounts.length > 0;
  const isMetaMaskLoading =
    onboardingState.status === MetaMaskOnboardingStatus.connecting ||
    onboardingState.status === MetaMaskOnboardingStatus.onboarding;

  useEffect(() => {
    if (isMetaMaskConnected) {
      onConnect?.(onboardingState.accounts);
    }
  }, [isMetaMaskConnected, onConnect, onboardingState.accounts]);

  return (
    <Button
      isLoading={isMetaMaskLoading}
      loadingText="Connecting"
      onClick={connect}
    >
      {title}
    </Button>
  );
};
