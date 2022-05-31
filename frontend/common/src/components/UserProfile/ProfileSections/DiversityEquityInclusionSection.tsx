import React from "react";
import { useIntl } from "react-intl";
import {
  disabilityLocalized,
  indigenousLocalized,
  minorityLocalized,
  womanLocalized,
} from "../../../constants/localizedConstants";
import { Applicant } from "../../../api/generated";

// add link to Equity groups <a> tags around a message
function equityLinkText(msg: string) {
  return <a href="/equity-groups">{msg}</a>;
}

const DiversityEquityInclusionSection: React.FunctionComponent<{
  applicant: Pick<
    Applicant,
    "isWoman" | "hasDisability" | "isIndigenous" | "isVisibleMinority"
  >;
  editPath?: string;
}> = ({ applicant, editPath }) => {
  const intl = useIntl();

  const { isWoman, hasDisability, isIndigenous, isVisibleMinority } = applicant;

  return (
    <div
      data-h2-bg-color="b(lightgray)"
      data-h2-padding="b(all, m)"
      data-h2-radius="b(s)"
    >
      {!isWoman && !isIndigenous && !isVisibleMinority && !hasDisability && (
        <p>
          {intl.formatMessage(
            {
              defaultMessage:
                "You have not identified as a member of any <equityLinkText>employment equity groups.</equityLinkText>",
              description:
                "Message indicating the user has not been marked as part of an equity group, Ignore things in <> please.",
            },
            { equityLinkText },
          )}
        </p>
      )}
      {(isWoman || isIndigenous || isVisibleMinority || hasDisability) && (
        <div>
          <p>
            {intl.formatMessage({
              defaultMessage: "I identify as:",
              description:
                "Label preceding what groups the user identifies as part of, followed by a colon",
            })}{" "}
          </p>{" "}
          <ul data-h2-padding="b(left, l)">
            {isWoman && (
              <li data-h2-font-weight="b(700)">
                {womanLocalized.defaultMessage}
              </li>
            )}{" "}
            {isIndigenous && (
              <li data-h2-font-weight="b(700)">
                {indigenousLocalized.defaultMessage}
              </li>
            )}{" "}
            {isVisibleMinority && (
              <li data-h2-font-weight="b(700)">
                {minorityLocalized.defaultMessage}
              </li>
            )}{" "}
            {hasDisability && (
              <li data-h2-font-weight="b(700)">
                {disabilityLocalized.defaultMessage}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DiversityEquityInclusionSection;
