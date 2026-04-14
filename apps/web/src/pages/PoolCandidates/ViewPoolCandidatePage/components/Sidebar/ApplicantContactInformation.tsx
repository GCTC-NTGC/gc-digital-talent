import ChevronRightIcon from "@heroicons/react/16/solid/ChevronRightIcon";
import type { ReactNode } from "react";
import { useState } from "react";
import { useIntl } from "react-intl";
import HomeIcon from "@heroicons/react/20/solid/HomeIcon";
import EnvelopeIcon from "@heroicons/react/20/solid/EnvelopeIcon";
import PhoneIcon from "@heroicons/react/20/solid/PhoneIcon";
import GlobeAltIcon from "@heroicons/react/20/solid/GlobeAltIcon";

import type { FragmentType } from "@gc-digital-talent/graphql";
import { getFragment, graphql } from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";
import type { IconType } from "@gc-digital-talent/ui";
import { Button, Collapsible, Link } from "@gc-digital-talent/ui";

import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";
import { formatLocation } from "~/utils/userUtils";
import profileMessages from "~/messages/profileMessages";

interface IconLabelProps {
  icon: IconType;
  label: string;
  children: ReactNode;
}

const IconLabel = ({ icon, label, children }: IconLabelProps) => {
  const Icon = icon;

  return (
    <span className="flex items-start gap-x-1.5">
      <Icon
        aria-hidden="false"
        aria-label={label}
        className="mt-1 size-4.5 shrink-0"
      />
      <span>{children}</span>
    </span>
  );
};

const ApplicantContactInformation_Fragment = graphql(/** GraphQL */ `
  fragment ApplicantContactInformation on PoolCandidate {
    user {
      email
      workEmail
      telephone
      currentCity
      currentProvince {
        label {
          localized
        }
      }
      citizenship {
        label {
          localized
        }
      }
      preferredLang {
        label {
          localized
        }
      }
      preferredLanguageForExam {
        label {
          localized
        }
      }
      preferredLanguageForInterview {
        label {
          localized
        }
      }
    }
  }
`);

interface ApplicantContactInformationProps {
  query: FragmentType<typeof ApplicantContactInformation_Fragment>;
}

const ApplicantContactInformation = ({
  query,
}: ApplicantContactInformationProps) => {
  const intl = useIntl();
  const [isOpen, setOpen] = useState<boolean>(false);
  const notAvailable = intl.formatMessage(commonMessages.notAvailable);
  const application = getFragment(ApplicantContactInformation_Fragment, query);

  return (
    <Collapsible.Root open={isOpen} onOpenChange={setOpen}>
      <Collapsible.Trigger asChild>
        <Button
          mode="inline"
          color="black"
          className="group/collapse justify-start"
          block
        >
          <span className="flex items-center gap-x-1.5">
            <ChevronRightIcon className="size-5 rotate-0 group-data-[state=open]/collapse:rotate-90" />
            <span>
              {intl.formatMessage({
                defaultMessage: "Contact information",
                id: "VGKXW7",
                description: "Label for a users contact information",
              })}
            </span>
          </span>
        </Button>
      </Collapsible.Trigger>
      <Collapsible.Content className="flex flex-col gap-y-6 pt-6 pl-6.5">
        <IconLabel
          icon={HomeIcon}
          label={intl.formatMessage(profileMessages.currentLocation)}
        >
          {formatLocation({
            city: application.user.currentCity,
            region: application.user.currentProvince,
            intl,
          })}
        </IconLabel>
        <IconLabel
          icon={EnvelopeIcon}
          label={intl.formatMessage(commonMessages.email)}
        >
          {application.user.email ? (
            <Link
              href={`mailto:${application.user.email}`}
              mode="text"
              color="black"
              className="wrap-anywhere"
            >
              {application.user.email}
            </Link>
          ) : (
            notAvailable
          )}
        </IconLabel>
        <IconLabel
          icon={PhoneIcon}
          label={intl.formatMessage(commonMessages.telephone)}
        >
          {application.user.telephone ? (
            <Link
              href={`tel:${application.user.telephone}`}
              mode="text"
              color="black"
              className="wrap-anywhere"
            >
              {application.user.telephone}
            </Link>
          ) : (
            notAvailable
          )}
        </IconLabel>
        <IconLabel
          icon={GlobeAltIcon}
          label={intl.formatMessage(profileMessages.citizenship)}
        >
          {application.user.citizenship?.label.localized ??
            intl.formatMessage(commonMessages.notProvided)}
        </IconLabel>
        <FieldDisplay
          label={intl.formatMessage(profileMessages.communicationLanguage)}
        >
          {application.user.preferredLang?.label.localized ??
            intl.formatMessage(commonMessages.notProvided)}
        </FieldDisplay>
        <FieldDisplay
          label={intl.formatMessage(profileMessages.spokenLanguage)}
        >
          {application.user.preferredLanguageForInterview?.label.localized ??
            intl.formatMessage(commonMessages.notProvided)}
        </FieldDisplay>
        <FieldDisplay
          label={intl.formatMessage(profileMessages.writtenLanguage)}
        >
          {application.user.preferredLanguageForExam?.label.localized ??
            intl.formatMessage(commonMessages.notProvided)}
        </FieldDisplay>
      </Collapsible.Content>
    </Collapsible.Root>
  );
};

export default ApplicantContactInformation;
