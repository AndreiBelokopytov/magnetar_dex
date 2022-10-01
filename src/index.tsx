import "./polyfills";
import { App } from "./App";
import { createRoot } from "react-dom/client";

const rootElement = document.getElementById("root");

if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<App />);
} else {
  throw "Root element is not defined";
}
