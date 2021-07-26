import React from "react";
import { defineMessages, useIntl } from "react-intl";
import { Link } from "../helpers/router";
import { OperationalRequirementTableApi } from "./OperationalRequirementTable";

const messages = defineMessages({
  operationalRequirementCreateHeading: {
    id: "operationalRequirementPage.operationalRequirementCreateHeading",
    defaultMessage: "Create Operational Requirement",
    description:
      "Heading displayed above the Operational Requirement Table component.",
  },
});

export const OperationalRequirementPage: React.FC = () => {
  const intl = useIntl();
  return (
    <div>
      <Link href="/operational-requirements/create" title="">
        {intl.formatMessage(messages.operationalRequirementCreateHeading)}
      </Link>
      <OperationalRequirementTableApi />
    </div>
  );
};

export default OperationalRequirementPage;
