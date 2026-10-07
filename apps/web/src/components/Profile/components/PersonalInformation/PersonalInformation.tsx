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

import type { ProfileSectionPool, SectionProps } from "../../types";
import useSectionInfo from "../../hooks/useSectionInfo";
import NullDisplay from "./NullDisplay";
import Display from "./Display";

const ProfilePersonalInformation_Fragment = graphql(/** GraphQL */ `
  fragment ProfilePersonalInformation on User {
    id
    firstName
    lastName
    telephone
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
  }
`);

interface PersonalInformationProps extends SectionProps<ProfileSectionPool> {
  query: FragmentType<typeof ProfilePersonalInformation_Fragment>;
}

const NoticeDismissedKey =
  "dismissed_alert_account_settings_collection_changed";

const PersonalInformation = ({ query, pool }: PersonalInformationProps) => {
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
      <div className="flex flex-col items-start justify-between gap-6 xs:flex-row xs:items-center">
        <Heading
          className="my-0 grow"
          icon={icon.icon}
          color={icon.color}
          rank={pool ? "h3" : "h2"}
          size={pool ? "h4" : "h3"}
        >
          {title ? intl.formatMessage(title) : null}
        </Heading>
      </div>
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
      {isNull ? <NullDisplay /> : <Display query={user} />}
    </div>
  );
};

export default PersonalInformation;
