import { useIntl } from "react-intl";
import { useQuery } from "urql";

import { commonMessages, navigationMessages } from "@gc-digital-talent/i18n";
import type { FragmentType } from "@gc-digital-talent/graphql";
import { getFragment, graphql } from "@gc-digital-talent/graphql";
import {
  Link,
  Pending,
  Separator,
  TableOfContents,
  ThrowNotFound,
} from "@gc-digital-talent/ui";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import RequireAuth from "~/components/RequireAuth/RequireAuth";
import profileMessages from "~/messages/profileMessages";
import StatusItem from "~/components/StatusItem/StatusItem";
import useRoutes from "~/hooks/useRoutes";

import EmployeeVerificationSection from "../../components/EmployeeVerificationSection/EmployeeVerificationSection";

const SECTION_ID = {
  EMPLOYEE_VERIFICATION: "employee-verification-section",
};

export const EmployeeVerification_Fragment = graphql(/** GraphQL */ `
  fragment EmployeeVerification on User {
    isVerifiedGovEmployee
    ...UserEmployeeVerification
  }
`);

interface EmployeeVerificationProps {
  userQuery: FragmentType<typeof EmployeeVerification_Fragment>;
}

export const EmployeeVerification = ({
  userQuery,
}: EmployeeVerificationProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const user = getFragment(EmployeeVerification_Fragment, userQuery);

  return (
    <>
      <TableOfContents.Wrapper>
        <TableOfContents.Navigation>
          <TableOfContents.List className="list-none">
            <TableOfContents.ListItem>
              <StatusItem
                asListItem={false}
                title={intl.formatMessage(commonMessages.employeeVerification)}
                status={user.isVerifiedGovEmployee ? "success" : "optional"}
                scrollTo={SECTION_ID.EMPLOYEE_VERIFICATION}
                hiddenContextPrefix={intl.formatMessage(
                  user.isVerifiedGovEmployee
                    ? commonMessages.complete
                    : commonMessages.optional,
                )}
              />
            </TableOfContents.ListItem>
          </TableOfContents.List>
          <Separator space="sm" />
          <div className="flex flex-col gap-y-3">
            <Link href={paths.profile()}>
              {intl.formatMessage(navigationMessages.applicantProfile)}
            </Link>
            <Link href={paths.accountSettings()}>
              {intl.formatMessage(navigationMessages.accountSettings)}
            </Link>
          </div>
        </TableOfContents.Navigation>
        <TableOfContents.Content>
          <div className="flex flex-col gap-y-18">
            <TableOfContents.Section id={SECTION_ID.EMPLOYEE_VERIFICATION}>
              <EmployeeVerificationSection
                userQuery={user}
                context="applicant"
              />
            </TableOfContents.Section>
          </div>
        </TableOfContents.Content>
      </TableOfContents.Wrapper>
    </>
  );
};

const EmployeeVerificationPage_Query = graphql(/** GraphQL */ `
  query EmployeeVerificationPage {
    me {
      ...EmployeeVerification
    }
  }
`);

const EmployeeVerificationPage = () => {
  const intl = useIntl();
  const [{ data, fetching, error }] = useQuery({
    query: EmployeeVerificationPage_Query,
  });

  return (
    <Pending fetching={fetching} error={error}>
      {data?.me ? (
        <EmployeeVerification userQuery={data.me} />
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
    <EmployeeVerificationPage />
  </RequireAuth>
);

Component.displayName = "EmployeeVerificationPage";

export default Component;
