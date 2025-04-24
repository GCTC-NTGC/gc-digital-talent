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
        <NoList>
          <li>
            <BoolCheckIcon
              value={!!indigenousCommunities?.length}
              // trueLabel={} Suggestion: "I'm"
              // falseLabel={} Suggestion: "I'm not"
            >
              {intl.formatMessage(getEmploymentEquityGroup("indigenous"))}
            </BoolCheckIcon>
          </li>
          <li>
            <BoolCheckIcon
              value={hasDisability}
              // trueLabel={} Suggestion: "I'm"
              // falseLabel={} Suggestion: "I'm not"
            >
              {intl.formatMessage(getEmploymentEquityGroup("disability"))}
            </BoolCheckIcon>
          </li>
          <li>
            <BoolCheckIcon
              value={isVisibleMinority}
              // trueLabel={} Suggestion: "I'm"
              // falseLabel={} Suggestion: "I'm not"
            >
              {intl.formatMessage(getEmploymentEquityGroup("minority"))}
            </BoolCheckIcon>
          </li>
          <li>
            <BoolCheckIcon
              value={isWoman}
              // trueLabel={} Suggestion: "I'm"
              // falseLabel={} Suggestion: "I'm not"
            >
              {intl.formatMessage(getEmploymentEquityGroup("woman"))}
            </BoolCheckIcon>
          </li>
        </NoList>
      </FieldDisplay>
    </div>
  );
};

export default DiversityEquityInfo;
