import React from "react";
import { useIntl } from "react-intl";
import { getEmploymentEquityStatement } from "../../../constants/localizedConstants";
import { Applicant } from "../../../api/generated";

const DiversityEquityInclusionSection: React.FunctionComponent<{
  applicant: Pick<
    Applicant,
    "isWoman" | "hasDisability" | "isIndigenous" | "isVisibleMinority"
  >;
  editPath?: string;
}> = ({ applicant, editPath }) => {
  const intl = useIntl();

  const { isWoman, hasDisability, isIndigenous, isVisibleMinority } = applicant;
  const anyCriteriaSelected =
    isWoman || isIndigenous || isVisibleMinority || hasDisability;

  return (
    <div
      data-h2-bg-color="b(lightgray)"
      data-h2-padding="b(all, m)"
      data-h2-radius="b(s)"
    >
      {!anyCriteriaSelected && editPath && (
        <>
          <p>
            {intl.formatMessage({
              defaultMessage:
                "You have not identified as a member of any employment equity groups.",
              description:
                "Message indicating the user has not been marked as part of an equity group, Ignore things in <> please.",
            })}
          </p>
          <p>
            <a href={editPath}>
              {intl.formatMessage({
                defaultMessage: "Click here to get started.",
                description: "Message to click on the words to begin something",
              })}
            </a>
          </p>
        </>
      )}
      {!anyCriteriaSelected && !editPath && (
        <p>
          {intl.formatMessage({
            defaultMessage:
              "I am not identified as a member of any employment equity groups.",
            description:
              "Message on Admin side when user not filled DiversityEquityInclusion section.",
          })}
        </p>
      )}
      {anyCriteriaSelected && (
        <div>
          <p>
            {intl.formatMessage({
              defaultMessage: "My employment equity information:",
              description:
                "Label preceding what groups the user identifies as part of, followed by a colon",
            })}{" "}
          </p>{" "}
          <ul data-h2-padding="b(left, l)">
            {isWoman && (
              <li>
                {intl.formatMessage(getEmploymentEquityStatement("woman"))}
              </li>
            )}
            {isIndigenous && (
              <li>
                {intl.formatMessage(getEmploymentEquityStatement("indigenous"))}
              </li>
            )}
            {isVisibleMinority && (
              <li>
                {intl.formatMessage(getEmploymentEquityStatement("minority"))}
              </li>
            )}
            {hasDisability && (
              <li>
                {intl.formatMessage(getEmploymentEquityStatement("disability"))}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DiversityEquityInclusionSection;
