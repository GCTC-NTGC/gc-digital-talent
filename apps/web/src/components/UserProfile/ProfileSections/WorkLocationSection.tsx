import React from "react";
import { useIntl } from "react-intl";

import { Link, Well } from "@gc-digital-talent/ui";
import { commonMessages, getWorkRegion } from "@gc-digital-talent/i18n";
import { insertBetween } from "@gc-digital-talent/helpers";
import { User } from "@gc-digital-talent/graphql";

import {
  anyCriteriaSelected,
  hasAllEmptyFields,
  hasEmptyRequiredFields,
} from "~/validators/profile/workLocation";

const WorkLocationSection = ({
  user,
  editPath,
}: {
  user: User;
  editPath?: string;
}) => {
  const intl = useIntl();
  // generate array of location preferences localized and formatted with spaces/commas
  const regionPreferencesSquished = user.locationPreferences?.map((region) =>
    region ? intl.formatMessage(getWorkRegion(region)) : "",
  );
  const regionPreferences = regionPreferencesSquished
    ? insertBetween(", ", regionPreferencesSquished)
    : "";

  return (
    <Well>
      <div className="flex flex-col gap-y-6">
        {anyCriteriaSelected(user) && (
          <p>
            <span className="block">
              {intl.formatMessage({
                defaultMessage: "Work location:",
                id: "b5bUa0",
                description: "Work Location label, followed by colon",
              })}
            </span>
            <span className="font-bold">{regionPreferences}</span>
          </p>
        )}
        {!!user.locationExemptions && (
          <p>
            <span className="block">
              {intl.formatMessage({
                defaultMessage: "Work location exceptions",
                id: "OpKC2i",
                description: "Work location exceptions label",
              })}
              {intl.formatMessage(commonMessages.dividingColon)}
            </span>
            <span className="font-bold">{user.locationExemptions}</span>
          </p>
        )}
        {hasEmptyRequiredFields(user) && editPath && (
          <>
            <p>
              {intl.formatMessage({
                defaultMessage: "You haven't added any information here yet.",
                id: "SCCX7B",
                description: "Message for when no data exists for the section",
              })}
            </p>
            <p>
              {intl.formatMessage(commonMessages.requiredFieldsMissing)}{" "}
              <Link href={editPath}>
                {intl.formatMessage({
                  defaultMessage: "Edit your work location options.",
                  id: "F3/88e",
                  description: "Link text to edit work location on profile",
                })}
              </Link>
            </p>
          </>
        )}
        {hasAllEmptyFields(user) && !editPath && (
          <p>{intl.formatMessage(commonMessages.noInformationProvided)}</p>
        )}
      </div>
    </Well>
  );
};

export default WorkLocationSection;
