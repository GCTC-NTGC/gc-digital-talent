import { useIntl } from "react-intl";
import { useQuery } from "urql";

import {
  FragmentType,
  getFragment,
  graphql,
  Scalars,
} from "@gc-digital-talent/graphql";
import {
  Container,
  Pending,
  TableOfContents,
  ThrowNotFound,
} from "@gc-digital-talent/ui";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import useRequiredParams from "~/hooks/useRequiredParams";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import profileMessages from "~/messages/profileMessages";

import AccountInformation, {
  ACCOUNT_INFORMATION_ID,
  AccountInformationFormOptions_Fragment,
  accountInformationTitle,
} from "./components/AccountInformation";
import SupportTools, {
  SUPPORT_TOOLS_ID,
  supportToolsTitle,
} from "./components/SupportTools";

const AdminUserAdvancedTools_Fragment = graphql(/** GraphQL */ `
  fragment AdminUserAdvancedTools on User {
    id
    ...AccountInformationForm
    ...AdminUserSupportTools
  }
`);

interface AdminUserAdvancedToolsProps {
  query: FragmentType<typeof AdminUserAdvancedTools_Fragment>;
  optionsQuery: FragmentType<typeof AccountInformationFormOptions_Fragment>;
}

const AdminUserAdvancedTools = ({
  query,
  optionsQuery,
}: AdminUserAdvancedToolsProps) => {
  const intl = useIntl();
  const user = getFragment(AdminUserAdvancedTools_Fragment, query);

  return (
    <Container className="my-18">
      <TableOfContents.Wrapper>
        <TableOfContents.Navigation>
          <TableOfContents.List>
            <TableOfContents.ListItem>
              <TableOfContents.AnchorLink id={ACCOUNT_INFORMATION_ID}>
                {intl.formatMessage(accountInformationTitle)}
              </TableOfContents.AnchorLink>
            </TableOfContents.ListItem>
            <TableOfContents.ListItem>
              <TableOfContents.AnchorLink id={SUPPORT_TOOLS_ID}>
                {intl.formatMessage(supportToolsTitle)}
              </TableOfContents.AnchorLink>
            </TableOfContents.ListItem>
          </TableOfContents.List>
        </TableOfContents.Navigation>
        <TableOfContents.Content>
          <AccountInformation query={user} {...{ optionsQuery }} />
          <SupportTools query={user} />
        </TableOfContents.Content>
      </TableOfContents.Wrapper>
    </Container>
  );
};

const AdminUserAdvancedToolsPage_Query = graphql(/** GraphQL */ `
  query AdminUserAdvancedToolsPage($id: UUID!) {
    user(id: $id) {
      ...AdminUserAdvancedTools
    }

    ...AccountInformationFormOptions
  }
`);

interface RouteParams extends Record<string, string> {
  userId: Scalars["ID"]["output"];
}

const AdminUserAdvancedToolsPage = () => {
  const intl = useIntl();
  const { userId } = useRequiredParams<RouteParams>("userId");
  const [{ data, fetching, error }] = useQuery({
    query: AdminUserAdvancedToolsPage_Query,
    variables: { id: userId },
  });

  return (
    <Pending fetching={fetching} error={error}>
      {data?.user ? (
        <AdminUserAdvancedTools query={data.user} optionsQuery={data} />
      ) : (
        <ThrowNotFound
          message={intl.formatMessage(profileMessages.userNotFound)}
        />
      )}
    </Pending>
  );
};

export const Component = () => (
  <RequireAuth
    roles={[
      ROLE_NAME.PlatformAdmin,
      ROLE_NAME.CommunityAdmin,
      ROLE_NAME.CommunityRecruiter,
      ROLE_NAME.CommunityTalentCoordinator,
      ROLE_NAME.ProcessOperator,
    ]}
  >
    <AdminUserAdvancedToolsPage />
  </RequireAuth>
);

Component.displayName = "AdminUserAdvancedToolsPage";
