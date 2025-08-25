import ChatBubbleLeftRightIcon from "@heroicons/react/24/outline/ChatBubbleLeftRightIcon";
import { useIntl } from "react-intl";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { Card, TableOfContents } from "@gc-digital-talent/ui";

import Display from "~/components/Profile/components/LanguageProfile/Display";
import profileMessages from "~/messages/profileMessages";

const LanguageProfile_Fragment = graphql(/** GraphQL */ `
  fragment LanguageProfile on User {
    lookingForEnglish
    lookingForFrench
    lookingForBilingual
    firstOfficialLanguage {
      value
      label {
        localized
      }
    }
    secondLanguageExamCompleted
    estimatedLanguageAbility {
      value
      label {
        localized
      }
    }
    writtenLevel {
      value
      label {
        localized
      }
    }
    comprehensionLevel {
      value
      label {
        localized
      }
    }
    verbalLevel {
      value
      label {
        localized
      }
    }
  }
`);

interface LanguageProfileProps {
  query: FragmentType<typeof LanguageProfile_Fragment>;
}

export const LANGUAGE_PROFILE_ID = "language-profile";

const LanguageProfile = ({ query }: LanguageProfileProps) => {
  const intl = useIntl();
  const user = getFragment(LanguageProfile_Fragment, query);

  return (
    <TableOfContents.Section id={LANGUAGE_PROFILE_ID}>
      <TableOfContents.Heading
        icon={ChatBubbleLeftRightIcon}
        color="secondary"
        className="mb-6"
      >
        {intl.formatMessage(profileMessages.languageProfile)}
      </TableOfContents.Heading>
      <Card>
        <Display user={user} />
      </Card>
    </TableOfContents.Section>
  );
};

export default LanguageProfile;
