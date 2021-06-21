import React from "react";
import { storiesOf } from "@storybook/react";
import { createClient } from "urql";
import OperationalRequirementTable from "../components/OperationalRequirementTable";
import fakeOperationalRequirements from "../fakeData/fakeOperationalRequirements";
import { useGetOperationalRequirementsQuery } from "../api/generated";
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
const ApiOperationalRequirementTable = () => {
  const [result] = useGetOperationalRequirementsQuery();
  const { data, fetching, error } = result;

  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Oh no... {error.message}</p>;

  return (
    <OperationalRequirementTable
      operationalRequirements={data?.operationalRequirements ?? []}
    />
  );
};
stories.add("Operational Requirements Table with API data", () => (
  <ClientProvider client={client}>
    <ApiOperationalRequirementTable />
  </ClientProvider>
));
