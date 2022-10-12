import { Box, ChakraProvider, Container, Stack } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { WalletButton } from "./features/wallet";
import { NavLink } from "./shared";
import { defaultTheme } from "./theme";

export const Layout = () => {
  return (
    <ChakraProvider theme={defaultTheme}>
      <Container maxW={"392px"}>
        <Box pt={4} pb={4}>
          <Stack direction="row" spacing={4} align="center">
            <NavLink to="/">Exchange</NavLink>
            <NavLink to="/portfolio">Portfolio</NavLink>
            <WalletButton />
          </Stack>
        </Box>
        <Box pt={8}>
          <Outlet />
        </Box>
      </Container>
    </ChakraProvider>
  );
};
