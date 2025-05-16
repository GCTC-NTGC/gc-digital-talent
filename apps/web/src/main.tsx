import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import messages from "~/lang/frCompiled.json";
import ContextContainer from "~/components/Context/ContextProvider";
import Router from "~/components/Router";
import "~/assets/css/app.css";
import "~/assets/css/tailwind.css";

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(
    <StrictMode>
      <ContextContainer messages={messages}>
        <Router />
      </ContextContainer>
    </StrictMode>,
  );
}
