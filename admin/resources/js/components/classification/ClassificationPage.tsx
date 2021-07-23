import React from "react";
import { defineMessages, useIntl } from "react-intl";
import { Link } from "../../helpers/router";
import { ClassificationTableApi } from "./ClassificationTable";

const messages = defineMessages({
  classificationCreateHeading: {
    id: "classificationPage.classificationCreateHeading",
    defaultMessage: "Create Classification",
    description: "Heading displayed above the Classification Table component.",
  },
});

export const ClassificationPage: React.FC = () => {
  const intl = useIntl();
  return (
    <div>
      <Link href="/classifications/create" title="">
        {intl.formatMessage(messages.classificationCreateHeading)}
      </Link>
      <ClassificationTableApi />
    </div>
  );
};

export default ClassificationPage;
