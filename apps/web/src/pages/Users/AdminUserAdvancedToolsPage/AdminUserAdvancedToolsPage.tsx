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
import adminMessages from "~/messages/adminMessages";

import AccountInformation, {
  ACCOUNT_INFORMATION_ID,
  accountInformationTitle,
} from "./components/AccountInformation";
import SupportTools, {
  SUPPORT_TOOLS_ID,
  supportToolsTitle,
} from "./components/SupportTools";
import RolePermissions, {
  ROLE_PERMISSIONS_ID,
} from "./components/RolesAndPermissions";
import ActivityDetails, {
  ACTIVITY_DETAILS_ID,
  activityDetailsTitle,
} from "./components/ActivityDetails";

const AdminUserAdvancedTools_Fragment = graphql(/** GraphQL */ `
  fragment AdminUserAdvancedTools on User {
    id
    ...AccountInformationForm
    ...AdminUserSupportTools
    ...UserActivityDetails
    ...UserRoleTable
  }
`);

const AdminUserAdvancedToolsOptions_Fragment = graphql(/** GraphQL */ `
  fragment AdminUserAdvancedToolsOptions on Query {
    ...AccountInformationFormOptions
    ...UserRoleTableAvailableRoles
  }
`);

interface AdminUserAdvancedToolsProps {
  query: FragmentType<typeof AdminUserAdvancedTools_Fragment>;
  optionsQuery: FragmentType<typeof AdminUserAdvancedToolsOptions_Fragment>;
}

const AdminUserAdvancedTools = ({
  query,
  optionsQuery,
}: AdminUserAdvancedToolsProps) => {
  const intl = useIntl();
  const user = getFragment(AdminUserAdvancedTools_Fragment, query);
  const options = getFragment(
    AdminUserAdvancedToolsOptions_Fragment,
    optionsQuery,
  );

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
              <TableOfContents.AnchorLink id={ACTIVITY_DETAILS_ID}>
                {intl.formatMessage(activityDetailsTitle)}
              </TableOfContents.AnchorLink>
            </TableOfContents.ListItem>
            <TableOfContents.ListItem>
              <TableOfContents.AnchorLink id={SUPPORT_TOOLS_ID}>
                {intl.formatMessage(supportToolsTitle)}
              </TableOfContents.AnchorLink>
            </TableOfContents.ListItem>
            <TableOfContents.ListItem>
              <TableOfContents.AnchorLink id={ROLE_PERMISSIONS_ID}>
                {intl.formatMessage(adminMessages.rolesAndPermissions)}
              </TableOfContents.AnchorLink>
            </TableOfContents.ListItem>
          </TableOfContents.List>
        </TableOfContents.Navigation>
        <TableOfContents.Content>
          <AccountInformation query={user} optionsQuery={options} />
          <ActivityDetails query={user} />
          <SupportTools query={user} />
          <RolePermissions query={user} optionsQuery={options} />
        </TableOfContents.Content>
      </TableOfContents.Wrapper>
    </Container>
  );
};

const AdminUserAdvancedToolsPage_Query = graphql(/** GraphQL */ `
  query AdminUserAdvancedToolsPage($id: UUID!) {
    user(id: $id, trashed: WITH) {
      ...AdminUserAdvancedTools
    }
    ...AdminUserAdvancedToolsOptions
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

export default Component;
