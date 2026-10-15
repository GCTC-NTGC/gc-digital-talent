import { useIntl } from "react-intl";
import UserIcon from "@heroicons/react/24/outline/UserIcon";

import { Notice, Heading } from "@gc-digital-talent/ui";
import type { FragmentType } from "@gc-digital-talent/graphql";
import { getFragment, graphql } from "@gc-digital-talent/graphql";

import {
  hasAllEmptyFields,
  hasEmptyRequiredFields,
  hasMissingRequiredWorkEmail,
  type AboutPool,
} from "~/validators/profile/personalInformation";

import type { ProfileSectionPool, SectionProps } from "../../types";
import useSectionInfo from "../../hooks/useSectionInfo";
import AccountInformationCard from "./AccountInformationCard";
import GovernmentInformationCard from "./GovernmentInformationCard";

const ProfilePersonalInformation_Fragment = graphql(/** GraphQL */ `
  fragment ProfilePersonalInformation on User {
    id
    firstName
    lastName
    telephone
    email
    isEmailVerified
    workEmail
    isWorkEmailVerified
    preferredLang {
      value
    }
    ...AccountInformationCard
    ...GovernmentInformationCard
  }
`);

interface PersonalInformationProps extends SectionProps<
  ProfileSectionPool & AboutPool
> {
  query: FragmentType<typeof ProfilePersonalInformation_Fragment>;
  isSpecialApplication?: boolean | null;
}

const PersonalInformation = ({
  query,
  pool,
  isSpecialApplication,
}: PersonalInformationProps) => {
  const intl = useIntl();
  const user = getFragment(ProfilePersonalInformation_Fragment, query);
  const isNull = hasAllEmptyFields(user);
  const missingRequiredWorkEmail = hasMissingRequiredWorkEmail(
    user,
    pool,
    isSpecialApplication,
  );
  const emptyRequired = hasEmptyRequiredFields(
    user,
    pool,
    isSpecialApplication,
  );
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
      <AccountInformationCard query={user} />
      {missingRequiredWorkEmail && (
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
      <GovernmentInformationCard query={user} />
    </div>
  );
};

export default PersonalInformation;
