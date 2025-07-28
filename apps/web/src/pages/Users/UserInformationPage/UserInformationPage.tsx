import { useIntl } from "react-intl";
import CalculatorIcon from "@heroicons/react/24/outline/CalculatorIcon";
import InformationCircleIcon from "@heroicons/react/24/outline/InformationCircleIcon";
import PencilSquareIcon from "@heroicons/react/24/outline/PencilSquareIcon";
import UserIcon from "@heroicons/react/24/outline/UserIcon";
import { useQuery } from "urql";

import { Pending, TableOfContents, ThrowNotFound } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";
import {
  FragmentType,
  Scalars,
  getFragment,
  graphql,
} from "@gc-digital-talent/graphql";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import SEO from "~/components/SEO/SEO";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import useRequiredParams from "~/hooks/useRequiredParams";
import adminMessages from "~/messages/adminMessages";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import { JobPlacementOptionsFragmentType } from "~/components/PoolCandidatesTable/JobPlacementDialog";

import AboutSection from "./components/AboutSection";
import CandidateStatusSection from "./components/CandidateStatusSection";
import NotesSection from "./components/NotesSection";
import EmploymentEquitySection from "./components/EmploymentEquitySection";

export const UserInfo_Fragment = graphql(/* GraphQL */ `
  fragment UserInfo on User {
    ...UserCandidatesTableRow
    ...UserInfoAboutSection
    ...CandidateStatusSection
    ...NotesSectionUser
    ...EmploymentEquityUser
  }
`);

interface UserInformationProps {
  userQuery: FragmentType<typeof UserInfo_Fragment>;
  jobPlacementOptions: JobPlacementOptionsFragmentType;
}

export const UserInformation = ({
  userQuery,
  jobPlacementOptions,
}: UserInformationProps) => {
  const intl = useIntl();
  const user = getFragment(UserInfo_Fragment, userQuery);

  const items = [
    {
      id: "about",
      title: intl.formatMessage({
        defaultMessage: "About",
        id: "uutH18",
        description: "Title of the 'About' section of the view-user page",
      }),
      titleIcon: UserIcon,
      content: <AboutSection userQuery={user} />,
    },
    {
      id: "candidate-status",
      title: intl.formatMessage({
        defaultMessage: "Candidate status",
        id: "F00OD4",
        description:
          "Title of the 'Candidate status' section of the view-user page",
      }),
      titleIcon: CalculatorIcon,
      content: (
        <CandidateStatusSection
          userQuery={user}
          jobPlacementOptions={jobPlacementOptions}
        />
      ),
    },
    {
      id: "notes",
      title: intl.formatMessage(adminMessages.notes),
      titleIcon: PencilSquareIcon,
      content: <NotesSection userQuery={user} />,
    },
    {
      id: "employment-equity",
      title: intl.formatMessage(commonMessages.employmentEquity),
      titleIcon: InformationCircleIcon,
      content: <EmploymentEquitySection userQuery={user} />,
    },
  ];

  return (
    <TableOfContents.Wrapper>
      <TableOfContents.Navigation>
        <TableOfContents.List>
          {items.map((item) => (
            <TableOfContents.ListItem key={item.id}>
              <TableOfContents.AnchorLink id={item.id}>
                {item.title}
              </TableOfContents.AnchorLink>
            </TableOfContents.ListItem>
          ))}
        </TableOfContents.List>
      </TableOfContents.Navigation>
      <TableOfContents.Content>
        {items.map((item, index) => (
          <TableOfContents.Section key={item.id} id={item.id}>
            <TableOfContents.Heading
              icon={item.titleIcon}
              as="h3"
              className={`mb-6 ${index > 0 ? "mt-18" : "mt-0"}`}
            >
              {item.title}
            </TableOfContents.Heading>
            {item.content}
          </TableOfContents.Section>
        ))}
      </TableOfContents.Content>
    </TableOfContents.Wrapper>
  );
};

const UserInformation_Query = graphql(/* GraphQL */ `
  query GetViewUserData($id: UUID!) {
    user(id: $id, trashed: WITH) {
      ...UserInfo
    }

    ...JobPlacementOptions
  }
`);

interface RouteParams extends Record<string, string> {
  userId: Scalars["ID"]["output"];
}

const UserInformationPage = () => {
  const { userId } = useRequiredParams<RouteParams>("userId");
  const intl = useIntl();
  const [{ data, fetching, error }] = useQuery({
    query: UserInformation_Query,
    variables: { id: userId },
  });

  const user = data?.user;

  return (
    <AdminContentWrapper>
      <SEO
        title={intl.formatMessage({
          defaultMessage: "Candidate details",
          id: "dj8GiH",
          description: "Page title for the individual user page",
        })}
      />
      <Pending fetching={fetching} error={error}>
        {user ? (
          <UserInformation userQuery={user} jobPlacementOptions={data} />
        ) : (
          <ThrowNotFound />
        )}
      </Pending>
    </AdminContentWrapper>
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
    <UserInformationPage />
  </RequireAuth>
);

Component.displayName = "AdminUserInformationPage";

export default UserInformationPage;
