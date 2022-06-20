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
      data-h2-bg-color="b(lightgray)"
      data-h2-padding="b(all, m)"
      data-h2-radius="b(s)"
    >
      {!anyCriteriaSelected && (
        <p>
          {intl.formatMessage({
            defaultMessage:
              "I am not identified as a member of any employment equity groups.",
            description:
              "Message indicating the user has not been marked as part of an equity group, Ignore things in <> please.",
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
