import { Box, Button, Text } from "@chakra-ui/react";
import { observer } from "mobx-react";
import { useAsyncObservable, useInjectedInstance } from "../../../../shared";
import { ExchangeFormVM } from "./ExchangeForm.vm";
import { SynthAmountInput } from "./SynthAmountInput";
import { useCallback, useEffect } from "react";

export const ExchangeForm = observer(() => {
  const vm = useInjectedInstance(ExchangeFormVM);

  const balanceFrom = useAsyncObservable(vm.balanceFromFormatted);
  const halfBalanceFrom = useAsyncObservable(vm.halfBalanceFrom);

  useEffect(() => {
    vm.init();
  }, [vm]);

  const handleMaxButtonClick = useCallback(() => {
    if (balanceFrom) {
      vm.setAmountFrom(balanceFrom);
    }
  }, [balanceFrom, vm]);

  const handleHalfButtonClick = useCallback(() => {
    if (halfBalanceFrom) {
      vm.setAmountFrom(halfBalanceFrom);
    }
  }, [halfBalanceFrom, vm]);

  if (!vm.synthFrom || !vm.synthTo) {
    return null;
  }

  return (
    <Box padding={6} borderRadius="md" bg="background.800">
      <Text as="h3" fontSize="xl" fontWeight={"bold"} mb={12}>
        Exchange
      </Text>
      <SynthAmountInput
        value={vm.amountFromFormatted}
        synth={vm.synthFrom}
        balance={balanceFrom}
        onHalfButtonClick={handleHalfButtonClick}
        onMaxButtonClick={handleMaxButtonClick}
        mb={12}
      />
      <SynthAmountInput synth={vm.synthTo} mb={12} />
      <Button w="100%" colorScheme={"green"}>
        Confirm
      </Button>
    </Box>
  );
});
