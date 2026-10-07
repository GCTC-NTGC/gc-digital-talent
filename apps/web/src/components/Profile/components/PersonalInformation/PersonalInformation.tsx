import { useIntl } from "react-intl";
import UserIcon from "@heroicons/react/24/outline/UserIcon";
import type { ReactNode } from "react";

import { Link, Notice, Heading } from "@gc-digital-talent/ui";
import type { FragmentType } from "@gc-digital-talent/graphql";
import { getFragment, graphql } from "@gc-digital-talent/graphql";
import { useLocalStorage } from "@gc-digital-talent/storage";

import {
  hasAllEmptyFields,
  hasEmptyRequiredFields,
} from "~/validators/profile/about";
import useRoutes from "~/hooks/useRoutes";
import ContactEmailCard from "~/components/ContactEmailCard/ContactEmailCard";
import WorkEmailCard from "~/components/WorkEmailCard/WorkEmailCard";

import type { ProfileSectionPool, SectionProps } from "../../types";
import useSectionInfo from "../../hooks/useSectionInfo";

const ProfilePersonalInformation_Fragment = graphql(/** GraphQL */ `
  fragment ProfilePersonalInformation on User {
    id
    firstName
    lastName
    telephone
    isEmailVerified
    workEmail
    isWorkEmailVerified
    preferredLang {
      value
    }
    preferredLanguageForInterview {
      value
    }
    preferredLanguageForExam {
      value
    }
    citizenship {
      value
    }
    armedForcesStatus {
      value
    }
    ...PersonalInformationDisplay
    ...ContactEmailCard
    ...WorkEmailCard
  }
`);

interface PersonalInformationProps extends SectionProps<ProfileSectionPool> {
  query: FragmentType<typeof ProfilePersonalInformation_Fragment>;
  enableEmployeeAreaOfSelectionNotice: boolean;
}

const NoticeDismissedKey =
  "dismissed_alert_account_settings_collection_changed";

const PersonalInformation = ({
  query,
  enableEmployeeAreaOfSelectionNotice,
  pool,
}: PersonalInformationProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const user = getFragment(ProfilePersonalInformation_Fragment, query);
  const [alertIsDismissed, setNoticeIsDismissed] = useLocalStorage<boolean>(
    NoticeDismissedKey,
    false,
  );
  const isNull = hasAllEmptyFields(user);
  const emptyRequired = hasEmptyRequiredFields(user);
  const { icon, title } = useSectionInfo({
    section: "personal",
    isNull,
    emptyRequired,
    fallbackIcon: UserIcon,
  });

  return (
    <div className="flex flex-col gap-y-6">
      <Heading
        className="my-0 grow"
        icon={icon.icon}
        color={icon.color}
        rank={pool ? "h3" : "h2"}
        size={pool ? "h4" : "h3"}
      >
        {title ? intl.formatMessage(title) : null}
      </Heading>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "Manage your name, contact preferences, citizenship, and veteran status. Government of Canada employees can also verify their work email to gain access to employee tools.",
          id: "3duqOV",
          description:
            "Description for the Personal and contact information section",
        })}
      </p>
      {!alertIsDismissed ? (
        <Notice.Root onDismiss={() => setNoticeIsDismissed(true)}>
          <Notice.Title defaultIcon>
            {intl.formatMessage({
              defaultMessage:
                "We’ve changed how we collect employee information",
              id: "ozb92E",
              description: "title for alert about changed collection",
            })}
          </Notice.Title>
          <Notice.Content>
            <p>
              {intl.formatMessage(
                {
                  defaultMessage:
                    "To better capture your career journey in the public service, we now collect information about your classification, department and more as part of your <a>career experience</a>. If you currently work in the Government of Canada, please update your latest work experience to include this information.",
                  id: "vj9jcO",
                  description: "body for alert about changed collection",
                },
                {
                  a: (chunks: ReactNode) => (
                    <Link href={paths.careerTimeline()}>{chunks}</Link>
                  ),
                },
              )}
            </p>
          </Notice.Content>
        </Notice.Root>
      ) : null}
      {pool && emptyRequired && (
        <Notice.Root color="error">
          <Notice.Content>
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "You are missing required personal information.",
                id: "QceO8G",
                description:
                  "Error message displayed when a users personal information is incomplete",
              })}
            </p>
          </Notice.Content>
        </Notice.Root>
      )}
      {!user.isEmailVerified && (
        <Notice.Root color="error">
          <Notice.Content>
            <p>
              {intl.formatMessage({
                defaultMessage: "A verified contact email is required",
                id: "O7ubAh",
                description:
                  "Error message displayed during application when missing a verified email",
              })}
            </p>
          </Notice.Content>
        </Notice.Root>
      )}
      {
        /* special application bypasses work email verification  */
        enableEmployeeAreaOfSelectionNotice && (
          <>
            {(!user.isWorkEmailVerified || !user.workEmail) && (
              <Notice.Root color="error">
                <Notice.Content>
                  <p>
                    {intl.formatMessage({
                      defaultMessage:
                        "This job opportunity is reserved for existing employees. A verified Government of Canada work email is required.",
                      id: "KWgx7f",
                      description:
                        "Body for a message informing the user that a contact email is required.",
                    })}
                  </p>
                </Notice.Content>
              </Notice.Root>
            )}
          </>
        )
      }
      <ContactEmailCard query={user} />
      <WorkEmailCard query={user} />
    </div>
  );
};

export default PersonalInformation;
