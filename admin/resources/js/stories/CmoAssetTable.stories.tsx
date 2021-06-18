import React from "react";
import { storiesOf } from "@storybook/react";
import { createClient } from "urql";
import CmoAssetTable from "../components/CmoAssetTable";
import fakeCmoAssets from "../fakeData/fakeCmoAssets";
import { useGetCmoAssetsQuery } from "../api/generated";
import ClientProvider from "../components/ClientProvider";

const cmoAssetData = fakeCmoAssets();

const stories = storiesOf("CMO Assets", module);

stories.add("CMO Assets Table", () => (
  <CmoAssetTable cmoAssets={cmoAssetData} />
));

const client = createClient({
  url: "http://localhost:8000/graphql",
});
const ApiCmoAssetTable = () => {
  const [result] = useGetCmoAssetsQuery();
  const { data, fetching, error } = result;

  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Oh no... {error.message}</p>;

  return <CmoAssetTable cmoAssets={data?.cmoAssets ?? []} />;
};
stories.add("CMO Assets Table with API data", () => (
  <ClientProvider client={client}>
    <ApiCmoAssetTable />
  </ClientProvider>
));
