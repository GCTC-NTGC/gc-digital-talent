import React from "react";
import { useIntl } from "react-intl";

import Well from "../../Well";
import {
  getEmploymentEquityStatement,
  getIndigenousCommunity,
} from "../../../constants";
import { Applicant, IndigenousCommunity } from "../../../api/generated";

const DiversityEquityInclusionSection: React.FunctionComponent<{
  applicant: Pick<
    Applicant,
    | "isWoman"
    | "hasDisability"
    | "isIndigenous"
    | "isVisibleMinority"
    | "indigenousCommunities"
  >;
  editPath?: string;
}> = ({ applicant, editPath }) => {
  const intl = useIntl();

  const {
    isWoman,
    hasDisability,
    isIndigenous,
    isVisibleMinority,
    indigenousCommunities,
  } = applicant;
  const hasLegacyIndigenousCommunity =
    indigenousCommunities?.length === 1 &&
    indigenousCommunities[0] === IndigenousCommunity.LegacyIsIndigenous;
  const nonLegacyIndigenousCommunitySelected =
    indigenousCommunities &&
    indigenousCommunities.length > 0 &&
    !hasLegacyIndigenousCommunity;
  const legacyIsIndigenous =
    (isIndigenous || hasLegacyIndigenousCommunity) &&
    !nonLegacyIndigenousCommunitySelected;
  const anyCriteriaSelected =
    isWoman ||
    isIndigenous ||
    isVisibleMinority ||
    hasDisability ||
    nonLegacyIndigenousCommunitySelected;

  return (
    <Well>
      <div data-h2-flex-grid="base(flex-start, x2, x1)">
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
            {nonLegacyIndigenousCommunitySelected && (
              <div data-h2-padding="base(x1, 0, 0, 0)">
                <p>
                  {intl.formatMessage({
                    defaultMessage: "Indigenous Identity:",
                    id: "GrE0hE",
                    description:
                      "Label preceding text explaining whether the user is indigenous, followed by a colon",
                  })}{" "}
                  <span data-h2-font-weight="base(700)">
                    {intl.formatMessage(
                      getEmploymentEquityStatement("indigenous"),
                    )}
                  </span>
                </p>
                <p>
                  {intl.formatMessage({
                    defaultMessage: "My Community(ies):",
                    id: "Mw4ShP",
                    description:
                      "Label preceding text listing the communities the user is a member of, followed by a colon",
                  })}{" "}
                  <span data-h2-font-weight="base(700)">
                    {indigenousCommunities.map((community, index) => {
                      if (
                        !community ||
                        community === IndigenousCommunity.LegacyIsIndigenous
                      ) {
                        return "";
                      }

                      const text = intl.formatMessage(
                        getIndigenousCommunity(community),
                      );

                      if (index === 0) {
                        return text;
                      }
                      return `, ${text}`;
                    })}
                  </span>
                </p>
              </div>
            )}
            {(isWoman ||
              isVisibleMinority ||
              hasDisability ||
              legacyIsIndigenous) && (
              <ul
                data-h2-font-weight="base(700)"
                data-h2-padding="base(x1, 0, 0, x1)"
              >
                {isWoman && (
                  <li>
                    {intl.formatMessage(getEmploymentEquityStatement("woman"))}
                  </li>
                )}
                {legacyIsIndigenous && (
                  <li>
                    {intl.formatMessage(
                      getEmploymentEquityStatement("indigenous"),
                    )}
                  </li>
                )}{" "}
                {isVisibleMinority && (
                  <li>
                    {intl.formatMessage(
                      getEmploymentEquityStatement("minority"),
                    )}
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
            )}
            <p data-h2-padding="base(x1, 0, 0, 0)">
              {intl.formatMessage({
                defaultMessage:
                  "You have identified as a member of an <underline>employment equity group.</underline><strong> You can add additional <underline>employment equity groups</underline> to your profile by editing this section if they apply to you.</strong>",
                id: "/Jijcj",
                description:
                  "Final paragraph in the employment equity profile section, ignore things in <> please",
              })}
            </p>
          </div>
        )}
      </div>
    </Well>
  );
};

export default DiversityEquityInclusionSection;
