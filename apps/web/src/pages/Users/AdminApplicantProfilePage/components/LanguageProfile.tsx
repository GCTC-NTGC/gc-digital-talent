import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { TableOfContents } from "@gc-digital-talent/ui";

import Display from "~/components/Profile/components/LanguageProfile/Display";

const LanguageProfile_Fragment = graphql(/** GraphQL */ `
  fragment LanguageProfile on User {
    ...LanguageProfileDisplay
  }
`);

interface LanguageProfileProps {
  query: FragmentType<typeof LanguageProfile_Fragment>;
}

export const LANGUAGE_PROFILE_ID = "language-profile";

const LanguageProfile = ({ query }: LanguageProfileProps) => {
  const user = getFragment(LanguageProfile_Fragment, query);

  return (
    <TableOfContents.Section id={LANGUAGE_PROFILE_ID}>
      <Display query={user} />
    </TableOfContents.Section>
  );
};

export default LanguageProfile;
