import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { ClassificationTable } from "../components/classification/ClassificationTable";
import fakeClassifications from "../fakeData/fakeClassifications";
import { CreateClassificationForm } from "../components/classification/CreateClassification";
import {
  Classification,
  CreateClassificationInput,
  UpdateClassificationInput,
} from "../api/generated";
import { UpdateClassificationForm } from "../components/classification/UpdateClassification";

const classificationData = fakeClassifications();

const stories = storiesOf("Classifications", module);

stories.add("Classifications Table", () => (
  <ClassificationTable classifications={classificationData} editUrlRoot="#" />
));

stories.add("Create Classification Form", () => (
  <CreateClassificationForm
    handleCreateClassification={async (data: CreateClassificationInput) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      action("Create Classification")(data);
      return data;
    }}
  />
));

stories.add("Update Classification Form", () => {
  const initialClassification: Classification = classificationData[0];

  return (
    <UpdateClassificationForm
      initialClassification={initialClassification}
      handleUpdateClassification={async (
        id: string,
        data: UpdateClassificationInput,
      ) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        action("Create Classification")(data);
        return data;
      }}
    />
  );
});
