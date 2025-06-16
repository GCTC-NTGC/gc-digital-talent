import { useIntl } from "react-intl";

import { unpackMaybes } from "@gc-digital-talent/helpers";
import { Ul, Well } from "@gc-digital-talent/ui";
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

import { styles } from "./styles";

interface DiversityEquityInclusionSectionProps {
  user: Pick<
    User,
    "isWoman" | "hasDisability" | "isVisibleMinority" | "indigenousCommunities"
  >;
}

const DiversityEquityInclusionSection = ({
  user,
}: DiversityEquityInclusionSectionProps) => {
  const intl = useIntl();
  const { well } = styles();

  const { isWoman, hasDisability, isVisibleMinority, indigenousCommunities } =
    user;
  const nonLegacyIndigenousCommunities =
    unpackMaybes(indigenousCommunities).filter(
      (c) => c.value !== IndigenousCommunity.LegacyIsIndigenous,
    ) || [];

  return (
    <Well className={well()}>
      {!anyCriteriaSelected(user) && (
        <p>
          {intl.formatMessage({
            defaultMessage:
              "I am not identified as a member of any employment equity groups.",
            id: "QjOom4",
            description:
              "Message on Admin side when user not filled DiversityEquityInclusion section.",
          })}
        </p>
      )}
      {anyCriteriaSelected(user) && (
        <div>
          <p>
            {intl.formatMessage({
              defaultMessage: "My employment equity information",
              id: "l1hUeU",
              description:
                "Label preceding what groups the user identifies as part of, followed by a colon",
              // eslint-disable-next-line formatjs/no-literal-string-in-jsx
            })}{" "}
            {/* eslint-disable-next-line formatjs/no-literal-string-in-jsx */}
          </p>{" "}
          {indigenousCommunities && indigenousCommunities.length > 0 && (
            <div className="items-center justify-between pt-6 xs:flex">
              <Ul>
                <li>
                  <span className="font-bold">
                    {intl.formatMessage(
                      getEmploymentEquityStatement("indigenous"),
                    )}
                  </span>
                  <Ul>
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
                        <span className="font-bold text-secondary-500 dark:text-secondary-300">
                          {intl.formatMessage(commonMessages.notProvided)}
                        </span>
                      </li>
                    )}
                  </Ul>
                </li>
              </Ul>
              <div className="flex shrink-0 flex-nowrap justify-center">
                {nonLegacyIndigenousCommunities.map((community) => {
                  switch (community.value) {
                    case IndigenousCommunity.StatusFirstNations:
                    case IndigenousCommunity.NonStatusFirstNations:
                      return (
                        <img
                          className="size-16"
                          alt=""
                          key="first-nations-true"
                          src={firstNationsIcon}
                        />
                      );
                    case IndigenousCommunity.Inuit:
                      return (
                        <img
                          className="size-16"
                          alt=""
                          key="inuit-true"
                          src={inuitIcon}
                        />
                      );
                    case IndigenousCommunity.Metis:
                      return (
                        <img
                          className="size-16"
                          alt=""
                          key="metis-true"
                          src={metisIcon}
                        />
                      );
                    case IndigenousCommunity.Other:
                      return (
                        <img
                          className="size-16"
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
            <Ul className="mt-6 font-bold">
              {isWoman && (
                <li>
                  {intl.formatMessage(getEmploymentEquityStatement("woman"))}
                </li>
              )}
              {isVisibleMinority && (
                <li>
                  {intl.formatMessage(getEmploymentEquityStatement("minority"))}
                </li>
                // eslint-disable-next-line formatjs/no-literal-string-in-jsx
              )}{" "}
              {hasDisability && (
                <li>
                  {intl.formatMessage(
                    getEmploymentEquityStatement("disability"),
                  )}
                </li>
              )}
            </Ul>
          )}
        </div>
      )}
    </Well>
  );
};

export default DiversityEquityInclusionSection;
