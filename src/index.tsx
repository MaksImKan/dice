import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Dice } from "./screens/Dice/Dice";

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <Dice />
  </StrictMode>,
);
