import React from "react";
import { useIntl } from "react-intl";

import { Heading, Well } from "@gc-digital-talent/ui";

import { JobLookingStatus } from "~/api/generated";

import { UserInformationProps } from "../types";
import AddToPoolDialog from "./AddToPoolDialog";
import PoolStatusTable from "./PoolStatusSection";

const CandidateStatusSection = ({ user, pools }: UserInformationProps) => {
  const intl = useIntl();

  return (
    <>
      <Heading level="h4" data-h2-margin="base(x2, 0, x1, 0)">
        {intl.formatMessage({
          defaultMessage: "Personal status",
          id: "4N6O+3",
          description:
            "Title of the 'Personal status' section of the view-user page",
        })}
      </Heading>
      <Well>
        {user.jobLookingStatus === JobLookingStatus.ActivelyLooking &&
          intl.formatMessage({
            defaultMessage:
              "<heavyPrimary>Active</heavyPrimary> - Wants to be contacted for job opportunities",
            id: "uv0RmD",
            description:
              "Text in view user page saying they currently have the 'Active' status",
          })}
        {user.jobLookingStatus === JobLookingStatus.OpenToOpportunities &&
          intl.formatMessage({
            defaultMessage:
              "<heavyPrimary>Open to opportunities</heavyPrimary> - Not actively looking but still wants to be contacted for job opportunities",
            id: "BqQrcn",
            description:
              "Text in view user page saying they currently have the 'Open to opportunities' status",
          })}
        {user.jobLookingStatus === JobLookingStatus.Inactive &&
          intl.formatMessage({
            defaultMessage:
              "<heavyPrimary>Inactive</heavyPrimary> - Does not want to be contacted for job opportunities",
            id: "4pAtT5",
            description:
              "Text in view user page saying they currently have the 'Inactive' status",
          })}
      </Well>
      <Heading level="h4" data-h2-margin="base(x2, 0, x1, 0)">
        {intl.formatMessage({
          defaultMessage: "Pool status",
          id: "hIaETV",
          description:
            "Title of the 'Pool status' section of the view-user page",
        })}
      </Heading>
      <PoolStatusTable user={user} pools={pools} />
      <h5 data-h2-margin="base(x2, 0, x1, 0)">
        {intl.formatMessage({
          defaultMessage: "Add user to pool",
          id: "jtEouE",
          description:
            "Title of the 'Add user to pools' section of the view-user page",
        })}
      </h5>
      <AddToPoolDialog user={user} pools={pools} />
    </>
  );
};

export default CandidateStatusSection;
