import { useIntl } from "react-intl";
import { useQuery } from "urql";

import type { FragmentType } from "@gc-digital-talent/graphql";
import { getFragment, graphql } from "@gc-digital-talent/graphql";
import {
  Pending,
  Separator,
  TableOfContents,
  ThrowNotFound,
} from "@gc-digital-talent/ui";
import { ROLE_NAME } from "@gc-digital-talent/auth";
import { useLocalStorage } from "@gc-digital-talent/storage";

import RequireAuth from "~/components/RequireAuth/RequireAuth";
import profileMessages from "~/messages/profileMessages";
import { KEY_NEW_FEATURE_EMPLOYEE_PROFILE } from "~/constants/storageKeys";

import SharedTocLinks from "./components/SharedTocLinks";
import NewFeatureMessage from "./components/NewFeatureMessage";
import YourFunctionalCommunities from "./components/YourFunctionalCommunitiesSection/YourFunctionalCommunitiesSection";

const SECTION_ID = {
  YOUR_FUNCTIONAL_COMMUNITIES: "your-functional-communities",
};

const FunctionalCommunitiesUser_Fragment = graphql(/** GraphQL */ `
  fragment FunctionalCommunitiesUser on User {
    ...YourFunctionalCommunitiesUser
  }
`);

interface FunctionalCommunitiesProps {
  userQuery: FragmentType<typeof FunctionalCommunitiesUser_Fragment>;
}

const FunctionalCommunities = ({ userQuery }: FunctionalCommunitiesProps) => {
  const intl = useIntl();
  const user = getFragment(FunctionalCommunitiesUser_Fragment, userQuery);

  const [noticeIsVisible, setNoticeIsVisible] = useLocalStorage<boolean>(
    KEY_NEW_FEATURE_EMPLOYEE_PROFILE,
    true,
  );

  return (
    <>
      <TableOfContents.Wrapper>
        <TableOfContents.Navigation>
          <TableOfContents.List>
            <TableOfContents.ListItem
              key={SECTION_ID.YOUR_FUNCTIONAL_COMMUNITIES}
            >
              <TableOfContents.AnchorLink
                id={SECTION_ID.YOUR_FUNCTIONAL_COMMUNITIES}
              >
                {intl.formatMessage({
                  defaultMessage: "Your functional communities",
                  id: "41VJap",
                  description:
                    "Title of the functional communities section in the employee profile",
                })}
              </TableOfContents.AnchorLink>
            </TableOfContents.ListItem>
          </TableOfContents.List>
          <Separator space="sm" />
          <SharedTocLinks />
        </TableOfContents.Navigation>
        <TableOfContents.Content>
          <div className="mb-6">
            {noticeIsVisible ? (
              <NewFeatureMessage onDismiss={() => setNoticeIsVisible(false)} />
            ) : null}
          </div>
          <div className="flex flex-col gap-y-18">
            <TableOfContents.Section
              id={SECTION_ID.YOUR_FUNCTIONAL_COMMUNITIES}
            >
              <YourFunctionalCommunities userQuery={user} />
            </TableOfContents.Section>
          </div>
        </TableOfContents.Content>
      </TableOfContents.Wrapper>
    </>
  );
};

const FunctionalCommunitiesPage_Query = graphql(/** GraphQL */ `
  query FunctionalCommunitiesPage {
    ...FunctionalCommunitiesOptions
    me {
      ...FunctionalCommunitiesUser
    }
  }
`);

const FunctionalCommunitiesPage = () => {
  const intl = useIntl();
  const [{ data, fetching, error }] = useQuery({
    query: FunctionalCommunitiesPage_Query,
  });

  return (
    <Pending fetching={fetching} error={error}>
      {data?.me ? (
        <FunctionalCommunities userQuery={data.me} optionsQuery={data} />
      ) : (
        <ThrowNotFound
          message={intl.formatMessage(profileMessages.userNotFound)}
        />
      )}
    </Pending>
  );
};

const Component = () => (
  <RequireAuth roles={[ROLE_NAME.Applicant]}>
    <FunctionalCommunitiesPage />
  </RequireAuth>
);

Component.displayName = "FunctionalCommunitiesPage";

export default Component;
