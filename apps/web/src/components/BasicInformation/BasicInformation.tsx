import { useIntl } from "react-intl";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { Accordion, Separator } from "@gc-digital-talent/ui";

import PersonalContactInfo from "./PersonalContactInfo";
import LanguageInfo from "./LanguageInfo";
import WorkPreferences from "./WorkPreferences";
import { BasicInformationOptions_Fragment } from "./utils";
import DiversityEquityInfo from "./DiversityEquityInfo";

export const BasicInformation_Fragment = graphql(/* GraphQL */ `
  fragment BasicInformation on User {
    ...PersonalContact
    ...LanguageInfo
    ...WorkPreferences
    ...DiversityEquityInfo
  }
`);

interface BasicInformationProps {
  basicInfoQuery: FragmentType<typeof BasicInformation_Fragment>;
  basicInfoOptionsQuery: FragmentType<typeof BasicInformationOptions_Fragment>;
  sectionKey: string;
}

const BasicInformation = ({
  basicInfoQuery,
  basicInfoOptionsQuery,
  sectionKey,
}: BasicInformationProps) => {
  const intl = useIntl();

  const basicInfo = getFragment(BasicInformation_Fragment, basicInfoQuery);
  const basicInfoOptions = getFragment(
    BasicInformationOptions_Fragment,
    basicInfoOptionsQuery,
  );

  return (
    <>
      <Accordion.Item value={sectionKey}>
        <Accordion.Trigger
          as="h3"
          subtitle={intl.formatMessage({
            defaultMessage:
              "The nominee's core profile information including contact details, language levels and evaluations, and employment equity.",
            id: "rOl7Xv",
            description: "Subtitle for basic profile information section",
          })}
        >
          <span data-h2-font-weight="base(400)">
            {intl.formatMessage({
              defaultMessage: "Basic profile information",
              id: "kAB20A",
              description: "Title for basic profile information section",
            })}
          </span>
        </Accordion.Trigger>
        <Accordion.Content>
          <PersonalContactInfo personalContactQuery={basicInfo} />
          <Separator decorative space="sm" />
          <LanguageInfo languageInfoQuery={basicInfo} />
          <Separator decorative space="sm" />
          <WorkPreferences
            workPreferencesQuery={basicInfo}
            workPreferencesOptionsQuery={basicInfoOptions}
          />
          <Separator decorative space="sm" />
          <DiversityEquityInfo diversityEquityInfoQuery={basicInfo} />
        </Accordion.Content>
      </Accordion.Item>
    </>
  );
};

export default BasicInformation;
