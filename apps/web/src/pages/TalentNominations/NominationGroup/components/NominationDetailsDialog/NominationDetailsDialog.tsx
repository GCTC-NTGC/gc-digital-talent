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
import { getFullNameLabel } from "~/utils/nameUtils";

import SubmissionInformationSection from "./SubmissionInformationSection";
import NominatorInformationSection from "./NominatorInformationSection";
import NominationDetailsSection from "./NominationDetailsSection";
import RationaleAndAdditionalCommentsSection from "./RationaleAndAdditionalCommentsSection";

const TalentNominationDetailsDialogNomination_Fragment = graphql(/* GraphQL */ `
  fragment TalentNominationDetailsDialogNomination on TalentNomination {
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
    ...TalentNominationDetailsDialogSubmissionInformation
    ...TalentNominationDetailsDialogNominatorInformation
    ...TalentNominationDetailsDialogNominationDetailsNomination
    ...TalentNominationDetailsDialogRationaleAndAdditionalComments
  }
`);

const TalentNominationDetailsDialogNominationGroup_Fragment = graphql(
  /* GraphQL */ `
    fragment TalentNominationDetailsDialogNominationGroup on TalentNominationGroup {
      id
      ...TalentNominationDetailsDialogNominationDetailsNominationGroup
    }
  `,
);

const TalentNominationDetailsDialogOptions_Fragment = graphql(/* GraphQL */ `
  fragment TalentNominationDetailsDialogOptions on Query {
    ...TalentNominationDetailsDialogNominationDetailsOptions
  }
`);

interface NominationDetailsDialogProps {
  nominationQuery: FragmentType<
    typeof TalentNominationDetailsDialogNomination_Fragment
  >;
  nominationGroupQuery: FragmentType<
    typeof TalentNominationDetailsDialogNominationGroup_Fragment
  >;
  optionsQuery: FragmentType<
    typeof TalentNominationDetailsDialogOptions_Fragment
  >;
}

const NominationDetailsDialog = ({
  nominationQuery,
  nominationGroupQuery,
  optionsQuery,
}: NominationDetailsDialogProps) => {
  const intl = useIntl();
  const nomination = getFragment(
    TalentNominationDetailsDialogNomination_Fragment,
    nominationQuery,
  );
  const nominationGroup = getFragment(
    TalentNominationDetailsDialogNominationGroup_Fragment,
    nominationGroupQuery,
  );
  const options = getFragment(
    TalentNominationDetailsDialogOptions_Fragment,
    optionsQuery,
  );

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const nullMessage = intl.formatMessage(commonMessages.notFound);

  const nominatorName = nomination.nominator
    ? getFullNameLabel(
        nomination.nominator.firstName,
        nomination.nominator.lastName,
        intl,
      )
    : nomination.nominatorFallbackName;

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

  const nominationOptions = nominationOptionMessages
    .filter(notEmpty)
    .map((message) => intl.formatMessage(message).toLocaleLowerCase())
    .join(", ");

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
              nominationOptions: nominationOptions || nullMessage,
              nominatorName: nominatorName ?? nullMessage,
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
              nomineeName: nomination.nominee?.firstName ?? nullMessage,
              eventName:
                nomination.talentNominationEvent.name.localized ?? nullMessage,
            },
          )}
        </Dialog.Header>
        <Dialog.Body>
          <SubmissionInformationSection query={nomination} />
          <Separator space="sm" />
          <NominatorInformationSection query={nomination} />
          <Separator space="sm" />
          <NominationDetailsSection
            nominationQuery={nomination}
            nominationGroupQuery={nominationGroup}
            optionsQuery={options}
          />
          <Separator space="sm" />
          <RationaleAndAdditionalCommentsSection query={nomination} />
          <Dialog.Footer className="flex-col gap-x-6 gap-y-6 xs:flex-row">
            <Button onClick={() => setIsOpen(false)}>
              {intl.formatMessage(commonMessages.okay)}
            </Button>
            <Button
              mode="inline"
              color="warning"
              onClick={() => setIsOpen(false)}
            >
              {intl.formatMessage(commonMessages.cancel)}
            </Button>
          </Dialog.Footer>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default NominationDetailsDialog;
