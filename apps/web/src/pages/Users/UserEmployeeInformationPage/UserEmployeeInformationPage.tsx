import { useIntl } from "react-intl";
import ChartBarSquareIcon from "@heroicons/react/24/outline/ChartBarSquareIcon";
import { useQuery } from "urql";
import FlagIcon from "@heroicons/react/24/outline/FlagIcon";

import {
  Accordion,
  Heading,
  Pending,
  TableOfContents,
  ThrowNotFound,
} from "@gc-digital-talent/ui";
import {
  FragmentType,
  Scalars,
  getFragment,
  graphql,
} from "@gc-digital-talent/graphql";
import { ROLE_NAME } from "@gc-digital-talent/auth";
import { commonMessages, navigationMessages } from "@gc-digital-talent/i18n";

import SEO from "~/components/SEO/SEO";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import useRequiredParams from "~/hooks/useRequiredParams";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import CommunityInterest, {
  CommunityInterestOptions_Fragment,
} from "~/components/CommunityInterest/CommunityInterest";

import CareerDevelopmentSection, {
  CareerDevelopmentOptions_Fragment,
} from "./components/CareerDevelopmentSection";
import NextRoleSection from "./components/NextRoleSection";
import CareerObjectiveSection from "./components/CareerObjectiveSection";
import GoalsWorkStyleSection from "./components/GoalsWorkStyleSection";

const SECTION_ID = {
  COMMUNITY_INTEREST: "community-interest-section",
  CAREER_PLANNING: "career-planning-section",
  CAREER_DEVELOPMENT: "career-development-section",
  NEXT_ROLE: "next-role-section",
  CAREER_OBJECTIVE: "career-objective-section",
  GOALS_WORK_STYLE: "goals-work-style-section",
};

const UserEmployeeInformation_Fragment = graphql(/* GraphQL */ `
  fragment UserEmployeeInformation on EmployeeProfile {
    communityInterests {
      id
      community {
        name {
          localized
        }
      }
      ...CommunityInterest
    }
    ...CareerDevelopment
    ...NextRole
    ...CareerObjective
    ...GoalsWorkStyle
  }
`);

interface UserEmployeeInformationProps {
  employeeProfileQuery: FragmentType<typeof UserEmployeeInformation_Fragment>;
  communityInterestOptionsQuery: FragmentType<
    typeof CommunityInterestOptions_Fragment
  >;
  careerDevelopmentOptionsQuery: FragmentType<
    typeof CareerDevelopmentOptions_Fragment
  >;
}

export const UserEmployeeInformation = ({
  employeeProfileQuery,
  careerDevelopmentOptionsQuery,
  communityInterestOptionsQuery,
}: UserEmployeeInformationProps) => {
  const intl = useIntl();

  const employeeProfile = getFragment(
    UserEmployeeInformation_Fragment,
    employeeProfileQuery,
  );

  return (
    <TableOfContents.Wrapper>
      <TableOfContents.Navigation>
        <TableOfContents.List>
          <TableOfContents.ListItem>
            <TableOfContents.AnchorLink id={SECTION_ID.COMMUNITY_INTEREST}>
              {intl.formatMessage(commonMessages.communityInterest)}
            </TableOfContents.AnchorLink>
          </TableOfContents.ListItem>
          <TableOfContents.ListItem>
            <TableOfContents.AnchorLink id={SECTION_ID.CAREER_PLANNING}>
              {intl.formatMessage(commonMessages.careerPlanning)}
            </TableOfContents.AnchorLink>
            <TableOfContents.List>
              <TableOfContents.ListItem>
                <TableOfContents.AnchorLink id={SECTION_ID.CAREER_DEVELOPMENT}>
                  {intl.formatMessage({
                    defaultMessage: "Career development preferences",
                    id: "wrolJv",
                    description:
                      "Title for Career development preferences section of user employee information page",
                  })}
                </TableOfContents.AnchorLink>
              </TableOfContents.ListItem>
              <TableOfContents.ListItem>
                <TableOfContents.AnchorLink id={SECTION_ID.NEXT_ROLE}>
                  {intl.formatMessage({
                    defaultMessage: "Next role",
                    id: "XdOWYL",
                    description:
                      "Title for Next role section of user employee information page",
                  })}
                </TableOfContents.AnchorLink>
              </TableOfContents.ListItem>
              <TableOfContents.ListItem>
                <TableOfContents.AnchorLink id={SECTION_ID.CAREER_OBJECTIVE}>
                  {intl.formatMessage({
                    defaultMessage: "Career objective",
                    id: "ISPFsQ",
                    description:
                      "Title for Career objective section of user employee information page",
                  })}
                </TableOfContents.AnchorLink>
              </TableOfContents.ListItem>
              <TableOfContents.ListItem>
                <TableOfContents.AnchorLink id={SECTION_ID.GOALS_WORK_STYLE}>
                  {intl.formatMessage({
                    defaultMessage: "Goals and work style",
                    id: "5sZWgB",
                    description:
                      "Title for Goals and work style section of user employee information page",
                  })}
                </TableOfContents.AnchorLink>
              </TableOfContents.ListItem>
            </TableOfContents.List>
          </TableOfContents.ListItem>
        </TableOfContents.List>
      </TableOfContents.Navigation>
      <TableOfContents.Content>
        <div className="flex flex-col gap-y-6">
          <TableOfContents.Section id={SECTION_ID.COMMUNITY_INTEREST}>
            <Heading
              level="h2"
              icon={FlagIcon}
              color="secondary"
              center
              className="mt-0 font-normal sm:justify-start sm:text-left"
            >
              {intl.formatMessage(commonMessages.communityInterest)}
            </Heading>
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "This employee has agreed to share their profile with the following functional communities for job opportunities or training.",
                id: "d8HawO",
                description:
                  "Description for Community interest section of user employee information page",
              })}
            </p>
            <Accordion.Root type="multiple" mode="card" className="my-6">
              {employeeProfile.communityInterests?.map((communityInterest) => (
                <Accordion.Item
                  value={communityInterest.id}
                  key={communityInterest.id}
                >
                  <Accordion.Trigger as="h3">
                    {communityInterest.community?.name?.localized ??
                      intl.formatMessage(commonMessages.notAvailable)}
                  </Accordion.Trigger>
                  <Accordion.Content>
                    <CommunityInterest
                      communityInterestQuery={communityInterest}
                      communityInterestOptionsQuery={
                        communityInterestOptionsQuery
                      }
                    />
                  </Accordion.Content>
                </Accordion.Item>
              ))}
            </Accordion.Root>
          </TableOfContents.Section>
          <TableOfContents.Section id={SECTION_ID.CAREER_PLANNING}>
            <Heading
              level="h2"
              icon={ChartBarSquareIcon}
              color="secondary"
              className="mt-0 font-normal sm:justify-start sm:text-left"
            >
              {intl.formatMessage(commonMessages.careerPlanning)}
            </Heading>
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "Learn more about this employee's career aspirations.",
                id: "yozvgX",
                description:
                  "Description for Career planning section of user employee information page",
              })}
            </p>
          </TableOfContents.Section>
          <TableOfContents.Section id={SECTION_ID.CAREER_DEVELOPMENT}>
            <Heading level="h3" size="h6">
              {intl.formatMessage({
                defaultMessage: "Career development preferences",
                id: "wrolJv",
                description:
                  "Title for Career development preferences section of user employee information page",
              })}
            </Heading>
            <p className="my-6">
              {intl.formatMessage({
                defaultMessage:
                  "Find out about their interest in a variety of specific options related to recruitment, mentorship, and promotional opportunities.",
                id: "Ll9cyc",
                description:
                  "Description for Career development preferences section of user employee information page",
              })}
            </p>
            <CareerDevelopmentSection
              employeeProfileQuery={employeeProfile}
              careerDevelopmentOptionsQuery={careerDevelopmentOptionsQuery}
            />
          </TableOfContents.Section>
          <TableOfContents.Section id={SECTION_ID.NEXT_ROLE}>
            <Heading level="h3" size="h6">
              {intl.formatMessage({
                defaultMessage: "Next role",
                id: "XdOWYL",
                description:
                  "Title for Next role section of user employee information page",
              })}
            </Heading>
            <p className="my-6">
              {intl.formatMessage({
                defaultMessage:
                  "In this section, the employee can share in which role they see themselves next.",
                id: "SqDb3H",
                description:
                  "Description for Next role section of user employee information page",
              })}
            </p>
            <NextRoleSection employeeProfileQuery={employeeProfile} />
          </TableOfContents.Section>
          <TableOfContents.Section id={SECTION_ID.CAREER_OBJECTIVE}>
            <Heading level="h3" size="h6">
              {intl.formatMessage({
                defaultMessage: "Career objective",
                id: "ISPFsQ",
                description:
                  "Title for Career objective section of user employee information page",
              })}
            </Heading>
            <p className="my-6">
              {intl.formatMessage({
                defaultMessage:
                  "We ask employees to describe their ultimate career objective. This is what they've answered.",
                id: "3yMRCt",
                description:
                  "Description for Career objective section of user employee information page",
              })}
            </p>
            <CareerObjectiveSection employeeProfileQuery={employeeProfile} />
          </TableOfContents.Section>
          <TableOfContents.Section id={SECTION_ID.GOALS_WORK_STYLE}>
            <Heading level="h3" size="h6">
              {intl.formatMessage({
                defaultMessage: "Goals and work style",
                id: "5sZWgB",
                description:
                  "Title for Goals and work style section of user employee information page",
              })}
            </Heading>
            <p className="my-6">
              {intl.formatMessage({
                defaultMessage:
                  "Learn more about the employee and how they work.",
                id: "Q7b1X0",
                description:
                  "Description for Goals and work style section of user employee information page",
              })}
            </p>
            <GoalsWorkStyleSection employeeProfileQuery={employeeProfile} />
          </TableOfContents.Section>
        </div>
      </TableOfContents.Content>
    </TableOfContents.Wrapper>
  );
};

const UserEmployeeInformationPage_Query = graphql(/* GraphQL */ `
  query UserEmployeeInformationPage($id: UUID!) {
    user(id: $id, trashed: WITH) {
      isGovEmployee
      employeeProfile {
        ...UserEmployeeInformation
      }
    }
    ...CareerDevelopmentOptions
    ...CommunityInterestOptions
  }
`);

interface RouteParams extends Record<string, string> {
  userId: Scalars["ID"]["output"];
}

const UserEmployeeInformationPage = () => {
  const { userId } = useRequiredParams<RouteParams>("userId");
  const intl = useIntl();
  const [{ data, fetching, error }] = useQuery({
    query: UserEmployeeInformationPage_Query,
    variables: { id: userId },
  });

  return (
    <AdminContentWrapper>
      <SEO title={intl.formatMessage(navigationMessages.employeeProfileGC)} />
      <Pending fetching={fetching} error={error}>
        {data?.user?.employeeProfile && data?.user?.isGovEmployee ? (
          <UserEmployeeInformation
            employeeProfileQuery={data?.user?.employeeProfile}
            careerDevelopmentOptionsQuery={data}
            communityInterestOptionsQuery={data}
          />
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
    <UserEmployeeInformationPage />
  </RequireAuth>
);

Component.displayName = "AdminUserEmployeeInformationPage";

export default UserEmployeeInformationPage;
