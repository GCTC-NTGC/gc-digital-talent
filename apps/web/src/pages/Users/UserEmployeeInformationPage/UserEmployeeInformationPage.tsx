import { useIntl } from "react-intl";
import ChartBarSquareIcon from "@heroicons/react/24/outline/ChartBarSquareIcon";
import FlagIcon from "@heroicons/react/24/outline/FlagIcon";
import ArrowsRightLeftIcon from "@heroicons/react/24/outline/ArrowsRightLeftIcon";
import { useQuery } from "urql";

import {
  Accordion,
  Card,
  Heading,
  Pending,
  TableOfContents,
  ThrowNotFound,
  Notice,
  Separator,
} from "@gc-digital-talent/ui";
import {
  FragmentType,
  Scalars,
  getFragment,
  graphql,
} from "@gc-digital-talent/graphql";
import { ROLE_NAME } from "@gc-digital-talent/auth";
import { commonMessages, navigationMessages } from "@gc-digital-talent/i18n";
import { useFeatureFlags } from "@gc-digital-talent/env";

import SEO from "~/components/SEO/SEO";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import useRequiredParams from "~/hooks/useRequiredParams";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import CommunityInterest, {
  CommunityInterestOptions_Fragment,
} from "~/components/CommunityInterest/CommunityInterest";
import { NextRoleAndCareerObjective_Fragment } from "~/components/NextRoleAndCareerObjective/NextRoleAndCareerObjective";
import workforceAdjustmentMessages from "~/messages/workforceAdjustmentMessages";
import UserWorkforceAdjustment, {
  UserWorkforceAdjustment_Fragment,
} from "~/components/WorkforceAdjustment/UserWorkforceAdjustment";

import CareerDevelopmentSection, {
  CareerDevelopmentOptions_Fragment,
} from "./components/CareerDevelopmentSection";
import NextRoleAndCareerObjective from "./components/NextRoleAndCareerObjective";
import GoalsWorkStyleSection from "./components/GoalsWorkStyleSection";
import DownloadButton from "../DownloadButton";

const SECTION_ID = {
  COMMUNITY_INTEREST: "community-interest-section",
  CAREER_PLANNING: "career-planning-section",
  CAREER_DEVELOPMENT: "career-development-section",
  NEXT_ROLE_AND_CAREER_OBJECTIVE: "next-role-and-career-objective-section",
  GOALS_WORK_STYLE: "goals-work-style-section",
  WORKFORCE_ADJUSTMENT_SECTION: "workforce-adjustment-section",
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
  userId: Scalars["UUID"]["output"];
  employeeProfileQuery: FragmentType<typeof UserEmployeeInformation_Fragment>;
  wfaQuery: FragmentType<typeof UserWorkforceAdjustment_Fragment>;
  communityInterestOptionsQuery: FragmentType<
    typeof CommunityInterestOptions_Fragment
  >;
  careerDevelopmentOptionsQuery: FragmentType<
    typeof CareerDevelopmentOptions_Fragment
  >;
  userQuery: FragmentType<typeof NextRoleAndCareerObjective_Fragment>;
}

export const UserEmployeeInformation = ({
  userId,
  employeeProfileQuery,
  wfaQuery,
  careerDevelopmentOptionsQuery,
  communityInterestOptionsQuery,
  userQuery,
}: UserEmployeeInformationProps) => {
  const intl = useIntl();
  const { workforceAdjustment } = useFeatureFlags();

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
                <TableOfContents.AnchorLink
                  id={SECTION_ID.NEXT_ROLE_AND_CAREER_OBJECTIVE}
                >
                  {intl.formatMessage({
                    defaultMessage: "Next role and career objective",
                    id: "QhFxW1",
                    description:
                      "Title for next role and career objective section",
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
          {workforceAdjustment && (
            <TableOfContents.ListItem>
              <TableOfContents.AnchorLink
                id={SECTION_ID.WORKFORCE_ADJUSTMENT_SECTION}
              >
                {intl.formatMessage(workforceAdjustmentMessages.wfa)}
              </TableOfContents.AnchorLink>
            </TableOfContents.ListItem>
          )}
        </TableOfContents.List>
        <Separator decorative orientation="horizontal" space="xs" />
        <DownloadButton id={userId} />
      </TableOfContents.Navigation>
      <TableOfContents.Content>
        <div className="flex flex-col gap-y-6">
          <TableOfContents.Section id={SECTION_ID.COMMUNITY_INTEREST}>
            <Heading
              level="h2"
              size="h3"
              icon={FlagIcon}
              color="secondary"
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
            {employeeProfile?.communityInterests?.length &&
            employeeProfile.communityInterests.length > 0 ? (
              <Accordion.Root type="multiple" mode="card" className="my-6">
                {employeeProfile.communityInterests?.map(
                  (communityInterest) => (
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
                  ),
                )}
              </Accordion.Root>
            ) : (
              <Notice.Root className="my-6">
                <Notice.Content>
                  {intl.formatMessage({
                    defaultMessage:
                      "This employee hasn’t added any functional communities to their profile.",
                    id: "14DTOr",
                    description:
                      "Description for Community interest section null state",
                  })}
                </Notice.Content>
              </Notice.Root>
            )}
          </TableOfContents.Section>
          <TableOfContents.Section id={SECTION_ID.CAREER_PLANNING}>
            <Heading
              level="h2"
              size="h3"
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

          <Accordion.Root mode="card" type="multiple">
            <Accordion.Item
              value={SECTION_ID.CAREER_DEVELOPMENT}
              id={SECTION_ID.CAREER_DEVELOPMENT}
            >
              <Accordion.Trigger
                as="h3"
                subtitle={intl.formatMessage({
                  defaultMessage:
                    "This employee's preferences around organizations, promotion, mentorship, and executive opportunities.",
                  id: "Y82TrM",
                  description:
                    "Title for Career development preferences section of user employee information page",
                })}
              >
                <span className="font-normal">
                  {intl.formatMessage({
                    defaultMessage: "Career development preferences",
                    id: "wrolJv",
                    description:
                      "Title for Career development preferences section of user employee information page",
                  })}
                </span>
              </Accordion.Trigger>
              <Accordion.Content>
                <CareerDevelopmentSection
                  employeeProfileQuery={employeeProfile}
                  careerDevelopmentOptionsQuery={careerDevelopmentOptionsQuery}
                />
              </Accordion.Content>
            </Accordion.Item>

            <Accordion.Item
              value={SECTION_ID.NEXT_ROLE_AND_CAREER_OBJECTIVE}
              id={SECTION_ID.NEXT_ROLE_AND_CAREER_OBJECTIVE}
            >
              <Accordion.Trigger
                as="h3"
                subtitle={intl.formatMessage({
                  defaultMessage:
                    "The next role the employee intends to achieve and their main career objective, including classification, work streams, and departments.",
                  id: "96ClZg",
                  description:
                    "Subtitle for next role and career objective section",
                })}
              >
                <span className="font-normal">
                  {intl.formatMessage({
                    defaultMessage: "Next role and career objective",
                    id: "QhFxW1",
                    description:
                      "Title for next role and career objective section",
                  })}
                </span>
              </Accordion.Trigger>
              <Accordion.Content>
                <NextRoleAndCareerObjective
                  nextRoleAndCareerObjectiveQuery={userQuery}
                  sectionKey={SECTION_ID.NEXT_ROLE_AND_CAREER_OBJECTIVE}
                  nextRoleDialogSubtitle={intl.formatMessage({
                    defaultMessage:
                      "Learn more about the role this employee is seeking next in their career path.",
                    id: "NQgGHA",
                    description:
                      "Subtitle for dialog viewing next role info for employees",
                  })}
                  dialogSubtitle={intl.formatMessage({
                    defaultMessage:
                      "Learn more about the role this employee is working toward as their main career objective.",
                    id: "aZEnPH",
                    description:
                      "Subtitle for dialog viewing career objective info for employees",
                  })}
                />
              </Accordion.Content>
            </Accordion.Item>

            <Accordion.Item
              value={SECTION_ID.GOALS_WORK_STYLE}
              id={SECTION_ID.GOALS_WORK_STYLE}
            >
              <Accordion.Trigger
                as="h3"
                subtitle={intl.formatMessage({
                  defaultMessage:
                    "The employee's opportunity to describe themself, how they approach their career, and how they work best.",
                  id: "q3scRY",
                  description: "Subtitle for goals and work style section",
                })}
              >
                <span className="font-normal">
                  {intl.formatMessage({
                    defaultMessage: "Goals and work style",
                    id: "5sZWgB",
                    description:
                      "Title for Goals and work style section of user employee information page",
                  })}
                </span>
              </Accordion.Trigger>
              <Accordion.Content>
                <GoalsWorkStyleSection employeeProfileQuery={employeeProfile} />
              </Accordion.Content>
            </Accordion.Item>
          </Accordion.Root>
          {workforceAdjustment && (
            <TableOfContents.Section
              id={SECTION_ID.WORKFORCE_ADJUSTMENT_SECTION}
            >
              <Heading
                level="h2"
                size="h3"
                icon={ArrowsRightLeftIcon}
                color="secondary"
                className="mb-6 font-normal sm:justify-start sm:text-left"
              >
                {intl.formatMessage(workforceAdjustmentMessages.wfa)}
              </Heading>
              <p className="my-6">
                {intl.formatMessage({
                  defaultMessage:
                    "Learn more about this employee’s workforce adjustment situation.",
                  id: "pSP4YT",
                  description:
                    "Lead in text for a users workforce adjustment information",
                })}
              </p>
              <Card>
                <UserWorkforceAdjustment query={wfaQuery} isAdmin />
              </Card>
            </TableOfContents.Section>
          )}
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
      ...NextRoleAndCareerObjective
      ...UserWorkforceAdjustment
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
            userId={userId}
            employeeProfileQuery={data?.user?.employeeProfile}
            userQuery={data.user}
            careerDevelopmentOptionsQuery={data}
            communityInterestOptionsQuery={data}
            wfaQuery={data.user}
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

export default Component;
