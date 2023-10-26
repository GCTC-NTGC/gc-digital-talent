import React from "react";
import { useIntl } from "react-intl";

import { IndigenousCommunity, User } from "@gc-digital-talent/graphql";
import {
  getEmploymentEquityStatement,
  getIndigenousCommunity,
} from "@gc-digital-talent/i18n";
import { Separator } from "@gc-digital-talent/ui";
import { unpackMaybes } from "@gc-digital-talent/helpers";

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

  return (
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
                        key={community}
                        data-h2-display="base(flex)"
                        data-h2-align-items="base(center)"
                        data-h2-gap="base(0, x.25)"
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
      <Separator
        orientation="horizontal"
        data-h2-background-color="base(gray.lighter)"
        data-h2-margin="base(x1, 0)"
        decorative
      />
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
  );
};

export default Display;
