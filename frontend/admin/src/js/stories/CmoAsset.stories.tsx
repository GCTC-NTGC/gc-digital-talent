import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { CmoAsset } from "../api/generated";
import { UpdateCmoAssetForm } from "../components/cmoAsset/UpdateCmoAsset";

const stories = storiesOf("CMO Assets", module);

stories.add("Update CMO Asset Form", () => {
  const cmoAsset: CmoAsset = {
    id: "1",
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
        await new Promise((resolve) => {
          setTimeout(resolve, 1000);
        });
        action("Update CMO Asset")(data);
        return data;
      }}
    />
  );
});
