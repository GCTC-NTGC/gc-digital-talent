import React from "react";
import { useIntl } from "react-intl";
import { getOperationalRequirement } from "../../../constants/localizedConstants";
import { Applicant } from "../../../api/generated";

// styling a text bit with red colour within intls
function redText(msg: string) {
  return <span data-h2-font-color="b(red)">{msg}</span>;
}

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
        <li data-h2-font-weight="b(700)" key={opRequirement}>
          {opRequirement
            ? getOperationalRequirement(opRequirement).defaultMessage
            : ""}
        </li>
      ))
    : null;
  return (
    <div
      data-h2-bg-color="b(lightgray)"
      data-h2-padding="b(all, m)"
      data-h2-radius="b(s)"
    >
      {wouldAcceptTemporary !== null && (
        <p>
          {intl.formatMessage({
            defaultMessage: "I would consider accepting a job that lasts for:",
            description:
              "Label for what length of position user prefers, followed by colon",
          })}{" "}
        </p>
      )}
      {wouldAcceptTemporary && (
        <ul data-h2-padding="b(left, l)">
          <li data-h2-font-weight="b(700)">
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
        <ul data-h2-padding="b(left, l)">
          <li data-h2-font-weight="b(700)">
            {intl.formatMessage({
              defaultMessage: "Permanent duration",
              description: "Permanent duration only",
            })}{" "}
          </li>
        </ul>
      )}

      {acceptedOperationalArray !== null &&
        acceptedOperationalArray.length > 0 && (
          <p>
            {intl.formatMessage({
              defaultMessage: "I would consider accepting a job that:",
              description:
                "Label for what conditions a user will accept, followed by a colon",
            })}
          </p>
        )}
      <ul data-h2-padding="b(left, l)">{acceptedOperationalArray}</ul>
      {wouldAcceptTemporary === null && (
        <p>
          {intl.formatMessage({
            defaultMessage: "You haven't added any information here yet.",
            description: "Message for when no data exists for the section",
          })}
        </p>
      )}
      {wouldAcceptTemporary === null && (
        <p>
          {intl.formatMessage(
            {
              defaultMessage:
                "There are <redText>required</redText> fields missing.",
              description:
                "Message that there are required fields missing. Please ignore things in <> tags.",
            },
            {
              redText,
            },
          )}{" "}
          <a href={editPath}>
            {intl.formatMessage({
              defaultMessage: "Click here to get started.",
              description: "Message to click on the words to begin something",
            })}
          </a>
        </p>
      )}
    </div>
  );
};

export default WorkPreferencesSection;
