import React from "react";
import type { Meta, Story } from "@storybook/react";
import { fakeSearchRequests } from "@common/fakeData";

import { PoolCandidateSearchRequest } from "../../api/generated";
import { LatestRequestsTable } from "./LatestRequestsTable";

const requestData = fakeSearchRequests();

export default {
  component: LatestRequestsTable,
  title: "Latest Requests Table",
  args: {
    requests: requestData,
  },
} as Meta;

const TemplateLatestRequestsTable: Story<{
  requests: PoolCandidateSearchRequest[];
}> = ({ requests }) => (
  <LatestRequestsTable
    data={{
      latestPoolCandidateSearchRequests: requests,
    }}
  />
);

export const FullLatestRequestsTable = TemplateLatestRequestsTable.bind({});
