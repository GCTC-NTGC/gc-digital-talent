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

import PersonalAndContactInformation, {
  PERSONAL_CONTACT_INFO_ID,
} from "./components/PersonalAndContactInformation";
import LanguageProfile, {
  LANGUAGE_PROFILE_ID,
} from "./components/LanguageProfile";
import WorkPreferences, {
  WORK_PREFERENCES_ID,
} from "./components/WorkPreferences";
import DiversityEquityInclusion, {
  DEI_ID,
} from "./components/DiversityEquityInclusion";
import GovernmentInformation, {
  GOV_INFO_ID,
} from "./components/GovernmentInformation";
import DownloadButton from "../DownloadButton";

const AdminApplicantProfile_Fragment = graphql(/** GraphQL */ `
  fragment AdminApplicantProfile on User {
    id
    ...PersonalAndContactInformation
    ...LanguageProfile
    ...AdminWorkPreferences
    ...DiversityEquityInclusion
    ...GovernmentInformation
  }
`);

interface AdminApplicantProfileProps {
  query: FragmentType<typeof AdminApplicantProfile_Fragment>;
}

const AdminApplicantProfile = ({ query }: AdminApplicantProfileProps) => {
  const intl = useIntl();
  const user = getFragment(AdminApplicantProfile_Fragment, query);

  return (
    <Container className="my-18">
      <TableOfContents.Wrapper>
        <TableOfContents.Navigation>
          <TableOfContents.List>
            <TableOfContents.ListItem>
              <TableOfContents.AnchorLink id={PERSONAL_CONTACT_INFO_ID}>
                {intl.formatMessage(
                  profileMessages.personalAndContactInformation,
                )}
              </TableOfContents.AnchorLink>
            </TableOfContents.ListItem>
            <TableOfContents.ListItem>
              <TableOfContents.AnchorLink id={LANGUAGE_PROFILE_ID}>
                {intl.formatMessage(profileMessages.languageProfile)}
              </TableOfContents.AnchorLink>
            </TableOfContents.ListItem>
            <TableOfContents.ListItem>
              <TableOfContents.AnchorLink id={WORK_PREFERENCES_ID}>
                {intl.formatMessage(navigationMessages.workPreferences)}
              </TableOfContents.AnchorLink>
            </TableOfContents.ListItem>
            <TableOfContents.ListItem>
              <TableOfContents.AnchorLink id={DEI_ID}>
                {intl.formatMessage(
                  navigationMessages.diversityEquityInclusion,
                )}
              </TableOfContents.AnchorLink>
            </TableOfContents.ListItem>
            <TableOfContents.ListItem>
              <TableOfContents.AnchorLink id={GOV_INFO_ID}>
                {intl.formatMessage(profileMessages.govEmployeeInformation)}
              </TableOfContents.AnchorLink>
            </TableOfContents.ListItem>
          </TableOfContents.List>
          <Separator orientation="horizontal" space="xs" decorative />
          <DownloadButton id={user.id} />
        </TableOfContents.Navigation>
        <TableOfContents.Content>
          <PersonalAndContactInformation query={user} />
          <LanguageProfile query={user} />
          <WorkPreferences query={user} />
          <DiversityEquityInclusion query={user} />
          <GovernmentInformation query={user} />
        </TableOfContents.Content>
      </TableOfContents.Wrapper>
    </Container>
  );
};

const AdminApplicantProfilePage_Query = graphql(/** GraphQL */ `
  query AdminApplicantProfilePage($id: UUID!) {
    user(id: $id) {
      ...AdminApplicantProfile
    }
  }
`);

interface RouteParams extends Record<string, string> {
  userId: Scalars["ID"]["output"];
}

const AdminApplicantProfilePage = () => {
  const intl = useIntl();
  const { userId } = useRequiredParams<RouteParams>("userId");
  const [{ data, fetching, error }] = useQuery({
    query: AdminApplicantProfilePage_Query,
    variables: { id: userId },
  });

  return (
    <Pending fetching={fetching} error={error}>
      {data?.user ? (
        <AdminApplicantProfile query={data.user} />
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
    <AdminApplicantProfilePage />
  </RequireAuth>
);

Component.displayName = "AdminApplicantProfilePage";
