import { Box, Button, Text } from "@chakra-ui/react";
import { SynthAmountInput } from "./SynthAmountInput";

export const ExchangeForm = () => {
  return (
    <Box padding={6} borderRadius="md" bg="background.800">
      <Text as="h3" fontSize="lg" fontWeight={"bold"} mb={6}>
        Exchange
      </Text>
      <SynthAmountInput label={"From"} size="md" mb={6}></SynthAmountInput>
      <SynthAmountInput label={"To"} size="md" mb={12}></SynthAmountInput>
      <Button w="100%">Confirm</Button>
    </Box>
  );
};
