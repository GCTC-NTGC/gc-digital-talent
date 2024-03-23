import React from "react";
import { createRoot } from "react-dom/client";

import * as messages from "~/lang/frCompiled.json";
import ContextContainer from "~/components/Context/ContextProvider";
import Router from "~/components/Router";
import "~/assets/css/app.css";

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <ContextContainer messages={messages}>
        <Router />
      </ContextContainer>
    </React.StrictMode>,
  );
}
