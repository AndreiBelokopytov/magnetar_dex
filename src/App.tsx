import { ChakraProvider, Container, Center, Box } from "@chakra-ui/react";
import { ExchangeForm } from "./features/exchange";
import { WalletButton } from "./features/wallet";
import { starshipTheme } from "./theme";

export const App = () => {
  return (
    <ChakraProvider theme={starshipTheme}>
      <Container maxW={"392px"}>
        <Box pt={4} pb={4}>
          <Center>
            <WalletButton />
          </Center>
        </Box>
        <Box pt={8}>
          <ExchangeForm />
        </Box>
      </Container>
    </ChakraProvider>
  );
};
