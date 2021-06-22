import React from "react";
import { storiesOf } from "@storybook/react";
import { createClient } from "urql";
import {
  OperationalRequirementTable,
  OperationalRequirementTableApi,
} from "../components/OperationalRequirementTable";
import fakeOperationalRequirements from "../fakeData/fakeOperationalRequirements";
import ClientProvider from "../components/ClientProvider";

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
