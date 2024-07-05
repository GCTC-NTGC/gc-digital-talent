import { useIntl } from "react-intl";

import { unpackMaybes } from "@gc-digital-talent/helpers";
import { Well } from "@gc-digital-talent/ui";
import {
  commonMessages,
  getEmploymentEquityStatement,
  getLocalizedName,
} from "@gc-digital-talent/i18n";
import { User, IndigenousCommunity } from "@gc-digital-talent/graphql";

import firstNationsIcon from "~/assets/img/first-nations-true.webp";
import inuitIcon from "~/assets/img/inuit-true.webp";
import metisIcon from "~/assets/img/metis-true.webp";
import otherIcon from "~/assets/img/other-true.webp";
import { anyCriteriaSelected } from "~/validators/profile/diversityEquityInclusion";

const DiversityEquityInclusionSection = ({ user }: { user: User }) => {
  const intl = useIntl();

  const { isWoman, hasDisability, isVisibleMinority, indigenousCommunities } =
    user;
  const nonLegacyIndigenousCommunities =
    unpackMaybes(indigenousCommunities).filter(
      (c) => c.value !== IndigenousCommunity.LegacyIsIndigenous,
    ) || [];

  return (
    <Well>
      <div data-h2-flex-grid="base(flex-start, x2, x1)">
        {!anyCriteriaSelected(user) && (
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
        {anyCriteriaSelected(user) && (
          <div data-h2-flex-item="base(1of1)">
            <p>
              {intl.formatMessage({
                defaultMessage: "My employment equity information:",
                id: "5WOqlf",
                description:
                  "Label preceding what groups the user identifies as part of, followed by a colon",
              })}{" "}
            </p>{" "}
            {indigenousCommunities && indigenousCommunities.length > 0 && (
              <div
                data-h2-padding="base(x1, 0, 0, 0)"
                data-h2-display="p-tablet(flex)"
                data-h2-align-items="base(center)"
                data-h2-justify-content="base(space-between)"
              >
                <ul data-h2-padding="base(0, 0, 0, x1)">
                  <li>
                    <span data-h2-font-weight="base(700)">
                      {intl.formatMessage(
                        getEmploymentEquityStatement("indigenous"),
                      )}
                    </span>
                    <ul data-h2-padding="base(0, 0, 0, x1)">
                      {nonLegacyIndigenousCommunities.length > 0 ? (
                        nonLegacyIndigenousCommunities.map((community) => {
                          return (
                            <li key={community.value}>
                              {getLocalizedName(community.label, intl)}
                            </li>
                          );
                        })
                      ) : (
                        <li>
                          <span
                            data-h2-font-weight="base(700)"
                            data-h2-color="base(primary.dark)"
                          >
                            {intl.formatMessage(commonMessages.notProvided)}
                          </span>
                        </li>
                      )}
                    </ul>
                  </li>
                </ul>
                <div
                  data-h2-display="base(flex)"
                  data-h2-justify-content="base(center)"
                  data-h2-flex-wrap="base(nowrap)"
                  data-h2-flex-shrink="base(0)"
                >
                  {nonLegacyIndigenousCommunities.map((community) => {
                    switch (community.value) {
                      case IndigenousCommunity.StatusFirstNations:
                      case IndigenousCommunity.NonStatusFirstNations:
                        return (
                          <img
                            data-h2-height="base(4em)"
                            alt=""
                            key="first-nations-true"
                            src={firstNationsIcon}
                          />
                        );
                      case IndigenousCommunity.Inuit:
                        return (
                          <img
                            data-h2-height="base(4em)"
                            alt=""
                            key="inuit-true"
                            src={inuitIcon}
                          />
                        );
                      case IndigenousCommunity.Metis:
                        return (
                          <img
                            data-h2-height="base(4em)"
                            alt=""
                            key="metis-true"
                            src={metisIcon}
                          />
                        );
                      case IndigenousCommunity.Other:
                        return (
                          <img
                            data-h2-height="base(4em)"
                            alt=""
                            key="other-true"
                            src={otherIcon}
                          />
                        );
                      default:
                        return null;
                    }
                  })}
                </div>
              </div>
            )}
            {(isWoman || isVisibleMinority || hasDisability) && (
              <ul
                data-h2-font-weight="base(700)"
                data-h2-padding="base(x1, 0, 0, x1)"
              >
                {isWoman && (
                  <li>
                    {intl.formatMessage(getEmploymentEquityStatement("woman"))}
                  </li>
                )}
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
          </div>
        )}
      </div>
    </Well>
  );
};

export default DiversityEquityInclusionSection;
