import type { ComponentStyleConfig } from "@chakra-ui/theme";

export const ButtonTheme: ComponentStyleConfig = {
  baseStyle: {
    borderRadius: "lg",
    fontWeight: "medium",
  },
  sizes: {
    sm: {
      h: "10",
      minW: "10",
      fontSize: "sm",
      px: "6",
    },
  },
  variants: {
    outline: {
      _hover: {
        bg: "brand.800",
      },
    },
    solid: {
      color: "text.800",
    },
  },
  defaultProps: {
    colorScheme: "brand",
    variant: "solid",
    size: "sm",
  },
};
