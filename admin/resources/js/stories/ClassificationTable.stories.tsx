import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { createClient } from "urql";
import ClassificationTable from "../components/ClassificationsTable";
import fakeClassifications from "../fakeData/fakeClassifications";
import { useGetClassificationsQuery } from "../api/generated";
import ClientProvider from "../components/ClientProvider";

const classificationData = fakeClassifications();
// Its possible data may come back from api with missing data.

const stories = storiesOf("Classifications", module);

stories.add("Classifications Table", () => (
  <ClassificationTable classifications={classificationData} />
));

const client = createClient({
  url: "http://localhost:8000/graphql",
});
const ApiClassificationTable = () => {
  const [result, _reexecuteQuery] = useGetClassificationsQuery();
  const { data, fetching, error } = result;

  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Oh no... {error.message}</p>;

  return <ClassificationTable classifications={data?.classifications ?? []} />;
};
stories.add("Classifications Table with API data", () => (
  <ClientProvider client={client}>
    <ApiClassificationTable />
  </ClientProvider>
));
