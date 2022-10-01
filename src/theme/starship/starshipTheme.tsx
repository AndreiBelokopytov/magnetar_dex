import { extendTheme } from "@chakra-ui/react";
import { ButtonTheme } from "./ButtonTheme";
import { InputTheme } from "./InputTheme";

export const starshipTheme = extendTheme({
  colors: {
    brand: {
      50: "#e0fff3",
      100: "#b8f7dd",
      200: "#8defc5",
      300: "#62e9a9",
      400: "#39e39c",
      500: "#21ca8e",
      600: "#169d78",
      700: "#0b705c",
      800: "#01443d",
      900: "#001813",
    },
    background: {
      50: "#ecf1fb",
      100: "#cfd5e3",
      200: "#b0b9cd",
      300: "#919db9",
      400: "#7281a5",
      500: "#59678b",
      600: "#45506d",
      700: "#31394e",
      800: "#1c2230",
      900: "#090b15",
    },
    text: {
      50: "#f2f2f3",
      100: "#d9d9d9",
      200: "#bfbfbf",
      300: "#a5a5a5",
      400: "#8b8b8b",
      500: "#727272",
      600: "#585858",
      700: "#404040",
      800: "#262626",
      900: "#0c0d0d",
    },
  },
  fonts: {
    body: "Poppins, sans-serif",
    heading: "Poppins, sans-serif",
  },
  fontSizes: {
    xs: "12px",
    sm: "14px",
    md: "16px",
    lg: "18px",
    xl: "24px",
    "2xl": "32px",
  },
  radii: {
    sm: "8px",
    md: "16px",
    lg: "40px",
  },
  components: {
    Button: ButtonTheme,
    Input: InputTheme,
  },
  styles: {
    global: {
      body: {
        fontFamily: "body",
        bg: "background.900",
        color: "text.100",
      },
    },
  },
});
