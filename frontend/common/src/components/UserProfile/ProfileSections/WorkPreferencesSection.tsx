import React from "react";
import { useIntl } from "react-intl";
import { isEmpty } from "lodash";
import messages from "../../../messages/commonMessages";
import { getOperationalRequirement } from "../../../constants/localizedConstants";
import { Applicant, OperationalRequirement } from "../../../api/generated";

const WorkPreferencesSection: React.FunctionComponent<{
  applicant: Pick<
    Applicant,
    "acceptedOperationalRequirements" | "wouldAcceptTemporary"
  >;
  editPath?: string;
}> = ({ applicant, editPath }) => {
  const intl = useIntl();
  const { acceptedOperationalRequirements, wouldAcceptTemporary } = applicant;

  // generate array of accepted operational requirements
  const acceptedOperationalArray = acceptedOperationalRequirements
    ? acceptedOperationalRequirements.map((opRequirement) => (
        <li key={opRequirement}>
          {opRequirement
            ? intl.formatMessage(getOperationalRequirement(opRequirement))
            : ""}
        </li>
      ))
    : null;

  const anyCriteriaSelected = !isEmpty(acceptedOperationalArray);

  // all V2 operational requirements
  const operationalRequirementsSubsetV2 = [
    OperationalRequirement.OvertimeOccasional,
    OperationalRequirement.OvertimeRegular,
    OperationalRequirement.ShiftWork,
    OperationalRequirement.OnCall,
    OperationalRequirement.Travel,
    OperationalRequirement.TransportEquipment,
    OperationalRequirement.DriversLicense,
  ];

  // requirements that have not been selected made into an array
  const unselectedOperationalArray = operationalRequirementsSubsetV2.filter(
    (requirement) => !acceptedOperationalRequirements?.includes(requirement),
  );

  // generate list of unaccepted operational requirements
  const unacceptedOperationalArray = unselectedOperationalArray
    ? unselectedOperationalArray.map((opRequirement) => (
        <li key={opRequirement}>
          {opRequirement
            ? getOperationalRequirement(opRequirement).defaultMessage
            : ""}
        </li>
      ))
    : null;

  return (
    <div
      data-h2-background-color="base(light.dt-gray)"
      data-h2-padding="base(x1)"
      data-h2-radius="base(s)"
    >
      <div data-h2-flex-grid="base(flex-start, 0, x2, x1)">
        {wouldAcceptTemporary === null && (
          <div data-h2-flex-item="base(1of1)">
            <p>
              {intl.formatMessage({
                defaultMessage: "You haven't added any information here yet.",
                description: "Message for when no data exists for the section",
              })}
            </p>
            <p>
              {intl.formatMessage(messages.requiredFieldsMissing)}{" "}
              <a href={editPath}>
                {intl.formatMessage({
                  defaultMessage: "Edit your work preference options.",
                  description: "Link text to edit work preferences on profile",
                })}
              </a>
            </p>
          </div>
        )}

        {wouldAcceptTemporary && (
          <div data-h2-flex-item="base(1of1)">
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "I would consider accepting a job that lasts for:",
                description:
                  "Label for what length of position user prefers, followed by colon",
              })}
            </p>
            <ul data-h2-padding="base(0, 0, 0, x1)">
              <li>
                {intl.formatMessage({
                  defaultMessage:
                    "Any duration (short, long term, or indeterminate duration)",
                  description:
                    "Duration of any length is good, specified three example lengths",
                })}
              </li>
            </ul>
          </div>
        )}

        {wouldAcceptTemporary === false && (
          <div data-h2-flex-item="base(1of1)">
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "I would consider accepting a job that lasts for:",
                description:
                  "Label for what length of position user prefers, followed by colon",
              })}
            </p>
            <ul data-h2-padding="base(0, 0, 0, x1)">
              <li>
                {intl.formatMessage({
                  defaultMessage: "Permanent duration",
                  description: "Permanent duration only",
                })}{" "}
              </li>
            </ul>
          </div>
        )}

        {anyCriteriaSelected && !isEmpty(unacceptedOperationalArray) && (
          <div data-h2-flex-item="base(1of1)">
            <p>
              {intl.formatMessage({
                defaultMessage: "I would consider accepting a job that:",
                description:
                  "Label for what conditions a user will accept, followed by a colon",
              })}
            </p>
            <ul data-h2-padding="base(0, 0, 0, x1)">
              {acceptedOperationalArray}
            </ul>
          </div>
        )}
        {anyCriteriaSelected && !isEmpty(unacceptedOperationalArray) && (
          <div data-h2-flex-item="base(1of1)">
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "I would <strong>not consider</strong> accepting a job that:",
                description:
                  "would not accept job line before a list, ignore things in <> please",
              })}
            </p>
            <ul data-h2-padding="base(0, 0, 0, x1)">
              {unacceptedOperationalArray}
            </ul>
          </div>
        )}

        {anyCriteriaSelected && isEmpty(unacceptedOperationalArray) && (
          <div data-h2-flex-item="base(1of1)">
            <p>
              {intl.formatMessage({
                defaultMessage: "I would consider accepting a job that:",
                description:
                  "Label for what conditions a user will accept, followed by a colon",
              })}
            </p>
            <ul data-h2-padding="base(0, 0, 0, x1)">
              {acceptedOperationalArray}
            </ul>
          </div>
        )}

        {!anyCriteriaSelected && editPath && (
          <div data-h2-flex-item="base(1of1)">
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "I would <strong>not consider</strong> accepting a job that:",
                description:
                  "would not accept job line before a list, ignore things in <> please",
              })}
            </p>
            <ul data-h2-padding="base(0, 0, 0, x1)">
              {unacceptedOperationalArray}
            </ul>
          </div>
        )}

        {!anyCriteriaSelected && !editPath && (
          <div data-h2-flex-item="base(1of1)">
            <p>
              {intl.formatMessage({
                defaultMessage: "No information has been provided.",
                description:
                  "Message on Admin side when user not filled WorkPreferences section.",
              })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkPreferencesSection;
