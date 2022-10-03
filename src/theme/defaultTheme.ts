import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

export const defaultTheme = extendTheme({
  config,
  colors: {
    gray: {
      "50": "#EFF1F5",
      "100": "#D3D9E3",
      "200": "#B7C0D1",
      "300": "#9BA7BF",
      "400": "#7F8FAD",
      "500": "#64769B",
      "600": "#505F7C",
      "700": "#3C475D",
      "800": "#282F3E",
      "900": "#14181F",
    },
  },
});
