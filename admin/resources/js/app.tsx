import React from "react";
import ReactDOM from "react-dom";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import AdminPage from "./components/AdminPage";

const client = new ApolloClient({
  uri: process.env.API_URI,
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <AdminPage />
  </ApolloProvider>,
  document.getElementById("app"),
);
