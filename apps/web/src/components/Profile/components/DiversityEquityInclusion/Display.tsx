import { useIntl } from "react-intl";

import {
  commonMessages,
  getEmploymentEquityStatement,
  getLocalizedName,
} from "@gc-digital-talent/i18n";
import { Separator } from "@gc-digital-talent/ui";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { IndigenousCommunity, User } from "@gc-digital-talent/graphql";

import CommunityIcon from "./CommunityIcon";

type PartialUser = Pick<
  User,
  "isWoman" | "hasDisability" | "isVisibleMinority" | "indigenousCommunities"
>;

interface DisplayProps {
  user: PartialUser;
}

const Display = ({
  user: { isWoman, hasDisability, isVisibleMinority, indigenousCommunities },
}: DisplayProps) => {
  const intl = useIntl();
  const nonLegacyIndigenousCommunities =
    unpackMaybes(indigenousCommunities).filter(
      (c) => c.value !== IndigenousCommunity.LegacyIsIndigenous,
    ) || [];
  const isIndigenous =
    indigenousCommunities && indigenousCommunities.length > 0;
  const hasClaimedEquityGroup =
    // Note, we only care about one truthy value so nullish coalescing is inappropriate here.
    isWoman || hasDisability || isVisibleMinority || isIndigenous;

  return hasClaimedEquityGroup ? (
    <>
      <ul>
        {isWoman && (
          <li>{intl.formatMessage(getEmploymentEquityStatement("woman"))}</li>
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
        {isIndigenous && (
          <li>
            {intl.formatMessage(getEmploymentEquityStatement("indigenous"))}
            <ul data-h2-padding-left="base(x.25)">
              {nonLegacyIndigenousCommunities.length > 0
                ? nonLegacyIndigenousCommunities.map((community) => {
                    return (
                      <li
                        key={community.value}
                        data-h2-display="base(flex)"
                        data-h2-align-items="base(center)"
                        data-h2-gap="base(0, x.25)"
                      >
                        <CommunityIcon community={community.value} />
                        <span>{getLocalizedName(community.label, intl)}</span>
                      </li>
                    );
                  })
                : null}
            </ul>
          </li>
        )}
      </ul>
      <Separator space="sm" />
      <p>
        {intl.formatMessage({
          defaultMessage:
            "You have identified as a member of an employment equity group. You can add additional employment equity groups to your profile by editing this section if they apply to you.",
          id: "Xh1nV6",
          description:
            "Text explaining how to edit employment equity information",
        })}
      </p>
    </>
  ) : (
    <p>{intl.formatMessage(commonMessages.notProvided)}</p>
  );
};

export default Display;
