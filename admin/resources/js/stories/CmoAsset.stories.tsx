import React from "react";
import { storiesOf } from "@storybook/react";
import { createClient } from "urql";
import { action } from "@storybook/addon-actions";
import {
  CmoAssetTable,
  CmoAssetTableApi,
} from "../components/cmoAsset/CmoAssetTable";
import fakeCmoAssets from "../fakeData/fakeCmoAssets";
import ClientProvider from "../components/ClientProvider";
import { CreateCmoAssetForm } from "../components/cmoAsset/CreateCmoAsset";
import { CmoAsset, CreateCmoAssetInput } from "../api/generated";
import { UpdateCmoAssetForm } from "../components/cmoAsset/UpdateCmoAsset";

const cmoAssetData = fakeCmoAssets();

const stories = storiesOf("CMO Assets", module);

stories.add("CMO Assets Table", () => (
  <CmoAssetTable cmoAssets={cmoAssetData} editUrlRoot="#" />
));

const client = createClient({
  url: "http://localhost:8000/graphql",
});

stories.add("CMO Assets Table with API data", () => (
  <ClientProvider client={client}>
    <CmoAssetTableApi />
  </ClientProvider>
));

stories.add("Create CMO Asset Form", () => {
  return (
    <CreateCmoAssetForm
      handleCreateCmoAsset={async (data: CreateCmoAssetInput) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        action("Create CMO Asset")(data);
        return data;
      }}
    />
  );
});

stories.add("Update CMO Asset Form", () => {
  const cmoAsset: CmoAsset = {
    id: 1,
    key: "web_development",
    name: {
      en: "Web Development",
      fr: "Web Development FR",
    },
    description: {
      en: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptatem, itaque?",
      fr: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptatem, itaque?",
    },
  };
  return (
    <UpdateCmoAssetForm
      initialCmoAsset={cmoAsset}
      handleUpdateCmoAsset={async (id, data) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        action("Update CMO Asset")(data);
        return data;
      }}
    />
  );
});
