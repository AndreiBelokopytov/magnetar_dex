import { Box, Button, Text } from "@chakra-ui/react";
import { observer } from "mobx-react";
import {
  useAsyncObservable,
  useDebouncedCallback,
  useInjectedInstance,
} from "../../../../shared";
import { ExchangeFormVM } from "./ExchangeForm.vm";
import { SynthAmountInput } from "./SynthAmountInput";
import { useCallback, useEffect } from "react";

const AMOUNT_CHANGE_DEBOUNCE_TIME = 100;

export const ExchangeForm = observer(() => {
  const vm = useInjectedInstance(ExchangeFormVM);

  const balanceFrom = useAsyncObservable(vm.balanceFromFormatted);
  const halfBalanceFrom = useAsyncObservable(vm.halfBalanceFrom);
  const amountTo = useAsyncObservable(vm.amountTo);

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

  const handleAmountFromChange = useDebouncedCallback(
    (value: string) => vm.setAmountFrom(value),
    AMOUNT_CHANGE_DEBOUNCE_TIME,
    [vm]
  );

  if (!vm.synthFrom || !vm.synthTo) {
    return null;
  }

  return (
    <Box padding={6} borderRadius="md" bg="background.800">
      <Text as="h3" fontSize="xl" fontWeight={"bold"} mb={12}>
        Exchange
      </Text>
      <SynthAmountInput
        value={vm.amountFrom}
        synth={vm.synthFrom}
        balance={balanceFrom}
        onHalfButtonClick={handleHalfButtonClick}
        onMaxButtonClick={handleMaxButtonClick}
        onChange={handleAmountFromChange}
        mb={12}
      />
      <SynthAmountInput synth={vm.synthTo} mb={12} value={amountTo} readonly />
      <Button w="100%" colorScheme={"green"}>
        Confirm
      </Button>
    </Box>
  );
});
