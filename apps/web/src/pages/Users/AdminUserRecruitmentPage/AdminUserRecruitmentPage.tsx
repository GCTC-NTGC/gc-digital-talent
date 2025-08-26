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
  Separator,
  TableOfContents,
  ThrowNotFound,
} from "@gc-digital-talent/ui";
import { ROLE_NAME } from "@gc-digital-talent/auth";
import { navigationMessages } from "@gc-digital-talent/i18n";

import useRequiredParams from "~/hooks/useRequiredParams";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import profileMessages from "~/messages/profileMessages";

import DownloadButton from "../DownloadButton";
import RecruitmentProcesses, {
  RECRUITMENT_PROCESSES_ID,
} from "./components/RecruitmentProcesses";
import RecruitmentTools, {
  RECRUITMENT_TOOLS_ID,
  title as recrtuimentToolsTitle,
} from "./components/RecruitmentTools";

const AdminUserRecruitment_Fragment = graphql(/** GraphQL */ `
  fragment AdminUserRecruitment on User {
    id
    ...AdminRecruitmentProcesses
    ...RecruitmentTools
  }
`);

interface AdminUserRecruitmentProps {
  query: FragmentType<typeof AdminUserRecruitment_Fragment>;
}

const AdminUserRecruitment = ({ query }: AdminUserRecruitmentProps) => {
  const intl = useIntl();
  const user = getFragment(AdminUserRecruitment_Fragment, query);

  return (
    <Container className="my-18">
      <TableOfContents.Wrapper>
        <TableOfContents.Navigation>
          <TableOfContents.List>
            <TableOfContents.ListItem>
              <TableOfContents.AnchorLink id={RECRUITMENT_PROCESSES_ID}>
                {intl.formatMessage(navigationMessages.recruitmentProcesses)}
              </TableOfContents.AnchorLink>
            </TableOfContents.ListItem>
            <TableOfContents.ListItem>
              <TableOfContents.AnchorLink id={RECRUITMENT_TOOLS_ID}>
                {intl.formatMessage(recrtuimentToolsTitle)}
              </TableOfContents.AnchorLink>
            </TableOfContents.ListItem>
          </TableOfContents.List>
          <Separator orientation="horizontal" space="xs" decorative />
          <DownloadButton id={user.id} />
        </TableOfContents.Navigation>
        <TableOfContents.Content>
          <RecruitmentProcesses query={user} />
          <RecruitmentTools query={user} />
        </TableOfContents.Content>
      </TableOfContents.Wrapper>
    </Container>
  );
};

const AdminUserRecruitmentPage_Query = graphql(/** GraphQL */ `
  query AdminUserRecruitmentPage($id: UUID!) {
    user(id: $id) {
      ...AdminUserRecruitment
    }
  }
`);

interface RouteParams extends Record<string, string> {
  userId: Scalars["ID"]["output"];
}

const AdminUserRecruitmentPage = () => {
  const intl = useIntl();
  const { userId } = useRequiredParams<RouteParams>("userId");
  const [{ data, fetching, error }] = useQuery({
    query: AdminUserRecruitmentPage_Query,
    variables: { id: userId },
  });

  return (
    <Pending fetching={fetching} error={error}>
      {data?.user ? (
        <AdminUserRecruitment query={data.user} />
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
    <AdminUserRecruitmentPage />
  </RequireAuth>
);

Component.displayName = "AdminUserRecruitmentPage";
