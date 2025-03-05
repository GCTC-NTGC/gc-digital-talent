import { useIntl } from "react-intl";
import ChartBarSquareIcon from "@heroicons/react/24/outline/ChartBarSquareIcon";
import { useQuery } from "urql";

import {
  Heading,
  Pending,
  TableOfContents,
  ThrowNotFound,
} from "@gc-digital-talent/ui";
import { FragmentType, Scalars, graphql } from "@gc-digital-talent/graphql";
import { ROLE_NAME } from "@gc-digital-talent/auth";
import { commonMessages } from "@gc-digital-talent/i18n";

import SEO from "~/components/SEO/SEO";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import useRequiredParams from "~/hooks/useRequiredParams";
import RequireAuth from "~/components/RequireAuth/RequireAuth";

import CareerDevelopmentSection, {
  CareerDevelopmentOptions_Fragment,
} from "./components/CareerDevelopmentSection";
import NextRoleSection from "./components/NextRoleSection";
import CareerObjectiveSection from "./components/CareerObjectiveSection";
import GoalsWorkStyleSection from "./components/GoalsWorkStyleSection";

const SECTION_ID = {
  CAREER_PLANNING: "career-planning-section",
  CAREER_DEVELOPMENT: "career-development-section",
  NEXT_ROLE: "next-role-section",
  CAREER_OBJECTIVE: "career-objective-section",
  GOALS_WORK_STYLE: "goals-work-style-section",
};

export const UserEmployeeInformation_Fragment = graphql(/* GraphQL */ `
  fragment UserEmployeeInformation on EmployeeProfile {
    ...CareerDevelopment
    ...NextRole
    ...CareerObjective
    ...GoalsWorkStyle
  }
`);

interface UserEmployeeInformationProps {
  employeeProfileQuery: FragmentType<typeof UserEmployeeInformation_Fragment>;
  careerDevelopmentOptionsQuery: FragmentType<
    typeof CareerDevelopmentOptions_Fragment
  >;
}

export const UserEmployeeInformation = ({
  employeeProfileQuery,
  careerDevelopmentOptionsQuery,
}: UserEmployeeInformationProps) => {
  const intl = useIntl();

  return (
    <TableOfContents.Wrapper>
      <TableOfContents.Navigation>
        <TableOfContents.List>
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
        <div
          data-h2-display="base(flex)"
          data-h2-flex-direction="base(column)"
          data-h2-gap="base(x1 0)"
        >
          <TableOfContents.Section id={SECTION_ID.CAREER_PLANNING}>
            <Heading
              level="h2"
              Icon={ChartBarSquareIcon}
              color="primary"
              data-h2-margin-top="base(0)"
              data-h2-font-weight="base(400)"
              data-h2-text-align="base(center) l-tablet(initial)"
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
            <p data-h2-margin="base(x1 0)">
              {intl.formatMessage({
                defaultMessage:
                  "Find out about their interest in a variety of specific options related to recruitment, mentorship, and promotional opportunities.",
                id: "Ll9cyc",
                description:
                  "Description for Career development preferences section of user employee information page",
              })}
            </p>
            <CareerDevelopmentSection
              employeeProfileQuery={employeeProfileQuery}
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
            <p data-h2-margin="base(x1 0)">
              {intl.formatMessage({
                defaultMessage:
                  "In this section, the employee can share in which role they see themselves next.",
                id: "SqDb3H",
                description:
                  "Description for Next role section of user employee information page",
              })}
            </p>
            <NextRoleSection employeeProfileQuery={employeeProfileQuery} />
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
            <p data-h2-margin="base(x1 0)">
              {intl.formatMessage({
                defaultMessage:
                  "We ask employees to describe their ultimate career objective. This is what they've answered.",
                id: "3yMRCt",
                description:
                  "Description for Career objective section of user employee information page",
              })}
            </p>
            <CareerObjectiveSection
              employeeProfileQuery={employeeProfileQuery}
            />
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
            <p data-h2-margin="base(x1 0)">
              {intl.formatMessage({
                defaultMessage:
                  "Learn more about the employee and how they work.",
                id: "Q7b1X0",
                description:
                  "Description for Goals and work style section of user employee information page",
              })}
            </p>
            <GoalsWorkStyleSection
              employeeProfileQuery={employeeProfileQuery}
            />
          </TableOfContents.Section>
        </div>
      </TableOfContents.Content>
    </TableOfContents.Wrapper>
  );
};

const UserEmployeeInformation_Query = graphql(/* GraphQL */ `
  query GetViewUserEmployeeData($id: UUID!) {
    user(id: $id, trashed: WITH) {
      isGovEmployee
      employeeProfile {
        ...UserEmployeeInformation
      }
    }
    ...CareerDevelopmentOptions
  }
`);

interface RouteParams extends Record<string, string> {
  userId: Scalars["ID"]["output"];
}

const UserEmployeeInformationPage = () => {
  const { userId } = useRequiredParams<RouteParams>("userId");
  const intl = useIntl();
  const [{ data, fetching, error }] = useQuery({
    query: UserEmployeeInformation_Query,
    variables: { id: userId },
  });

  return (
    <AdminContentWrapper>
      <SEO
        title={intl.formatMessage({
          defaultMessage: "Career details",
          id: "PARsli",
          description: "Page title for the user employee information page",
        })}
      />
      <Pending fetching={fetching} error={error}>
        {data?.user?.employeeProfile && data?.user?.isGovEmployee ? (
          <UserEmployeeInformation
            employeeProfileQuery={data?.user?.employeeProfile}
            careerDevelopmentOptionsQuery={data}
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
      ROLE_NAME.PoolOperator,
      ROLE_NAME.RequestResponder,
      ROLE_NAME.PlatformAdmin,
      ROLE_NAME.CommunityAdmin,
      ROLE_NAME.CommunityRecruiter,
      ROLE_NAME.ProcessOperator,
    ]}
  >
    <UserEmployeeInformationPage />
  </RequireAuth>
);

Component.displayName = "AdminUserEmployeeInformationPage";

export default UserEmployeeInformationPage;
