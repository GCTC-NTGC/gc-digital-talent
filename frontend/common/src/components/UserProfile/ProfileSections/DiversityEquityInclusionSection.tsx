import React from "react";
import { useIntl } from "react-intl";
import { getEmploymentEquityStatement } from "../../../constants";
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
      data-h2-background-color="base(light.dt-gray)"
      data-h2-padding="base(x1)"
      data-h2-radius="base(s)"
    >
      <div data-h2-flex-grid="base(flex-start, 0, x2, x1)">
        {!anyCriteriaSelected && editPath && (
          <div data-h2-flex-item="base(1of1)">
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "You have not identified as a member of any employment equity groups.",
                id: "vpAafL",
                description:
                  "Message indicating the user has not been marked as part of an equity group, Ignore things in <> please.",
              })}
            </p>
            <p data-h2-margin="base(x.5, 0, 0, 0)">
              <a href={editPath}>
                {intl.formatMessage({
                  defaultMessage:
                    "Edit your diversity, equity and inclusion options.",
                  id: "RggAL8",
                  description:
                    "Link text to edit diversity, equity and inclusion information on profile.",
                })}
              </a>
            </p>
          </div>
        )}
        {!anyCriteriaSelected && !editPath && (
          <div data-h2-flex-item="base(1of1)">
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "I am not identified as a member of any employment equity groups.",
                id: "QjOom4",
                description:
                  "Message on Admin side when user not filled DiversityEquityInclusion section.",
              })}
            </p>
          </div>
        )}
        {anyCriteriaSelected && (
          <div data-h2-flex-item="base(1of1)">
            <p>
              {intl.formatMessage({
                defaultMessage: "My employment equity information:",
                id: "5WOqlf",
                description:
                  "Label preceding what groups the user identifies as part of, followed by a colon",
              })}{" "}
            </p>{" "}
            <ul
              data-h2-font-weight="base(700)"
              data-h2-padding="base(0, 0, 0, x1)"
            >
              {isWoman && (
                <li>
                  {intl.formatMessage(getEmploymentEquityStatement("woman"))}
                </li>
              )}
              {isIndigenous && (
                <li>
                  {intl.formatMessage(
                    getEmploymentEquityStatement("indigenous"),
                  )}
                </li>
              )}{" "}
              {isVisibleMinority && (
                <li>
                  {intl.formatMessage(getEmploymentEquityStatement("minority"))}
                </li>
              )}{" "}
              {hasDisability && (
                <li>
                  {intl.formatMessage(
                    getEmploymentEquityStatement("disability"),
                  )}
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiversityEquityInclusionSection;
