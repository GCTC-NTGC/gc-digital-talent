import { useIntl } from "react-intl";
import { useQuery } from "urql";
import ChartBarSquareIcon from "@heroicons/react/24/outline/ChartBarSquareIcon";
import LockClosedIcon from "@heroicons/react/24/outline/LockClosedIcon";

import { commonMessages } from "@gc-digital-talent/i18n";
import type { FragmentType } from "@gc-digital-talent/graphql";
import { getFragment, graphql } from "@gc-digital-talent/graphql";
import {
  Heading,
  Pending,
  Separator,
  TableOfContents,
  ThrowNotFound,
} from "@gc-digital-talent/ui";
import { ROLE_NAME } from "@gc-digital-talent/auth";
import { NotFoundError } from "@gc-digital-talent/helpers";
import { useLocalStorage } from "@gc-digital-talent/storage";

import RequireAuth from "~/components/RequireAuth/RequireAuth";
import profileMessages from "~/messages/profileMessages";
import StatusItem from "~/components/StatusItem/StatusItem";
import { KEY_NEW_FEATURE_EMPLOYEE_PROFILE } from "~/constants/storageKeys";

import messages from "./messages";
import GoalsWorkStyleSection, {
  EmployeeProfileGoalsWorkStyle_Fragment,
} from "./components/GoalsWorkStyleSection/GoalsWorkStyleSection";
import CareerDevelopmentSection from "./components/CareerDevelopmentSection/CareerDevelopmentSection";
import { EmployeeProfileCareerDevelopment_Fragment } from "./components/CareerDevelopmentSection/utils";
import NextRoleSection, {
  EmployeeProfileNextRole_Fragment,
} from "./components/NextRoleSection/NextRoleSection";
import CareerObjectiveSection, {
  EmployeeProfileCareerObjective_Fragment,
} from "./components/CareerObjective/CareerObjectiveSection";
import {
  getCareerDevelopmentStatus,
  getCareerObjectiveStatus,
  getGoalsWorkStyleStatus,
  getNextRoleStatus,
  getCareerPlanningStatus,
} from "./utils";
import SharedTocLinks from "./components/SharedTocLinks";
import NewFeatureMessage from "./components/NewFeatureMessage";

const SECTION_ID = {
  CAREER_PLANNING: "career-planning-section",
  CAREER_DEVELOPMENT: "career-development-section",
  NEXT_ROLE: "next-role-section",
  CAREER_OBJECTIVE: "career-objective-section",
  GOALS_WORK_STYLE: "goals-work-style-section",
};

const CareerPlanningOptions_Fragment = graphql(/** GraphQL */ `
  fragment CareerPlanningOptions on Query {
    ...EmployeeProfileCareerDevelopmentOptions
    ...EmployeeProfileNextRoleOptions
    ...EmployeeProfileCareerObjectiveOptions
  }
`);

export const CareerPlanning_Fragment = graphql(/** GraphQL */ `
  fragment CareerPlanning on User {
    isVerifiedGovEmployee
    employeeProfile {
      ...EmployeeProfileCareerDevelopment
      ...EmployeeProfileCareerObjective
      ...EmployeeProfileNextRole
      ...EmployeeProfileGoalsWorkStyle
    }
  }
`);

interface CareerPlanningProps {
  userQuery: FragmentType<typeof CareerPlanning_Fragment>;
  optionsQuery: FragmentType<typeof CareerPlanningOptions_Fragment>;
}

export const CareerPlanning = ({
  userQuery,
  optionsQuery,
}: CareerPlanningProps) => {
  const intl = useIntl();
  const user = getFragment(CareerPlanning_Fragment, userQuery);
  const options = getFragment(CareerPlanningOptions_Fragment, optionsQuery);

  if (!user?.employeeProfile) {
    throw new NotFoundError();
  }

  // for validation
  const careerDevelopment = getFragment(
    EmployeeProfileCareerDevelopment_Fragment,
    user.employeeProfile,
  );
  const nextRole = getFragment(
    EmployeeProfileNextRole_Fragment,
    user.employeeProfile,
  );
  const careerObjective = getFragment(
    EmployeeProfileCareerObjective_Fragment,
    user.employeeProfile,
  );
  const goalsWorkStyle = getFragment(
    EmployeeProfileGoalsWorkStyle_Fragment,
    user.employeeProfile,
  );

  const statusDescriptions = {
    error: commonMessages.incomplete,
    success: commonMessages.complete,
    optional: commonMessages.optional,
    locked: commonMessages.notAvailable,
  };

  const overallStatus = getCareerPlanningStatus(
    !!user.isVerifiedGovEmployee,
    careerDevelopment,
    nextRole,
    careerObjective,
    goalsWorkStyle,
  );
  const careerDevelopmentStatus = getCareerDevelopmentStatus(
    !!user.isVerifiedGovEmployee,
    careerDevelopment,
  );
  const nextRoleStatus = getNextRoleStatus(
    !!user.isVerifiedGovEmployee,
    nextRole,
  );
  const careerObjectiveStatus = getCareerObjectiveStatus(
    !!user.isVerifiedGovEmployee,
    careerObjective,
  );
  const goalsWorkStyleStatus = getGoalsWorkStyleStatus(
    !!user.isVerifiedGovEmployee,
    goalsWorkStyle,
  );

  const [noticeIsVisible, setNoticeIsVisible] = useLocalStorage<boolean>(
    KEY_NEW_FEATURE_EMPLOYEE_PROFILE,
    true,
  );

  return (
    <>
      <TableOfContents.Wrapper>
        <TableOfContents.Navigation>
          <TableOfContents.List className="list-none">
            <TableOfContents.ListItem>
              <StatusItem
                asListItem={false}
                title={intl.formatMessage(commonMessages.careerPlanning)}
                status={overallStatus}
                scrollTo={SECTION_ID.CAREER_PLANNING}
                hiddenContextPrefix={intl.formatMessage(
                  statusDescriptions[overallStatus],
                )}
              />
              <TableOfContents.List className="list-none pl-3">
                <TableOfContents.ListItem>
                  <StatusItem
                    asListItem={false}
                    title={intl.formatMessage(messages.careerDevelopment)}
                    status={careerDevelopmentStatus}
                    scrollTo={SECTION_ID.CAREER_DEVELOPMENT}
                    hiddenContextPrefix={intl.formatMessage(
                      statusDescriptions[careerDevelopmentStatus],
                    )}
                  />
                </TableOfContents.ListItem>
                <TableOfContents.ListItem>
                  <StatusItem
                    asListItem={false}
                    title={intl.formatMessage(messages.yourNextRole)}
                    status={nextRoleStatus}
                    scrollTo={SECTION_ID.NEXT_ROLE}
                    hiddenContextPrefix={intl.formatMessage(
                      statusDescriptions[nextRoleStatus],
                    )}
                  />
                </TableOfContents.ListItem>
                <TableOfContents.ListItem>
                  <StatusItem
                    asListItem={false}
                    title={intl.formatMessage(messages.careerObjective)}
                    status={careerObjectiveStatus}
                    scrollTo={SECTION_ID.CAREER_OBJECTIVE}
                    hiddenContextPrefix={intl.formatMessage(
                      statusDescriptions[careerObjectiveStatus],
                    )}
                  />
                </TableOfContents.ListItem>
                <TableOfContents.ListItem>
                  <StatusItem
                    asListItem={false}
                    title={intl.formatMessage(messages.goalsWorkStyle)}
                    status={goalsWorkStyleStatus}
                    scrollTo={SECTION_ID.GOALS_WORK_STYLE}
                    hiddenContextPrefix={intl.formatMessage(
                      statusDescriptions[goalsWorkStyleStatus],
                    )}
                  />
                </TableOfContents.ListItem>
              </TableOfContents.List>
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
            <TableOfContents.Section id={SECTION_ID.CAREER_PLANNING}>
              <Heading
                level="h2"
                icon={
                  user.isVerifiedGovEmployee
                    ? ChartBarSquareIcon
                    : LockClosedIcon
                }
                {...(user.isVerifiedGovEmployee && { color: "primary" })}
                className="mt-0 font-normal sm:text-left"
              >
                {intl.formatMessage(commonMessages.careerPlanning)}
              </Heading>
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "We'd like to learn more about the career path you'd like to follow. Providing information about preferences and aspirations will help talent managers make more informed decisions when you've been nominated for a promotion, lateral movement, or professional development opportunity.",
                  id: "6KS1jD",
                  description: "Lead-in text explaining the users career plan",
                })}
              </p>
            </TableOfContents.Section>
            <TableOfContents.Section id={SECTION_ID.CAREER_DEVELOPMENT}>
              <CareerDevelopmentSection
                employeeProfileQuery={user.employeeProfile}
                careerDevelopmentOptionsQuery={options}
                isVerifiedGovEmployee={!!user.isVerifiedGovEmployee}
              />
            </TableOfContents.Section>
            <TableOfContents.Section id={SECTION_ID.NEXT_ROLE}>
              <NextRoleSection
                employeeProfileQuery={user.employeeProfile}
                optionsQuery={options}
                isVerifiedGovEmployee={!!user.isVerifiedGovEmployee}
              />
            </TableOfContents.Section>
            <TableOfContents.Section id={SECTION_ID.CAREER_OBJECTIVE}>
              <CareerObjectiveSection
                employeeProfileQuery={user.employeeProfile}
                optionsQuery={options}
                isVerifiedGovEmployee={!!user.isVerifiedGovEmployee}
              />
            </TableOfContents.Section>
            <TableOfContents.Section id={SECTION_ID.GOALS_WORK_STYLE}>
              <GoalsWorkStyleSection
                employeeProfileQuery={user.employeeProfile}
                isVerifiedGovEmployee={!!user.isVerifiedGovEmployee}
              />
            </TableOfContents.Section>
          </div>
        </TableOfContents.Content>
      </TableOfContents.Wrapper>
    </>
  );
};

const CareerPlanningPage_Query = graphql(/** GraphQL */ `
  query CareerPlanningPage {
    ...CareerPlanningOptions
    me {
      ...CareerPlanning
    }
  }
`);

const CareerPlanningPage = () => {
  const intl = useIntl();
  const [{ data, fetching, error }] = useQuery({
    query: CareerPlanningPage_Query,
  });

  return (
    <Pending fetching={fetching} error={error}>
      {data?.me ? (
        <CareerPlanning userQuery={data.me} optionsQuery={data} />
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
    <CareerPlanningPage />
  </RequireAuth>
);

Component.displayName = "CareerPlanningPage";

export default Component;
