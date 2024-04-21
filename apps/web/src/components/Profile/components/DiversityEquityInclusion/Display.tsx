import React from "react";
import { useIntl } from "react-intl";

import {
  commonMessages,
  getEmploymentEquityStatement,
  getIndigenousCommunity,
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
      (c) => c !== IndigenousCommunity.LegacyIsIndigenous,
    ) || [];
  const isIndigenous =
    indigenousCommunities && indigenousCommunities.length > 0;
  const hasClaimedEquityGroup =
    isWoman || hasDisability || isVisibleMinority || isIndigenous;

  return hasClaimedEquityGroup ? (
    <>
      <ul className="list-inside list-disc">
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
            <ul className="pl-1.5">
              {nonLegacyIndigenousCommunities.length > 0
                ? nonLegacyIndigenousCommunities.map((community) => {
                    return (
                      <li
                        key={community}
                        className="flex items-center gap-x-1.5"
                      >
                        <CommunityIcon community={community} />
                        <span>
                          {intl.formatMessage(
                            getIndigenousCommunity(community),
                          )}
                        </span>
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
