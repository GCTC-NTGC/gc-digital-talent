import { useState } from "react";
import { useIntl } from "react-intl";
import CheckIcon from "@heroicons/react/24/solid/CheckCircleIcon";

import {
  getFragment,
  graphql,
  type FragmentType,
} from "@gc-digital-talent/graphql";
import { Button, Dialog, Notice, PreviewList } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";
import { notEmpty } from "@gc-digital-talent/helpers";

import talentNominationMessages from "~/messages/talentNominationMessages";
import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";
import { getNominatorName } from "~/utils/talentNominations";

export const NominationsReceivedDialog_Fragment = graphql(/* GraphQL */ `
  fragment NominationsReceivedDialog on TalentNominationGroup {
    id
    createdAt
    talentNominationEvent {
      id
      name {
        localized
      }
      community {
        name {
          localized
        }
      }
    }
    advancementNominationCount
    lateralMovementNominationCount
    developmentProgramsNominationCount
    nominations {
      id
      nominatorFallbackName
      nominator {
        firstName
        lastName
      }
    }
  }
`);

interface NominationsReceivedDialogProps {
  nominationGroupQuery: FragmentType<typeof NominationsReceivedDialog_Fragment>;
}

const NominationsReceivedDialog = ({
  nominationGroupQuery,
}: NominationsReceivedDialogProps) => {
  const intl = useIntl();
  const nominationGroup = getFragment(
    NominationsReceivedDialog_Fragment,
    nominationGroupQuery,
  );

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const nullMessage = intl.formatMessage(commonMessages.notFound);
  const notProvided = intl.formatMessage(commonMessages.notProvided);

  const eventName =
    nominationGroup.talentNominationEvent?.name?.localized ?? nullMessage;

  const nominatorNames = [
    ...new Set(
      (nominationGroup.nominations ?? [])
        .filter(notEmpty)
        .map((nomination) =>
          getNominatorName(
            nomination.nominator,
            nomination.nominatorFallbackName,
            intl,
          ),
        ),
    ),
  ];
  const nominatedBy =
    nominatorNames.length > 0 ? intl.formatList(nominatorNames) : notProvided;

  // Filter and build the nomination options list only showing what they were nominated for
  const nominationOptionsList = [
    (nominationGroup.advancementNominationCount ?? 0) > 0
      ? talentNominationMessages.nominateForAdvancement
      : null,
    (nominationGroup.lateralMovementNominationCount ?? 0) > 0
      ? talentNominationMessages.nominateForLateralMovement
      : null,
    (nominationGroup.developmentProgramsNominationCount ?? 0) > 0
      ? talentNominationMessages.development
      : null,
  ]
    .filter(notEmpty)
    .map((message) => intl.formatMessage(message));

  const nominationOptionsString = nominationOptionsList.join(", ");

  // Check which types are present
  const hasAdvancement = (nominationGroup.advancementNominationCount ?? 0) > 0;
  const hasLateralMovement =
    (nominationGroup.lateralMovementNominationCount ?? 0) > 0;
  const hasDevelopment =
    (nominationGroup.developmentProgramsNominationCount ?? 0) > 0;

  const nominationMessage = [];

  if (hasAdvancement) {
    nominationMessage.push(
      intl.formatMessage({
        defaultMessage:
          "Being nominated for advancement means that you have been identified as someone who might benefit from challenging new opportunities. For certain events, this might result in you being referred for opportunities at higher levels than your current substantive classification for a period of time. Reach out to the community event team for event-specific details.",
        id: "2lD5m3",
        description: "Description for advancement nomination meaning",
      }),
    );
  }

  if (hasLateralMovement) {
    nominationMessage.push(
      intl.formatMessage({
        defaultMessage:
          "Being nominated for lateral movement means that you might benefit from diversifying your experience in similar roles that will expand your understanding of the enterprise, programs or services. A lateral move is usually suggested to help you prepare for advancement into a role that requires more holistic knowledge or specific skills.",
        id: "b1sexz",
        description: "Description for lateral movement nomination meaning",
      }),
    );
  }

  if (hasDevelopment) {
    nominationMessage.push(
      intl.formatMessage({
        defaultMessage:
          "Being nominated for development opportunities means that you have been referred for potential participation in the development programs listed. These programs are often designed to compliment or enhance your skillset in preparation for new career opportunities.",
        id: "3REesV",
        description: "Description for development nomination meaning",
      }),
    );
  }

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
            { eventName: eventName ?? nullMessage },
          )}
        />
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header
          subtitle={intl.formatMessage(
            {
              defaultMessage: "More about your nomination during {eventName}",
              id: "ZArId5",
              description:
                "Subtitle for the received nomination details dialog",
            },
            { eventName: eventName ?? nullMessage },
          )}
        >
          {intl.formatMessage({
            defaultMessage: "Nomination details",
            id: "7B/Eu+",
            description: "Title for the received nomination details dialog",
          })}
        </Dialog.Header>
        <Dialog.Body>
          <Notice.Root mode="inline" className="mb-6" color="success">
            <Notice.Title>
              {intl.formatMessage(
                {
                  defaultMessage:
                    "Congratulations on being nominated to {eventName}!",
                  id: "ZlD1Sv",
                  description: "Title for important update notice",
                },
                { eventName: eventName ?? nullMessage },
              )}
            </Notice.Title>
            <Notice.Content>
              <p>
                {intl.formatMessage(
                  {
                    defaultMessage:
                      "{eventName} is an annual talent management roundtable that identifies EX-01, 02, and 03 talent in the digital community of practice. The roundtable exercise focuses on highlighting leadership potential and potential for the purposes of advancement, lateral movement, and development opportunities.",
                    id: "qoR3tk",
                    description: "Description for important update notice",
                  },
                  { eventName: eventName ?? nullMessage },
                )}
              </p>
            </Notice.Content>
          </Notice.Root>

          <div className="flex flex-col gap-6">
            <FieldDisplay
              label={intl.formatMessage({
                defaultMessage: "Who nominated you",
                id: "D0NNSD",
                description: "Label for who nominated the person",
              })}
            >
              {nominatedBy}
            </FieldDisplay>

            <FieldDisplay
              label={intl.formatMessage({
                defaultMessage: "What you were nominated for",
                id: "wRsQe+",
                description: "Label for the type(s) of a received nomination",
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

            <FieldDisplay
              label={intl.formatMessage(
                {
                  defaultMessage:
                    "What it means to be nominated for {nominationOptions}",
                  id: "CtftRC",
                  description:
                    "Label for the meaning of a nomination status, with the status name as a variable",
                },
                {
                  nominationOptions: `"${nominationOptionsString}"`,
                },
              )}
            >
              {nominationMessage.length > 0 ? (
                <>
                  {nominationMessage.map((message, index) => (
                    <span key={index}>{message}</span>
                  ))}
                </>
              ) : (
                notProvided
              )}
            </FieldDisplay>
          </div>
          <Dialog.Footer>
            <Button onClick={() => setIsOpen(false)}>
              {intl.formatMessage(commonMessages.close)}
            </Button>
            <Button>
              {intl.formatMessage({
                defaultMessage: "Contact the community",
                id: "ikgyHd",
                description: "Button to contact the community",
              })}
            </Button>
          </Dialog.Footer>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default NominationsReceivedDialog;
