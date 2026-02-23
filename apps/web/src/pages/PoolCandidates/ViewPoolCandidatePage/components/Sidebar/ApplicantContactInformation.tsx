import ChevronRightIcon from "@heroicons/react/16/solid/ChevronRightIcon";
import { useState } from "react";
import { useIntl } from "react-intl";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";
import { Button, Collapsible, Link } from "@gc-digital-talent/ui";

import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";

const ApplicantContactInformation_Fragment = graphql(/** GraphQL */ `
  fragment ApplicantContactInformation on PoolCandidate {
    user {
      email
      workEmail
      telephone
      preferredLang {
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
        <FieldDisplay label={intl.formatMessage(commonMessages.email)}>
          {application.user.email ? (
            <Link
              href={`mailto:${application.user.email}`}
              mode="text"
              color="black"
            >
              {application.user.email}
            </Link>
          ) : (
            notAvailable
          )}
        </FieldDisplay>
        <FieldDisplay label={intl.formatMessage(commonMessages.workEmail)}>
          {application.user.workEmail ? (
            <Link
              href={`mailto:${application.user.workEmail}`}
              mode="text"
              color="black"
            >
              {application.user.workEmail}
            </Link>
          ) : (
            notAvailable
          )}
        </FieldDisplay>
        <FieldDisplay label={intl.formatMessage(commonMessages.telephone)}>
          {application.user.telephone ? (
            <Link
              href={`tel:${application.user.telephone}`}
              mode="text"
              color="black"
            >
              {application.user.telephone}
            </Link>
          ) : (
            notAvailable
          )}
        </FieldDisplay>
        <FieldDisplay
          label={intl.formatMessage({
            defaultMessage: "Preferred contact language",
            id: "lHmump",
            description: "Label for preferred contact language field",
          })}
        >
          {application.user.preferredLang?.label.localized ?? notProvided}
        </FieldDisplay>
      </Collapsible.Content>
    </Collapsible.Root>
  );
};

export default ApplicantContactInformation;
