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
import { unpackMaybes } from "@gc-digital-talent/helpers";

import useRequiredParams from "~/hooks/useRequiredParams";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import profileMessages from "~/messages/profileMessages";

import DownloadButton from "../DownloadButton";
import SkillPortfolio, {
  SKILL_PORTFOLIO_ID,
} from "./components/SkillPortfolio";
import SkillShowcase, {
  SKILL_SHOWCASE_ID,
  SKILLS_TO_IMPROVE_ID,
  TOP_SKILLS_ID,
} from "./components/SkillShowcase";

const AdminUserSkills_Fragment = graphql(/** GraphQL */ `
  fragment AdminUserSkills on User {
    id
    ...AdminUserSkillShowcase
    userSkills {
      ...AdminUserSkillPortfolio
    }
  }
`);

interface AdminApplicantProfileProps {
  query: FragmentType<typeof AdminUserSkills_Fragment>;
}

const AdminUserSkills = ({ query }: AdminApplicantProfileProps) => {
  const intl = useIntl();
  const user = getFragment(AdminUserSkills_Fragment, query);

  return (
    <Container className="my-18">
      <TableOfContents.Wrapper>
        <TableOfContents.Navigation>
          <TableOfContents.List>
            <TableOfContents.ListItem>
              <TableOfContents.AnchorLink id={SKILL_PORTFOLIO_ID}>
                {intl.formatMessage(navigationMessages.skillPortfolio)}
              </TableOfContents.AnchorLink>
            </TableOfContents.ListItem>
            <TableOfContents.ListItem>
              <TableOfContents.AnchorLink id={SKILL_SHOWCASE_ID}>
                {intl.formatMessage(navigationMessages.skillShowcase)}
              </TableOfContents.AnchorLink>
              <TableOfContents.List className="mt-1.5">
                <TableOfContents.ListItem>
                  <TableOfContents.AnchorLink id={TOP_SKILLS_ID}>
                    {intl.formatMessage(navigationMessages.topSkills)}
                  </TableOfContents.AnchorLink>
                </TableOfContents.ListItem>
                <TableOfContents.ListItem>
                  <TableOfContents.AnchorLink id={SKILLS_TO_IMPROVE_ID}>
                    {intl.formatMessage(navigationMessages.skillsToImprove)}
                  </TableOfContents.AnchorLink>
                </TableOfContents.ListItem>
              </TableOfContents.List>
            </TableOfContents.ListItem>
          </TableOfContents.List>
          <Separator orientation="horizontal" space="xs" decorative />
          <DownloadButton id={user.id} />
        </TableOfContents.Navigation>
        <TableOfContents.Content>
          <SkillPortfolio query={unpackMaybes(user.userSkills)} />
          <SkillShowcase query={user} />
        </TableOfContents.Content>
      </TableOfContents.Wrapper>
    </Container>
  );
};

const AdminUserSkillsPage_Query = graphql(/** GraphQL */ `
  query AdminUserSkillsPage($id: UUID!) {
    user(id: $id, trashed: WITH) {
      ...AdminUserSkills
    }
  }
`);

interface RouteParams extends Record<string, string> {
  userId: Scalars["ID"]["output"];
}

const AdminUserSkillsPage = () => {
  const intl = useIntl();
  const { userId } = useRequiredParams<RouteParams>("userId");
  const [{ data, fetching, error }] = useQuery({
    query: AdminUserSkillsPage_Query,
    variables: { id: userId },
  });

  return (
    <Pending fetching={fetching} error={error}>
      {data?.user ? (
        <AdminUserSkills query={data.user} />
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
    <AdminUserSkillsPage />
  </RequireAuth>
);

Component.displayName = "AdminUserSkillsPage";

export default Component;
