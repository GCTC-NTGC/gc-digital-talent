import { useIntl } from "react-intl";
import { useQuery } from "urql";
import ChartBarSquareIcon from "@heroicons/react/24/outline/ChartBarSquareIcon";

import { commonMessages, navigationMessages } from "@gc-digital-talent/i18n";
import {
  EmployeeProfilePageQuery,
  getFragment,
  graphql,
} from "@gc-digital-talent/graphql";
import {
  Heading,
  Pending,
  TableOfContents,
  ThrowNotFound,
} from "@gc-digital-talent/ui";
import { ROLE_NAME } from "@gc-digital-talent/auth";
import { NotFoundError, UnauthorizedError } from "@gc-digital-talent/helpers";

import Hero from "~/components/Hero";
import SEO from "~/components/SEO/SEO";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import useRoutes from "~/hooks/useRoutes";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import { isVerifiedGovEmployee } from "~/utils/userUtils";
import profileMessages from "~/messages/profileMessages";
import StatusItem from "~/components/StatusItem/StatusItem";
import {
  hasAllEmptyFields as careerDevelopmentHasAllEmptyFields,
  hasEmptyRequiredFields as careerDevelopmentHasEmptyRequiredFields,
} from "~/validators/employeeProfile/careerDevelopment";
import {
  hasAllEmptyFields as goalsWorkStyleHasAllEmptyFields,
  hasEmptyRequiredFields as goalsWorkStyleHasEmptyRequiredFields,
} from "~/validators/employeeProfile/goalsWorkStyle";

import messages from "./messages";
import GoalsWorkStyleSection, {
  EmployeeProfileGoalsWorkStyle_Fragment,
} from "./components/GoalsWorkStyleSection/GoalsWorkStyleSection";
import CareerDevelopmentSection from "./components/CareerDevelopmentSection/CareerDevelopmentSection";
import { EmployeeProfileCareerDevelopment_Fragment } from "./components/CareerDevelopmentSection/utils";

const SECTION_ID = {
  CAREER_PLANNING: "career-planning-section",
  CAREER_DEVELOPMENT: "career-development-section",
  DREAM_ROLE: "dream-role-section",
  GOALS_WORK_STYLE: "goals-work-style-section",
};

const EmployeeProfile_Fragment = graphql(/** GraphQL */ `
  fragment EmployeeProfile on User {
    isGovEmployee
    workEmail
    isWorkEmailVerified
    employeeProfile {
      ...EmployeeProfileGoalsWorkStyle
      ...EmployeeProfileCareerDevelopment
    }
  }
`);

interface EmployeeProfileProps {
  employeeProfileQuery: EmployeeProfilePageQuery;
}

const EmployeeProfile = ({ employeeProfileQuery }: EmployeeProfileProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const user = getFragment(EmployeeProfile_Fragment, employeeProfileQuery.me);

  if (!user?.employeeProfile) {
    throw new NotFoundError();
  }

  if (
    !isVerifiedGovEmployee({
      isGovEmployee: user.isGovEmployee,
      workEmail: user.workEmail,
      isWorkEmailVerified: user.isWorkEmailVerified,
    })
  ) {
    throw new UnauthorizedError(
      intl.formatMessage({
        defaultMessage: "Not a verified employee",
        id: "Ljv0T9",
        description: "Error message for unauthorized employee access",
      }),
    );
  }

  const pageTitle = intl.formatMessage({
    defaultMessage: "Your employee profile",
    id: "u+lXsz",
    description: "Page title for a users employee profile",
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
        label: intl.formatMessage(navigationMessages.profileAndApplications),
        url: paths.profileAndApplications(),
      },
      {
        url: paths.employeeProfile(),
        label: intl.formatMessage({
          defaultMessage: "Employee profile",
          id: "FThj7q",
          description: "Short title for a users employee profile",
        }),
      },
    ],
  });

  const goalsWorkStyle = getFragment(
    EmployeeProfileGoalsWorkStyle_Fragment,
    user.employeeProfile,
  );
  const careerDevelopment = getFragment(
    EmployeeProfileCareerDevelopment_Fragment,
    user.employeeProfile,
  );

  return (
    <>
      <SEO title={pageTitle} description={subtitle} />
      <Hero title={pageTitle} subtitle={subtitle} crumbs={crumbs} />
      <div data-h2-wrapper="base(center, large, x1) p-tablet(center, large, x2)">
        <TableOfContents.Wrapper data-h2-padding-top="base(x3)">
          <TableOfContents.Navigation>
            <TableOfContents.List
              data-h2-padding-left="base(x.5)"
              data-h2-list-style-type="base(none)"
            >
              <TableOfContents.ListItem>
                <StatusItem
                  asListItem={false}
                  title={intl.formatMessage(commonMessages.careerPlanning)}
                  status="success"
                  scrollTo={SECTION_ID.CAREER_PLANNING}
                />
                <TableOfContents.List
                  data-h2-padding-left="base(x.5)"
                  data-h2-list-style-type="base(none)"
                >
                  <TableOfContents.ListItem>
                    <StatusItem
                      asListItem={false}
                      title={intl.formatMessage(messages.careerDevelopment)}
                      status={
                        careerDevelopmentHasAllEmptyFields(careerDevelopment)
                          ? "optional"
                          : careerDevelopmentHasEmptyRequiredFields(
                                careerDevelopment,
                              )
                            ? "error"
                            : "success"
                      }
                      scrollTo={SECTION_ID.CAREER_DEVELOPMENT}
                    />
                  </TableOfContents.ListItem>
                  <TableOfContents.ListItem>
                    <StatusItem
                      asListItem={false}
                      title={intl.formatMessage(messages.dreamRole)}
                      status="success"
                      scrollTo={SECTION_ID.DREAM_ROLE}
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
                    />
                  </TableOfContents.ListItem>
                </TableOfContents.List>
              </TableOfContents.ListItem>
            </TableOfContents.List>
          </TableOfContents.Navigation>
          <TableOfContents.Content>
            <div
              data-h2-display="base(flex)"
              data-h2-flex-direction="base(column)"
              data-h2-gap="base(x3 0)"
            >
              <TableOfContents.Section id={SECTION_ID.CAREER_PLANNING}>
                <Heading
                  level="h2"
                  Icon={ChartBarSquareIcon}
                  color="secondary"
                  data-h2-margin-top="base(0)"
                  data-h2-font-weight="base(400)"
                  data-h2-text-align="base(center) l-tablet(initial)"
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
                  careerDevelopmentOptionsQuery={employeeProfileQuery}
                />
              </TableOfContents.Section>
              <TableOfContents.Section
                id={SECTION_ID.DREAM_ROLE}
              ></TableOfContents.Section>
              <TableOfContents.Section id={SECTION_ID.GOALS_WORK_STYLE}>
                <GoalsWorkStyleSection
                  employeeProfileQuery={user.employeeProfile}
                />
              </TableOfContents.Section>
            </div>
          </TableOfContents.Content>
        </TableOfContents.Wrapper>
      </div>
    </>
  );
};

const EmployeeProfilePage_Query = graphql(/** GraphQL */ `
  query EmployeeProfilePage {
    me {
      ...EmployeeProfile
    }
    ...EmployeeProfileCareerDevelopmentOptions
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
        <EmployeeProfile employeeProfileQuery={data} />
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
