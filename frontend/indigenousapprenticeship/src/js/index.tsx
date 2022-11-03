import React from "react";
import ReactDOM from "react-dom";
import Router from "./components/Router";

import ClientProvider from "./components/ClientProvider";

ReactDOM.render(
  <ClientProvider>
    <Router />
  </ClientProvider>,
  document.getElementById("app"),
);
