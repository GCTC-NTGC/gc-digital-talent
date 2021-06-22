import React from "react";
import { storiesOf } from "@storybook/react";
import { createClient } from "urql";
import { CmoAssetTable, CmoAssetTableApi } from "../components/CmoAssetTable";
import fakeCmoAssets from "../fakeData/fakeCmoAssets";
import ClientProvider from "../components/ClientProvider";

const cmoAssetData = fakeCmoAssets();

const stories = storiesOf("CMO Assets", module);

stories.add("CMO Assets Table", () => (
  <CmoAssetTable cmoAssets={cmoAssetData} />
));

const client = createClient({
  url: "http://localhost:8000/graphql",
});

stories.add("CMO Assets Table with API data", () => (
  <ClientProvider client={client}>
    <CmoAssetTableApi />
  </ClientProvider>
));
