import { useIntl } from "react-intl";

import {
  IndigenousCommunity,
  LocalizedIndigenousCommunity,
  Maybe,
} from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import {
  commonMessages,
  getEmploymentEquityStatement,
} from "@gc-digital-talent/i18n";
import { Ul } from "@gc-digital-talent/ui";

import CommunityIcon from "~/components/Profile/components/DiversityEquityInclusion/CommunityIcon";

import { SnapshotProps } from "../types";

export interface DiversityEquityInclusionSnapshotV1 {
  isWoman?: Maybe<boolean>;
  hasDisability?: Maybe<boolean>;
  isVisibleMinority?: Maybe<boolean>;
  indigenousCommunities?: Maybe<Maybe<LocalizedIndigenousCommunity>[]>;
}

export type DiversityEquityInclusionV1Props =
  SnapshotProps<DiversityEquityInclusionSnapshotV1>;

const DiversityEquityInclusionV1 = ({
  snapshot,
}: DiversityEquityInclusionV1Props) => {
  const intl = useIntl();
  const { isWoman, hasDisability, isVisibleMinority, indigenousCommunities } =
    snapshot;
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
    <Ul>
      {isWoman && (
        <li>{intl.formatMessage(getEmploymentEquityStatement("woman"))}</li>
      )}
      {isVisibleMinority && (
        <li>{intl.formatMessage(getEmploymentEquityStatement("minority"))}</li>
      )}
      {hasDisability && (
        <li>
          {intl.formatMessage(getEmploymentEquityStatement("disability"))}
        </li>
      )}
      {isIndigenous && (
        <li>
          {intl.formatMessage(getEmploymentEquityStatement("indigenous"))}
          <Ul noIndent>
            {nonLegacyIndigenousCommunities.length > 0
              ? nonLegacyIndigenousCommunities.map((community) => {
                  return (
                    <li
                      key={community.value}
                      className="flex items-center gap-x-1.5"
                    >
                      <CommunityIcon community={community.value} />
                      <span>{community.label.localized}</span>
                    </li>
                  );
                })
              : null}
          </Ul>
        </li>
      )}
    </Ul>
  ) : (
    <p>{intl.formatMessage(commonMessages.notProvided)}</p>
  );
};

export default DiversityEquityInclusionV1;
