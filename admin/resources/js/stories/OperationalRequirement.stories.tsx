import React from "react";
import { storiesOf } from "@storybook/react";
import { createClient } from "urql";
import { action } from "@storybook/addon-actions";
import {
  OperationalRequirementTable,
  OperationalRequirementTableApi,
} from "../components/OperationalRequirementTable";
import fakeOperationalRequirements from "../fakeData/fakeOperationalRequirements";
import ClientProvider from "../components/ClientProvider";
import { CreateOperationalRequirementForm } from "../components/operationalRequirements/CreateOperationalRequirement";
import {
  CreateOperationalRequirementInput,
  OperationalRequirement,
  UpdateOperationalRequirementInput,
} from "../api/generated";
import { UpdateOperationalRequirementForm } from "../components/operationalRequirements/UpdateOperationalRequirement";

const operationalRequirementData = fakeOperationalRequirements();

const stories = storiesOf("Operational Requirements", module);

stories.add("Operational Requirements Table", () => (
  <OperationalRequirementTable
    operationalRequirements={operationalRequirementData}
  />
));

const client = createClient({
  url: "http://localhost:8000/graphql",
});

stories.add("Operational Requirements Table with API data", () => (
  <ClientProvider client={client}>
    <OperationalRequirementTableApi />
  </ClientProvider>
));

stories.add("Create Operational Requirement Form", () => {
  return (
    <CreateOperationalRequirementForm
      handleCreateOperationalRequirement={async (
        data: CreateOperationalRequirementInput,
      ) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        action("Create Cmo Asset")(data);
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
      handleUpOperationalRequirement={async (id, data) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        action("Update Operational Requirement Asset")(data);
        return data;
      }}
    />
  );
});
