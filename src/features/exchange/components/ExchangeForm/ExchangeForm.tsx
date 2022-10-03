import { Box, Button, Text } from "@chakra-ui/react";
import { observer } from "mobx-react";
import { useAsyncObservable, useInjectedInstance } from "../../../../shared";
import { ExchangeFormVM } from "./ExchangeForm.vm";
import { SynthAmountInput } from "./SynthAmountInput";
import { useEffect } from "react";

export const ExchangeForm = observer(() => {
  const vm = useInjectedInstance(ExchangeFormVM);

  const balanceFrom = useAsyncObservable(vm.balanceFrom);

  useEffect(() => {
    vm.init();
  }, [vm]);

  if (!vm.synthFrom || !vm.synthTo) {
    return null;
  }

  return (
    <Box padding={6} borderRadius="md" bg="background.800">
      <Text as="h3" fontSize="lg" fontWeight={"bold"} mb={6}>
        Exchange
      </Text>
      <SynthAmountInput
        synth={vm.synthFrom}
        size="md"
        mb={6}
        balance={balanceFrom}
      />
      <SynthAmountInput synth={vm.synthTo} size="md" mb={12} />
      <Button w="100%" colorScheme={"green"}>
        Confirm
      </Button>
    </Box>
  );
});
