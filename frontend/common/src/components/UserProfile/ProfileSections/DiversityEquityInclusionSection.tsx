import React from "react";
import { useIntl } from "react-intl";
import {
  disabilityLocalized,
  indigenousLocalized,
  minorityLocalized,
  womanLocalized,
} from "../../../constants/localizedConstants";
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
                description:
                  "Message indicating the user has not been marked as part of an equity group, Ignore things in <> please.",
              })}
            </p>
            <p data-h2-margin="base(x.5, 0, 0, 0)">
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
                defaultMessage:
                  "I am not identified as a member of any employment equity groups.",
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
                description:
                  "Label preceding what groups the user identifies as part of, followed by a colon",
              })}{" "}
            </p>{" "}
            <ul
              data-h2-font-weight="base(700)"
              data-h2-padding="base(0, 0, 0, x1)"
            >
              {isIndigenous && (
                <li>&quot;{indigenousLocalized.defaultMessage}&quot;</li>
              )}{" "}
              {isVisibleMinority && (
                <li>&quot;{minorityLocalized.defaultMessage}&quot;</li>
              )}{" "}
              {isWoman && <li>&quot;{womanLocalized.defaultMessage}&quot;</li>}{" "}
              {hasDisability && (
                <li>&quot;{disabilityLocalized.defaultMessage}&quot;</li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiversityEquityInclusionSection;
