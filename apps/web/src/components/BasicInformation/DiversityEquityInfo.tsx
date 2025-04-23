import { useIntl } from "react-intl";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";

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
        <ul data-h2-list-style="base(none)" data-h2-padding="base(0)">
          <li>
            <BoolCheckIcon
              value={!!indigenousCommunities?.length}
              // trueLabel={} Suggestion: "I'm"
              // falseLabel={} Suggestion: "I'm not"
            >
              {intl.formatMessage({
                defaultMessage: "Indigenous identity",
                id: "ku5rdU",
                description: "Label for indigenous identity field value",
              })}
            </BoolCheckIcon>
          </li>
          <li>
            <BoolCheckIcon
              value={hasDisability}
              // trueLabel={} Suggestion: "I'm"
              // falseLabel={} Suggestion: "I'm not"
            >
              {intl.formatMessage({
                defaultMessage: "Persons with a disability",
                id: "dTs237",
                description: "Label for has disability field value",
              })}
            </BoolCheckIcon>
          </li>
          <li>
            <BoolCheckIcon
              value={isVisibleMinority}
              // trueLabel={} Suggestion: "I'm"
              // falseLabel={} Suggestion: "I'm not"
            >
              {intl.formatMessage({
                defaultMessage: "Visible minority",
                id: "TButZM",
                description: "Label for visible minority field value",
              })}
            </BoolCheckIcon>
          </li>
          <li>
            <BoolCheckIcon
              value={isWoman}
              // trueLabel={} Suggestion: "I'm"
              // falseLabel={} Suggestion: "I'm not"
            >
              {intl.formatMessage({
                defaultMessage: "Woman",
                id: "w6vRmC",
                description: "Label for woman field value",
              })}
            </BoolCheckIcon>
          </li>
        </ul>
      </FieldDisplay>
    </div>
  );
};

export default DiversityEquityInfo;
