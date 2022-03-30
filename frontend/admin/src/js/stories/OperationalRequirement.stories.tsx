import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { fakeOperationalRequirements } from "@common/fakeData";
import { OperationalRequirementTable } from "../components/operationalRequirement/OperationalRequirementTable";
import { CreateOperationalRequirementForm } from "../components/operationalRequirement/CreateOperationalRequirement";
import {
  CreateOperationalRequirementInput,
  OperationalRequirement,
} from "../api/generated";
import { UpdateOperationalRequirementForm } from "../components/operationalRequirement/UpdateOperationalRequirement";

const operationalRequirementData = fakeOperationalRequirements();

const stories = storiesOf("Operational Requirements", module);

stories.add("Operational Requirements Table", () => (
  <OperationalRequirementTable
    operationalRequirements={operationalRequirementData}
    editUrlRoot="#"
  />
));

stories.add("Create Operational Requirement Form", () => {
  return (
    <CreateOperationalRequirementForm
      handleCreateOperationalRequirement={async (
        data: CreateOperationalRequirementInput,
      ) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        action("Create Operational Requirement")(data);
        return data;
      }}
    />
  );
});

stories.add("Update Operational Requirement Form", () => {
  const operationalRequirement: OperationalRequirement = {
    id: "1",
    key: "overtime",
    name: {
      en: "Overtime",
      fr: "Overtime FR",
    },
    description: {
      en: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptatem, itaque?",
      fr: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptatem, itaque?",
    },
  };
  return (
    <UpdateOperationalRequirementForm
      initialOperationalRequirement={operationalRequirement}
      handleUpdateOperationalRequirement={async (id, data) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        action("Update Operational Requirement")(data);
        return data;
      }}
    />
  );
});
