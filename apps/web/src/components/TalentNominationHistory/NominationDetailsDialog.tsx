import { useState } from "react";
import { useIntl } from "react-intl";
import CheckIcon from "@heroicons/react/24/solid/CheckCircleIcon";

import { Button, Dialog, Notice, PreviewList } from "@gc-digital-talent/ui";
import {
  getFragment,
  graphql,
  type FragmentType,
} from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";
import { notEmpty } from "@gc-digital-talent/helpers";

import talentNominationMessages from "~/messages/talentNominationMessages";
import adminMessages from "~/messages/adminMessages";
import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";

export const NominationDetailsDialog_Fragment = graphql(/* GraphQL */ `
  fragment NominationDetailsDialog on TalentNominationGroupAsNominee {
    id
    talentNominationEvent {
      id
      name {
        localized
      }
      description {
        localized
      }
      community {
        name {
          localized
        }
      }
    }
    approvedForAdvancement
    approvedForLateralMovement
    approvedForDevelopmentPrograms
    nominatorNames
  }
`);

interface NominationDetailsDialogProps {
  nominationGroupQuery: FragmentType<typeof NominationDetailsDialog_Fragment>;
}

const NominationDetailsDialog = ({
  nominationGroupQuery,
}: NominationDetailsDialogProps) => {
  const intl = useIntl();
  const nominationGroup = getFragment(
    NominationDetailsDialog_Fragment,
    nominationGroupQuery,
  );

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const nullMessage = intl.formatMessage(commonMessages.notFound);
  const notProvided = intl.formatMessage(commonMessages.notProvided);

  const eventName =
    nominationGroup.talentNominationEvent?.name?.localized ?? nullMessage;

  const eventDescription =
    nominationGroup.talentNominationEvent?.description?.localized;

  const { nominatorNames } = nominationGroup;
  const nominatedBy =
    nominatorNames.length > 0 ? intl.formatList(nominatorNames) : notProvided;

  // Filter and build the nomination options list only showing what they were approved for
  const nominationOptionsList = [
    nominationGroup.approvedForAdvancement
      ? talentNominationMessages.nominateForAdvancement
      : null,
    nominationGroup.approvedForLateralMovement
      ? talentNominationMessages.nominateForLateralMovement
      : null,
    nominationGroup.approvedForDevelopmentPrograms
      ? adminMessages.developmentOpportunities
      : null,
  ]
    .filter(notEmpty)
    .map((message) => intl.formatMessage(message));

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <PreviewList.Button
          label={intl.formatMessage(
            {
              defaultMessage: "View nomination details for {eventName}",
              id: "Rnry4P",
              description:
                "Label for the received nomination details dialog trigger",
            },
            { eventName },
          )}
        />
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header
          subtitle={intl.formatMessage(
            {
              defaultMessage:
                "More about this employee's nomination during {eventName}",
              id: "nxNaC4",
              description:
                "Subtitle for the nomination details dialog on the GC profile",
            },
            { eventName },
          )}
        >
          {intl.formatMessage({
            defaultMessage: "Nomination details",
            id: "gD98oQ",
            description: "Heading for details step of a talent nomination",
          })}
        </Dialog.Header>
        <Dialog.Body>
          {eventDescription ? (
            <Notice.Root mode="inline" className="mb-6">
              <Notice.Title>{eventName}</Notice.Title>
              <Notice.Content>
                <p>{eventDescription}</p>
              </Notice.Content>
            </Notice.Root>
          ) : null}

          <div className="flex flex-col gap-6">
            <FieldDisplay
              label={intl.formatMessage({
                defaultMessage: "Who nominated this employee",
                id: "ZcJlXd",
                description:
                  "Label for who nominated the employee on the GC profile",
              })}
            >
              {nominatedBy}
            </FieldDisplay>

            <FieldDisplay
              label={intl.formatMessage({
                defaultMessage: "What this employee was nominated for",
                id: "O6gTOS",
                description:
                  "Label for the type(s) of nomination an employee received",
              })}
            >
              {nominationOptionsList.length > 0 ? (
                <ul className="space-y-1">
                  {nominationOptionsList.map((option, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckIcon className="h-5 w-5 text-success" />
                      <span>{option}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                notProvided
              )}
            </FieldDisplay>
          </div>
          <Dialog.Footer>
            <Button onClick={() => setIsOpen(false)}>
              {intl.formatMessage(commonMessages.close)}
            </Button>
          </Dialog.Footer>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default NominationDetailsDialog;
