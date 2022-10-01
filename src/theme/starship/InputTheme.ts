import { ComponentStyleConfig } from "@chakra-ui/react";

export const InputTheme: ComponentStyleConfig = {
  variants: {
    outline: {
      field: {
        h: 16,
        fontSize: "lg",
        borderRadius: "sm",
        border: "1px solid",
        borderColor: "background.900",
        bg: "background.900",
        color: "text.200",
        _hover: {
          borderColor: "brand.500",
        },
        _focusVisible: {
          outline: "none",
          boxShadow: "none",
          borderColor: "brand.500",
        },
      },
    },
  },
};
