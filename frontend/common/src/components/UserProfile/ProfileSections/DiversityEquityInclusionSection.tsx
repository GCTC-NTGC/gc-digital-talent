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
  let isAdminEmpty = false;
  let isTalentEmpty = false;
  if (
    !isWoman &&
    !isIndigenous &&
    !isVisibleMinority &&
    !hasDisability &&
    !editPath
  ) {
    isAdminEmpty = true;
  }
  if (
    !isWoman &&
    !isIndigenous &&
    !isVisibleMinority &&
    !hasDisability &&
    editPath
  ) {
    isTalentEmpty = true;
  }
  return (
    <div
      data-h2-bg-color="b(lightgray)"
      data-h2-padding="b(all, m)"
      data-h2-radius="b(s)"
    >
      {isTalentEmpty && (
        <p>
          {intl.formatMessage({
            defaultMessage:
              "You have not identified as a member of any employment equity groups.",
            description:
              "Message indicating the user has not been marked as part of an equity group, Ignore things in <> please.",
          })}
        </p>
      )}
      {isAdminEmpty && (
        <p>
          {intl.formatMessage({
            defaultMessage: "No information has been provided.",
            description:
              "Message on Admin side when user not filled DiversityEquityInclusion section.",
          })}
        </p>
      )}
      {(isWoman || isIndigenous || isVisibleMinority || hasDisability) && (
        <div>
          <p>
            {intl.formatMessage({
              defaultMessage: "My employment equity information:",
              description:
                "Label preceding what groups the user identifies as part of, followed by a colon",
            })}{" "}
          </p>{" "}
          <ul data-h2-padding="b(left, l)">
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
  );
};

export default DiversityEquityInclusionSection;
