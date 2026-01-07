import { useIntl } from "react-intl";
import { useQuery } from "urql";
import ChartBarSquareIcon from "@heroicons/react/24/outline/ChartBarSquareIcon";

import { commonMessages, navigationMessages } from "@gc-digital-talent/i18n";
import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import {
  Container,
  Heading,
  Pending,
  TableOfContents,
  ThrowNotFound,
} from "@gc-digital-talent/ui";
import { ROLE_NAME } from "@gc-digital-talent/auth";
import { NotFoundError, UnauthorizedError } from "@gc-digital-talent/helpers";
import { useFeatureFlags } from "@gc-digital-talent/env";

import Hero from "~/components/Hero";
import SEO from "~/components/SEO/SEO";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import useRoutes from "~/hooks/useRoutes";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import profileMessages from "~/messages/profileMessages";
import StatusItem, { Status } from "~/components/StatusItem/StatusItem";
import {
  hasAllEmptyFields as careerDevelopmentHasAllEmptyFields,
  hasEmptyRequiredFields as careerDevelopmentHasEmptyRequiredFields,
} from "~/validators/employeeProfile/careerDevelopment";
import {
  hasAllEmptyFields as nextRoleHasAllEmptyFields,
  hasEmptyRequiredFields as nextRoleHasEmptyRequiredFields,
} from "~/validators/employeeProfile/nextRole";
import {
  hasAllEmptyFields as careerObjectiveHasAllEmptyFields,
  hasEmptyRequiredFields as careerObjectiveHasEmptyRequiredFields,
} from "~/validators/employeeProfile/careerObjective";
import {
  hasAllEmptyFields as goalsWorkStyleHasAllEmptyFields,
  hasEmptyRequiredFields as goalsWorkStyleHasEmptyRequiredFields,
} from "~/validators/employeeProfile/goalsWorkStyle";
import {
  hasAllEmptyFields as wfaHasAllEmptyFields,
  hasEmptyRequiredFields as wfaHasEmptyRequiredFields,
} from "~/validators/employeeProfile/wfa";

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
import WfaSection, {
  EmployeeProfileWfa_Fragment,
} from "./components/WfaSection/WfaSection";

const SECTION_ID = {
  CAREER_PLANNING: "career-planning-section",
  CAREER_DEVELOPMENT: "career-development-section",
  NEXT_ROLE: "next-role-section",
  CAREER_OBJECTIVE: "career-objective-section",
  GOALS_WORK_STYLE: "goals-work-style-section",
  WFA: "wfa-section",
};

const EmployeeProfileOptions_Fragment = graphql(/** GraphQL */ `
  fragment EmployeeProfileOptions on Query {
    ...EmployeeProfileCareerDevelopmentOptions
    ...EmployeeProfileNextRoleOptions
    ...EmployeeProfileCareerObjectiveOptions
    ...EmployeeWfaOptions
  }
`);

const EmployeeProfile_Fragment = graphql(/** GraphQL */ `
  fragment EmployeeProfile on User {
    isVerifiedGovEmployee
    employeeProfile {
      ...EmployeeProfileCareerDevelopment
      ...EmployeeProfileCareerObjective
      ...EmployeeProfileNextRole
      ...EmployeeProfileGoalsWorkStyle
    }
    ...EmployeeProfileWfa
  }
`);

interface EmployeeProfileProps {
  employeeProfileQuery: FragmentType<typeof EmployeeProfile_Fragment>;
  optionsQuery: FragmentType<typeof EmployeeProfileOptions_Fragment>;
}

const EmployeeProfile = ({
  employeeProfileQuery,
  optionsQuery,
}: EmployeeProfileProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const { workforceAdjustment } = useFeatureFlags();
  const user = getFragment(EmployeeProfile_Fragment, employeeProfileQuery);
  const options = getFragment(EmployeeProfileOptions_Fragment, optionsQuery);

  if (!user?.employeeProfile) {
    throw new NotFoundError();
  }

  if (!user?.isVerifiedGovEmployee) {
    throw new UnauthorizedError(
      intl.formatMessage({
        defaultMessage: "Not a verified employee",
        id: "Ljv0T9",
        description: "Error message for unauthorized employee access",
      }),
    );
  }

  const pageTitle = intl.formatMessage({
    defaultMessage: "Your GC employee profile",
    id: "cUSI4/",
    description: "Page title for a user's GC employee profile",
  });

  const subtitle = intl.formatMessage({
    defaultMessage:
      "Manage your government employee information, including career development preferences and work styles.",
    id: "+RDFZH",
    description: "Description of the employee profile page",
  });

  const crumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(navigationMessages.applicantDashboard),
        url: paths.applicantDashboard(),
      },
      {
        url: paths.employeeProfile(),
        label: intl.formatMessage(navigationMessages.employeeProfileGC),
      },
    ],
  });

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
  const wfa = getFragment(EmployeeProfileWfa_Fragment, user);

  let overallStatus: Status = "success";
  if (
    careerDevelopmentHasEmptyRequiredFields(careerDevelopment) ||
    nextRoleHasEmptyRequiredFields(nextRole) ||
    careerObjectiveHasEmptyRequiredFields(careerObjective) ||
    goalsWorkStyleHasEmptyRequiredFields(goalsWorkStyle) ||
    wfaHasEmptyRequiredFields(wfa.employeeWFA)
  ) {
    overallStatus = "error";
  }

  return (
    <>
      <SEO title={pageTitle} description={subtitle} />
      <Hero title={pageTitle} subtitle={subtitle} crumbs={crumbs} />
      <Container className="my-18">
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
                    overallStatus === "error"
                      ? commonMessages.incomplete
                      : commonMessages.complete,
                  )}
                />
                <TableOfContents.List className="list-none pl-3">
                  <TableOfContents.ListItem>
                    <StatusItem
                      asListItem={false}
                      title={intl.formatMessage(messages.careerDevelopment)}
                      status={
                        careerDevelopmentHasEmptyRequiredFields(
                          careerDevelopment,
                        )
                          ? "error"
                          : careerDevelopmentHasAllEmptyFields(
                                careerDevelopment,
                              )
                            ? "optional"
                            : "success"
                      }
                      scrollTo={SECTION_ID.CAREER_DEVELOPMENT}
                      hiddenContextPrefix={intl.formatMessage(
                        careerDevelopmentHasEmptyRequiredFields(
                          careerDevelopment,
                        )
                          ? commonMessages.incomplete
                          : careerDevelopmentHasAllEmptyFields(
                                careerDevelopment,
                              )
                            ? commonMessages.optional
                            : commonMessages.complete,
                      )}
                    />
                  </TableOfContents.ListItem>
                  <TableOfContents.ListItem>
                    <StatusItem
                      asListItem={false}
                      title={intl.formatMessage(messages.yourNextRole)}
                      status={
                        nextRoleHasEmptyRequiredFields(nextRole)
                          ? "error"
                          : nextRoleHasAllEmptyFields(nextRole)
                            ? "optional"
                            : "success"
                      }
                      scrollTo={SECTION_ID.NEXT_ROLE}
                      hiddenContextPrefix={intl.formatMessage(
                        nextRoleHasEmptyRequiredFields(nextRole)
                          ? commonMessages.incomplete
                          : nextRoleHasAllEmptyFields(nextRole)
                            ? commonMessages.optional
                            : commonMessages.complete,
                      )}
                    />
                  </TableOfContents.ListItem>
                  <TableOfContents.ListItem>
                    <StatusItem
                      asListItem={false}
                      title={intl.formatMessage(messages.careerObjective)}
                      status={
                        careerObjectiveHasEmptyRequiredFields(careerObjective)
                          ? "error"
                          : careerObjectiveHasAllEmptyFields(careerObjective)
                            ? "optional"
                            : "success"
                      }
                      scrollTo={SECTION_ID.CAREER_OBJECTIVE}
                      hiddenContextPrefix={intl.formatMessage(
                        careerObjectiveHasEmptyRequiredFields(careerObjective)
                          ? commonMessages.incomplete
                          : careerObjectiveHasAllEmptyFields(careerObjective)
                            ? commonMessages.optional
                            : commonMessages.complete,
                      )}
                    />
                  </TableOfContents.ListItem>
                  <TableOfContents.ListItem>
                    <StatusItem
                      asListItem={false}
                      title={intl.formatMessage(messages.goalsWorkStyle)}
                      status={
                        goalsWorkStyleHasEmptyRequiredFields(goalsWorkStyle)
                          ? "error"
                          : goalsWorkStyleHasAllEmptyFields(goalsWorkStyle)
                            ? "optional"
                            : "success"
                      }
                      scrollTo={SECTION_ID.GOALS_WORK_STYLE}
                      hiddenContextPrefix={intl.formatMessage(
                        goalsWorkStyleHasEmptyRequiredFields(goalsWorkStyle)
                          ? commonMessages.incomplete
                          : goalsWorkStyleHasAllEmptyFields(goalsWorkStyle)
                            ? commonMessages.optional
                            : commonMessages.complete,
                      )}
                    />
                  </TableOfContents.ListItem>
                </TableOfContents.List>
                {workforceAdjustment && (
                  <TableOfContents.ListItem>
                    <StatusItem
                      asListItem={false}
                      title={intl.formatMessage(messages.wfa)}
                      status={
                        wfaHasEmptyRequiredFields(wfa.employeeWFA)
                          ? "error"
                          : wfaHasAllEmptyFields(wfa.employeeWFA)
                            ? "optional"
                            : "success"
                      }
                      scrollTo={SECTION_ID.WFA}
                      hiddenContextPrefix={intl.formatMessage(
                        wfaHasEmptyRequiredFields(wfa.employeeWFA)
                          ? commonMessages.incomplete
                          : wfaHasAllEmptyFields(wfa.employeeWFA)
                            ? commonMessages.optional
                            : commonMessages.complete,
                      )}
                    />
                  </TableOfContents.ListItem>
                )}
              </TableOfContents.ListItem>
            </TableOfContents.List>
          </TableOfContents.Navigation>
          <TableOfContents.Content>
            <div className="flex flex-col gap-y-18">
              <TableOfContents.Section id={SECTION_ID.CAREER_PLANNING}>
                <Heading
                  level="h2"
                  icon={ChartBarSquareIcon}
                  color="primary"
                  className="mt-0 font-normal sm:text-left"
                >
                  {intl.formatMessage(commonMessages.careerPlanning)}
                </Heading>
                <p>
                  {intl.formatMessage({
                    defaultMessage:
                      "We'd like to learn more about the career path you'd like to follow. Providing information about preferences and aspirations will help talent managers make more informed decisions when you've been nominated for a promotion, lateral movement, or professional development opportunity.",
                    id: "6KS1jD",
                    description:
                      "Lead-in text explaining the users career plan",
                  })}
                </p>
              </TableOfContents.Section>
              <TableOfContents.Section id={SECTION_ID.CAREER_DEVELOPMENT}>
                <CareerDevelopmentSection
                  employeeProfileQuery={user.employeeProfile}
                  careerDevelopmentOptionsQuery={options}
                />
              </TableOfContents.Section>
              <TableOfContents.Section id={SECTION_ID.NEXT_ROLE}>
                <NextRoleSection
                  employeeProfileQuery={user.employeeProfile}
                  optionsQuery={options}
                />
              </TableOfContents.Section>
              <TableOfContents.Section id={SECTION_ID.CAREER_OBJECTIVE}>
                <CareerObjectiveSection
                  employeeProfileQuery={user.employeeProfile}
                  optionsQuery={options}
                />
              </TableOfContents.Section>
              <TableOfContents.Section id={SECTION_ID.GOALS_WORK_STYLE}>
                <GoalsWorkStyleSection
                  employeeProfileQuery={user.employeeProfile}
                />
              </TableOfContents.Section>
              {workforceAdjustment && (
                <TableOfContents.Section id={SECTION_ID.WFA}>
                  <WfaSection employeeWfaQuery={user} optionsQuery={options} />
                </TableOfContents.Section>
              )}
            </div>
          </TableOfContents.Content>
        </TableOfContents.Wrapper>
      </Container>
    </>
  );
};

const EmployeeProfilePage_Query = graphql(/** GraphQL */ `
  query EmployeeProfilePage {
    ...EmployeeProfileOptions
    me {
      ...EmployeeProfile
    }
  }
`);

const EmployeeProfilePage = () => {
  const intl = useIntl();
  const [{ data, fetching, error }] = useQuery({
    query: EmployeeProfilePage_Query,
  });

  return (
    <Pending fetching={fetching} error={error}>
      {data?.me ? (
        <EmployeeProfile employeeProfileQuery={data.me} optionsQuery={data} />
      ) : (
        <ThrowNotFound
          message={intl.formatMessage(profileMessages.userNotFound)}
        />
      )}
    </Pending>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.Applicant]}>
    <EmployeeProfilePage />
  </RequireAuth>
);

Component.displayName = "EmployeeProfilePage";

export default Component;
