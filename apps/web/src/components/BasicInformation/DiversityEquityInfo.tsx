import { useIntl } from "react-intl";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import {
  commonMessages,
  getEmploymentEquityGroup,
} from "@gc-digital-talent/i18n";
import { NoList } from "@gc-digital-talent/ui";

import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";

import BoolCheckIcon from "../BoolCheckIcon/BoolCheckIcon";

export const DiversityEquityInfo_Fragment = graphql(/* GraphQL */ `
  fragment DiversityEquityInfo on User {
    isWoman
    hasDisability
    isVisibleMinority
    indigenousCommunities {
      value
    }
  }
`);

interface DiversityEquityInfoProps {
  diversityEquityInfoQuery: FragmentType<typeof DiversityEquityInfo_Fragment>;
}

const DiversityEquityInfo = ({
  diversityEquityInfoQuery,
}: DiversityEquityInfoProps) => {
  const intl = useIntl();
  const { indigenousCommunities, hasDisability, isVisibleMinority, isWoman } =
    getFragment(DiversityEquityInfo_Fragment, diversityEquityInfoQuery);

  return (
    <div
      data-h2-display="base(grid)"
      data-h2-grid-template-columns="p-tablet(1fr)"
      data-h2-gap="base(x1)"
    >
      <FieldDisplay
        data-h2-grid-column="base(span 2)"
        label={intl.formatMessage(commonMessages.employmentEquity)}
      >
        <ul>
          {!!indigenousCommunities?.length && (
            <li>
              {intl.formatMessage(getEmploymentEquityGroup("indigenous"))}
            </li>
          )}
          {hasDisability && (
            <li>
              {intl.formatMessage(getEmploymentEquityGroup("disability"))}
            </li>
          )}
          {isVisibleMinority && (
            <li>{intl.formatMessage(getEmploymentEquityGroup("minority"))}</li>
          )}
          {isWoman && (
            <li>{intl.formatMessage(getEmploymentEquityGroup("woman"))}</li>
          )}
        </ul>
      </FieldDisplay>
    </div>
  );
};

export default DiversityEquityInfo;
