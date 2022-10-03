import "./polyfills";
import { App } from "./App";
import { createRoot } from "react-dom/client";
import { ColorModeScript } from "@chakra-ui/react";
import { defaultTheme } from "./theme";

const rootElement = document.getElementById("root");

if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <>
      <ColorModeScript
        initialColorMode={defaultTheme.config.initialColorMode}
      />
      <App />
    </>
  );
} else {
  throw "Root element is not defined";
}
