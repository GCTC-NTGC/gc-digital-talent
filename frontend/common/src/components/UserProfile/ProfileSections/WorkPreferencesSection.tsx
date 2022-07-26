import React from "react";
import { useIntl } from "react-intl";
import { isEmpty } from "lodash";
import { getOperationalRequirement } from "../../../constants/localizedConstants";
import { Applicant } from "../../../api/generated";

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
        <li data-h2-font-weight="base(700)" key={opRequirement}>
          {opRequirement
            ? getOperationalRequirement(opRequirement).defaultMessage
            : ""}
        </li>
      ))
    : null;

  const anyCriteriaSelected = !isEmpty(acceptedOperationalArray);
  return (
    <div
      data-h2-background-color="base(light.dt-gray)"
      data-h2-padding="base(x1)"
      data-h2-radius="base(s)"
    >
      <div data-h2-flex-grid="base(flex-start, 0, x2, x1)">
        <div data-h2-flex-item="base(1of1)">
          {anyCriteriaSelected && (
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "I would consider accepting a job that lasts for:",
                description:
                  "Label for what length of position user prefers, followed by colon",
              })}
            </p>
          )}
          {wouldAcceptTemporary && (
            <ul data-h2-padding="base(0, 0, 0, x1)">
              <li data-h2-font-weight="base(700)">
                {intl.formatMessage({
                  defaultMessage:
                    "Any duration (short, long term, or indeterminate duration)",
                  description:
                    "Duration of any length is good, specified three example lengths",
                })}
              </li>
            </ul>
          )}
          {wouldAcceptTemporary === false && (
            <ul data-h2-padding="base(0, 0, 0, x1)">
              <li data-h2-font-weight="base(700)">
                {intl.formatMessage({
                  defaultMessage: "Permanent duration",
                  description: "Permanent duration only",
                })}{" "}
              </li>
            </ul>
          )}
        </div>
        <div data-h2-flex-item="base(1of1)">
          {anyCriteriaSelected && (
            <>
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
            </>
          )}
        </div>
        {!anyCriteriaSelected && editPath && (
          <div data-h2-flex-item="base(1of1)">
            <p>
              {intl.formatMessage({
                defaultMessage: "You haven't added any information here yet.",
                description: "Message for when no data exists for the section",
              })}
            </p>
            <p>
              {intl.formatMessage({
                defaultMessage: "There are <red>required</red> fields missing.",
                description:
                  "Message that there are required fields missing. Please ignore things in <> tags.",
              })}{" "}
              <a href={editPath}>
                {intl.formatMessage({
                  defaultMessage: "Click here to get started.",
                  description:
                    "Message to click on the words to begin something",
                })}
              </a>
            </p>
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
