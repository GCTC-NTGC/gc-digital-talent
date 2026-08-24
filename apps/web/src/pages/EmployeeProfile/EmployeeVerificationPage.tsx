import { useIntl } from "react-intl";
import { useQuery } from "urql";

import { commonMessages } from "@gc-digital-talent/i18n";
import type { FragmentType } from "@gc-digital-talent/graphql";
import { getFragment, graphql } from "@gc-digital-talent/graphql";
import {
  Pending,
  Separator,
  TableOfContents,
  ThrowNotFound,
} from "@gc-digital-talent/ui";
import { ROLE_NAME } from "@gc-digital-talent/auth";
import { useLocalStorage } from "@gc-digital-talent/storage";

import RequireAuth from "~/components/RequireAuth/RequireAuth";
import profileMessages from "~/messages/profileMessages";
import StatusItem from "~/components/StatusItem/StatusItem";
import { KEY_NEW_FEATURE_EMPLOYEE_PROFILE } from "~/constants/storageKeys";

import EmployeeVerificationSection from "../../components/EmployeeVerificationSection/EmployeeVerificationSection";
import SharedTocLinks from "./components/SharedTocLinks";
import NewFeatureMessage from "./components/NewFeatureMessage";

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
  const user = getFragment(EmployeeVerification_Fragment, userQuery);

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
          <SharedTocLinks />
        </TableOfContents.Navigation>
        <TableOfContents.Content>
          {noticeIsVisible ? (
            <div className="mb-6">
              <NewFeatureMessage onDismiss={() => setNoticeIsVisible(false)} />
            </div>
          ) : null}
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
