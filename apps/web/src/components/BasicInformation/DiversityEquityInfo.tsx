import { useIntl } from "react-intl";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import {
  commonMessages,
  getEmploymentEquityGroup,
} from "@gc-digital-talent/i18n";
import { Ul } from "@gc-digital-talent/ui";

import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";

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

  const hasAllEmptyFields =
    !indigenousCommunities?.length &&
    !hasDisability &&
    !isVisibleMinority &&
    !isWoman;

  return (
    <div className="grid gap-6 xs:grid-cols-1">
      <FieldDisplay
        className="col-span-2"
        label={intl.formatMessage(commonMessages.employmentEquity)}
      >
        {hasAllEmptyFields ? (
          <>{intl.formatMessage(commonMessages.notProvided)}</>
        ) : (
          <Ul>
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
              <li>
                {intl.formatMessage(getEmploymentEquityGroup("minority"))}
              </li>
            )}
            {isWoman && (
              <li>{intl.formatMessage(getEmploymentEquityGroup("woman"))}</li>
            )}
          </Ul>
        )}
      </FieldDisplay>
    </div>
  );
};

export default DiversityEquityInfo;
