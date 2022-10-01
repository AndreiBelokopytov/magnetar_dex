import { ChakraProvider } from "@chakra-ui/react";
import styled from "styled-components";
import { WalletButton } from "./features/wallet";

const AppHeader = styled.div`
  display: flex;
  width: 100%;
  padding: 16px;
`;

const Spacer = styled.div`
  flex: 1;
`;

export const App = () => {
  return (
    <ChakraProvider>
      <AppHeader>
        <Spacer />
        <WalletButton />
      </AppHeader>
    </ChakraProvider>
  );
};
