import React from "react";
import { storiesOf } from "@storybook/react";
import {
  ClassificationTable,
  ClassificationTableApi,
} from "../components/ClassificationTable";
import fakeClassifications from "../fakeData/fakeClassifications";
import ClientProvider from "../components/ClientProvider";
import { createClient } from "urql";

const classificationData = fakeClassifications();
// Its possible data may come back from api with missing data.

const stories = storiesOf("Classifications", module);

stories.add("Classifications Table", () => (
  <ClassificationTable classifications={classificationData} />
));
const client = createClient({
  url: "http://localhost:8000/graphql",
});
stories.add("Classifications Table with API data", () => (
  <ClientProvider client={client}>
    <ClassificationTableApi />
  </ClientProvider>
));
