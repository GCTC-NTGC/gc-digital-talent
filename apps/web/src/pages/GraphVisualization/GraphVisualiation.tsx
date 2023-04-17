import * as React from "react";
import { Voyager } from "graphql-voyager";

function introspectionProvider(query: string) {
  return fetch(`${window.location.origin}/graphql`, {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  }).then((response) => response.json());
}

function GraphVisualizer() {
  return <Voyager introspection={introspectionProvider} />;
}

export default GraphVisualizer;
