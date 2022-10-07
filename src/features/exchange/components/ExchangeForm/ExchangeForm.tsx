import { Box, Button, Text, useToast } from "@chakra-ui/react";
import { observer } from "mobx-react";
import { useInjectedInstance, useInterval } from "../../../../shared";
import { ExchangeFormVM } from "./ExchangeForm.vm";
import { SynthAmountInput } from "./SynthAmountInput";
import { useEffect } from "react";

const REFRESH_EXCHANGE_RATES_INTERVAL = 2 * 60 * 1000;
const REFRESH_BALANCE_INTERVAL = 60 * 1000;

export const ExchangeForm = observer(() => {
  const toast = useToast();
  const vm = useInjectedInstance(ExchangeFormVM);

  vm.onExchangeError = (message) =>
    toast({
      title: "Error",
      description: message,
      status: "error",
      isClosable: true,
    });

  vm.onExchangeSuccess = () =>
    toast({
      title: "Success",
      description: "Successfully exchanged tokens",
      status: "success",
      isClosable: true,
    });

  useEffect(() => {
    vm.init();
  }, [vm]);

  useInterval(vm.fetchSourceBalance, {
    time: REFRESH_BALANCE_INTERVAL,
    fireImmediately: false,
  });
  useInterval(vm.fetchExchangeRates, {
    time: REFRESH_EXCHANGE_RATES_INTERVAL,
    fireImmediately: false,
  });

  if (!vm.sourceSynth || !vm.destSynth) {
    return null;
  }

  return (
    <>
      <Box padding={6} borderRadius="md" bg="background.800">
        <Text as="h3" fontSize="xl" fontWeight={"bold"} mb={12}>
          Exchange
        </Text>
        <SynthAmountInput
          value={vm.sourceAmount}
          synth={vm.sourceSynth}
          balance={vm.sourceBalance}
          onChange={vm.setSourceAmount}
          mb={12}
        />
        <SynthAmountInput
          synth={vm.destSynth}
          mb={12}
          value={vm.destAmount}
          readonly
        />
        <Button
          w="100%"
          colorScheme={"green"}
          variant={"outline"}
          disabled={!!vm.formError}
          onClick={vm.exchange}
          isLoading={vm.isExchangeInProgress}
        >
          {vm.formError ?? "Confirm"}
        </Button>
      </Box>
    </>
  );
});
