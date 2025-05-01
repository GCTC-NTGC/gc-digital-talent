import { useIntl } from "react-intl";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { Accordion } from "@gc-digital-talent/ui";

import CareerDevelopmentPreferences from "../CareerDevelopmentPreferences/CareerDevelopmentPreferences";

export const TalentManagementPreferences_Fragment = graphql(/* GraphQL */ `
  fragment TalentManagementPreferences on EmployeeProfile {
    ...CareerDevelopmentPreferences
  }
`);

export const TalentManagementPreferencesOptions_Fragment = graphql(
  /* GraphQL */ `
    fragment TalentManagementPreferencesOptions on Query {
      ...CareerDevelopmentPreferencesOptions
    }
  `,
);

interface TalentManagementPreferencesProps {
  talentManagementPreferencesQuery: FragmentType<
    typeof TalentManagementPreferences_Fragment
  >;
  talentManagementPreferencesOptionsQuery: FragmentType<
    typeof TalentManagementPreferencesOptions_Fragment
  >;
  sectionKey: string;
}

const TalentManagementPreferences = ({
  talentManagementPreferencesQuery,
  talentManagementPreferencesOptionsQuery,
  sectionKey,
}: TalentManagementPreferencesProps) => {
  const intl = useIntl();

  const talentManagementPreferences = getFragment(
    TalentManagementPreferences_Fragment,
    talentManagementPreferencesQuery,
  );
  const talentManagementPreferencesOptions = getFragment(
    TalentManagementPreferencesOptions_Fragment,
    talentManagementPreferencesOptionsQuery,
  );

  return (
    <>
      <Accordion.Item value={sectionKey}>
        <Accordion.Trigger
          as="h3"
          subtitle={intl.formatMessage({
            defaultMessage:
              "The nominee’s preferences around organizations, promotion, mentorship, and executive opportunities.",
            id: "OBD250",
            description: "Subtitle for talent management preferences section",
          })}
        >
          <span data-h2-font-weight="base(400)">
            {intl.formatMessage({
              defaultMessage: "Talent management preferences",
              id: "IKaWRI",
              description: "Title for talent management preferences section",
            })}
          </span>
        </Accordion.Trigger>
        <Accordion.Content>
          <CareerDevelopmentPreferences
            careerDevelopmentPreferencesQuery={talentManagementPreferences}
            careerDevelopmentPreferencesOptionsQuery={
              talentManagementPreferencesOptions
            }
          />
        </Accordion.Content>
      </Accordion.Item>
    </>
  );
};

export default TalentManagementPreferences;
