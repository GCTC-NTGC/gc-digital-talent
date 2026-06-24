import { useState } from "react";
import { useIntl } from "react-intl";

import {
  getFragment,
  graphql,
  type FragmentType,
} from "@gc-digital-talent/graphql";
import { Button, Dialog, Separator } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";
import { notEmpty } from "@gc-digital-talent/helpers";

import talentNominationMessages from "~/messages/talentNominationMessages";

import SubmissionInformationSection from "./SubmissionInformationSection";
import NominatorInformationSection from "./NominatorInformationSection";
import NominationDetailsSection from "./NominationDetailsSection";
import RationaleAndAdditionalCommentsSection from "./RationaleAndAdditionalCommentsSection";

const TalentNominationDetailsDialog_Fragment = graphql(/* GraphQL */ `
  fragment TalentNominationDetailsDialog on TalentNomination {
    id
    talentNominationEvent {
      name {
        localized
      }
    }
    nominee {
      firstName
    }
    nominator {
      firstName
      lastName
    }
    nominatorFallbackName
    nominateForAdvancement
    nominateForLateralMovement
    nominateForDevelopmentPrograms
  }
`);

interface NominationDetailsDialogProps {
  query: FragmentType<typeof TalentNominationDetailsDialog_Fragment>;
}

const NominationDetailsDialog = ({ query }: NominationDetailsDialogProps) => {
  const intl = useIntl();
  const nomination = getFragment(TalentNominationDetailsDialog_Fragment, query);

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const nomineeName =
    nomination.nominee?.firstName ??
    intl.formatMessage(commonMessages.notFound);

  const nominatorName =
    (nomination.nominator
      ? `${nomination.nominator.firstName} ${nomination.nominator.lastName}`.trim()
      : nomination.nominatorFallbackName) ??
    intl.formatMessage(commonMessages.notFound);

  const eventName = nomination.talentNominationEvent.name.localized;

  const nominationOptionMessages = [
    nomination.nominateForAdvancement
      ? talentNominationMessages.nominateForAdvancement
      : null,
    nomination.nominateForLateralMovement
      ? talentNominationMessages.nominateForLateralMovement
      : null,
    nomination.nominateForDevelopmentPrograms
      ? talentNominationMessages.development
      : null,
  ];

  const nominationOptions =
    nominationOptionMessages
      .filter(notEmpty)
      .map((message) => intl.formatMessage(message).toLocaleLowerCase())
      .join(", ") ?? intl.formatMessage(commonMessages.notFound);

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <Button>{nomination.id}</Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header
          subtitle={intl.formatMessage(
            {
              defaultMessage:
                "Nominated for {nominationOptions} by {nominatorName}",
              id: "Vq0BPN",
              description: "Subtitle for the nomination details dialog",
            },
            {
              nominationOptions,
              nominatorName,
            },
          )}
        >
          {intl.formatMessage(
            {
              defaultMessage: "{nomineeName}’s nomination to {eventName}",
              id: "1l/JbH",
              description: "Title for the nomination details dialog",
            },
            {
              nomineeName,
              eventName,
            },
          )}
        </Dialog.Header>
        <Dialog.Body>
          <SubmissionInformationSection />
          <Separator />
          <NominatorInformationSection />
          <Separator />
          <NominationDetailsSection />
          <Separator />
          <RationaleAndAdditionalCommentsSection />
          <Dialog.Footer className="flex-col gap-x-6 gap-y-6 xs:flex-row">
            Footer here
          </Dialog.Footer>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default NominationDetailsDialog;
