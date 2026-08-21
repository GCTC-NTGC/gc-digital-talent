import { useIntl } from "react-intl";
import { useQuery } from "urql";
import TrophyIcon from "@heroicons/react/24/outline/TrophyIcon";
import StarIcon from "@heroicons/react/24/outline/StarIcon";
import LockClosedIcon from "@heroicons/react/24/outline/LockClosedIcon";

import {
  Separator,
  TableOfContents,
  Heading,
  Card,
  Notice,
  Pending,
  ThrowNotFound,
} from "@gc-digital-talent/ui";
import { useLocalStorage } from "@gc-digital-talent/storage";
import { commonMessages } from "@gc-digital-talent/i18n";
import type { FragmentType } from "@gc-digital-talent/graphql";
import { getFragment, graphql } from "@gc-digital-talent/graphql";
import { ROLE_NAME } from "@gc-digital-talent/auth";
import { NotFoundError } from "@gc-digital-talent/helpers";

import { KEY_NEW_FEATURE_EMPLOYEE_PROFILE } from "~/constants/storageKeys";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import profileMessages from "~/messages/profileMessages";

import NewFeatureMessage from "./components/NewFeatureMessage";
import SharedTocLinks from "./components/SharedTocLinks";
import NominationsReceived from "./components/NominationsReceived/NominationsReceived";
import EmployeesNominated from "./components/EmployeesNominated/EmployeesNominated";

const SECTION_ID = {
  NOMINATIONS_RECEIVED: "nominations-received-section",
  EMPLOYEES_NOMINATED: "employees-nominated-section",
};

interface LockedNoticeProps {
  includePastNominationsNote?: boolean;
}

const LockedNotice = ({
  includePastNominationsNote = false,
}: LockedNoticeProps) => {
  const intl = useIntl();
  return (
    <Notice.Root className="mt-6.75 mb-6.75 text-center">
      <Notice.Title>
        {intl.formatMessage({
          defaultMessage:
            "This tool is available to Government of Canada employees",
          id: "xHQdue",
          description:
            "Notice title on sections for employee profile page when not a verified employee.",
        })}
      </Notice.Title>
      <Notice.Content>
        <p>
          {includePastNominationsNote
            ? intl.formatMessage({
                defaultMessage:
                  "If you're a current Government of Canada employee, verify your work email and ensure your career experience is up to date to unlock employee tools. Nominations from previous Government of Canada roles will continue to appear here.",
                id: "TFDGG/",
                description:
                  "Notice description on sections for employee profile page when not a verified employee.",
              })
            : intl.formatMessage({
                defaultMessage:
                  "If you're a current Government of Canada employee, verify your work email and ensure your career experience is up to date to unlock employee tools.",
                id: "TIuM+L",
                description:
                  "Notice description on sections for employee profile page when not a verified employee.",
              })}
        </p>
      </Notice.Content>
    </Notice.Root>
  );
};

export const TalentNominations_Fragment = graphql(/** GraphQL */ `
  fragment TalentNominations on User {
    isVerifiedGovEmployee
    ...NominationsReceived
    ...EmployeesNominated
  }
`);

interface TalentNominationsProps {
  userQuery: FragmentType<typeof TalentNominations_Fragment>;
}

export const TalentNominations = ({ userQuery }: TalentNominationsProps) => {
  const intl = useIntl();
  const user = getFragment(TalentNominations_Fragment, userQuery);

  if (!user) {
    throw new NotFoundError();
  }

  const isVerifiedGovEmployee = !!user.isVerifiedGovEmployee;

  const [noticeIsVisible, setNoticeIsVisible] = useLocalStorage<boolean>(
    KEY_NEW_FEATURE_EMPLOYEE_PROFILE,
    true,
  );

  return (
    <>
      <TableOfContents.Wrapper>
        <TableOfContents.Navigation>
          <TableOfContents.List className="pl-3">
            <TableOfContents.ListItem>
              <TableOfContents.AnchorLink id={SECTION_ID.NOMINATIONS_RECEIVED}>
                {intl.formatMessage({
                  defaultMessage: "Nominations you've received",
                  id: "BNhG2U",
                  description: "Title for the nominations received section",
                })}
              </TableOfContents.AnchorLink>
            </TableOfContents.ListItem>
            <TableOfContents.ListItem>
              <TableOfContents.AnchorLink id={SECTION_ID.EMPLOYEES_NOMINATED}>
                {intl.formatMessage({
                  defaultMessage: "Employees you've nominated",
                  id: "5e7fPy",
                  description: "Title for the employees nominated section",
                })}
              </TableOfContents.AnchorLink>
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
          <Card className="flex flex-col gap-y-18">
            <TableOfContents.Section id={SECTION_ID.NOMINATIONS_RECEIVED}>
              <Heading
                className="mt-0 font-normal sm:text-left"
                level="h2"
                icon={isVerifiedGovEmployee ? TrophyIcon : LockClosedIcon}
                size="h4"
                {...(isVerifiedGovEmployee && { color: "secondary" })}
              >
                {intl.formatMessage(commonMessages.nominationsReceived)}
              </Heading>
              <p className="mt-3 mb-3">
                {intl.formatMessage({
                  defaultMessage:
                    "Functional communities sometimes run talent management events that highlight employees who are demonstrating high performance, leadership or in-demand skills. In some cases, managers or senior leaders might nominate you and specify that you’re ready for promotion, a lateral move, or unique training opportunities. Nominations will automatically appear here when they’re approved and don’t require any action for you to be considered.",
                  id: "fDaeWB",
                  description:
                    "Paragraph explaining what nominations received are and how they work",
                })}
              </p>
              {!isVerifiedGovEmployee && (
                <LockedNotice includePastNominationsNote />
              )}
              <NominationsReceived
                userQuery={user}
                isVerifiedGovEmployee={isVerifiedGovEmployee}
              />
            </TableOfContents.Section>
          </Card>
          <Card className="mt-6.75 flex flex-col gap-y-18">
            <TableOfContents.Section id={SECTION_ID.EMPLOYEES_NOMINATED}>
              <Heading
                className="mt-0 font-normal sm:text-left"
                level="h2"
                icon={isVerifiedGovEmployee ? StarIcon : LockClosedIcon}
                size="h4"
                {...(isVerifiedGovEmployee && { color: "secondary" })}
              >
                {intl.formatMessage(commonMessages.employeesNominated)}
              </Heading>
              <p className="mt-3 mb-3">
                {intl.formatMessage({
                  defaultMessage:
                    "Browse active talent management events and nominate eligible talent for advancement, lateral movement or development opportunities. From this section, you can track submission status and view the details of nominations you’ve submitted. This information is also available under the “Talent management” section of your dashboard.",
                  id: "Qmo6Wc",
                  description:
                    "Paragraph explaining what employees nominated are and how they work",
                })}
              </p>
              {!isVerifiedGovEmployee && <LockedNotice />}
              <EmployeesNominated
                userQuery={user}
                showView={isVerifiedGovEmployee}
              />
            </TableOfContents.Section>
          </Card>
        </TableOfContents.Content>
      </TableOfContents.Wrapper>
      <Separator />
    </>
  );
};

const TalentNominationsPage_Query = graphql(/** GraphQL */ `
  query TalentNominationsPage {
    me {
      ...TalentNominations
    }
  }
`);

const TalentNominationsPage = () => {
  const intl = useIntl();
  const [{ data, fetching, error }] = useQuery({
    query: TalentNominationsPage_Query,
  });

  return (
    <Pending fetching={fetching} error={error}>
      {data?.me ? (
        <TalentNominations userQuery={data.me} />
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
    <TalentNominationsPage />
  </RequireAuth>
);

Component.displayName = "TalentNominationsPage";

export default Component;
