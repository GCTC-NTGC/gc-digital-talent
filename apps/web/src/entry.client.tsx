// app/entry.client.tsx
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";

console.log("1. Entry point reached");

window.addEventListener("unhandledrejection", (event) => {
  console.error("2. UNHANDLED PROMISE:", event.reason);
});

try {
  hydrateRoot(document, <HydratedRouter />);
  console.log("3. hydrateRoot called");
} catch (e) {
  console.error("4. HYDRATION ERROR:", e);
}
