import { useState, type ReactNode } from "react";
import { defineMessages, useIntl, type MessageDescriptor } from "react-intl";
import CheckIcon from "@heroicons/react/24/solid/CheckCircleIcon";

import {
  Link,
  Button,
  Dialog,
  Notice,
  PreviewList,
} from "@gc-digital-talent/ui";
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

export type NominationDetailsVariant = "nominee" | "recruiter";

const nomineeMessages = defineMessages({
  subtitle: {
    defaultMessage: "More about your nomination during {eventName}",
    id: "ZArId5",
    description: "Subtitle for the received nomination details dialog",
  },
  whoNominated: {
    defaultMessage: "Who nominated you",
    id: "D0NNSD",
    description: "Label for who nominated the person",
  },
  whatNominatedFor: {
    defaultMessage: "What you were nominated for",
    id: "wRsQe+",
    description: "Label for the type(s) of a received nomination",
  },
  meaningAdvancement: {
    defaultMessage:
      "Being nominated for advancement means that you have been identified as someone who might benefit from new and challenging opportunities. This nomination recognizes that promotion may be the most effective way to maximize your contribution to your organization and the broader public service. <link>Reach out to the community event team</link> for event-specific details.",
    id: "E6/qXV",
    description: "Description for advancement nomination meaning",
  },
  meaningLateralMovement: {
    defaultMessage:
      "Being nominated for lateral movement means that you might benefit from diversifying your experience in similar roles that will expand your understanding of the enterprise and its programs and services. Lateral moves can support professional goals and are an opportunity to gain new perspectives, strengthen skills and build the breadth of experience needed for future advancement.",
    id: "/OP7BB",
    description: "Description for lateral movement nomination meaning",
  },
  meaningDevelopment: {
    defaultMessage:
      "Being nominated for development opportunities means that you have been referred for potential participation in the development programs listed. These programs are often designed to compliment or enhance your skillset in preparation for new career opportunities.",
    id: "3REesV",
    description: "Description for development nomination meaning",
  },
});

const recruiterMessages = defineMessages({
  subtitle: {
    defaultMessage: "More about the employee’s nomination during {eventName}",
    id: "VXb4Sa",
    description: "Subtitle for the nomination details dialog on the GC profile",
  },
  whoNominated: {
    defaultMessage: "Who nominated them",
    id: "riapK6",
    description: "Label for who nominated the employee on the GC profile",
  },
  whatNominatedFor: {
    defaultMessage: "What they were nominated for",
    id: "65Ocoa",
    description: "Label for the type(s) of nomination an employee received",
  },
  meaningAdvancement: {
    defaultMessage:
      "Being nominated for advancement means that the employee has been identified as someone who might benefit from new and challenging opportunities. This nomination recognizes that promotion may be the most effective way to maximize their contribution to their organization and the broader public service. <link>Reach out to the community event team</link> for event-specific details.",
    id: "vvekOE",
    description:
      "Description for advancement nomination meaning, shown to a recruiter",
  },
  meaningLateralMovement: {
    defaultMessage:
      "Being nominated for lateral movement means that the employee might benefit from diversifying their experience in similar roles that will expand their understanding of the enterprise and its programs and services. Lateral moves can support professional goals and are an opportunity to gain new perspectives, strengthen skills and build the breadth of experience needed for future advancement.",
    id: "oWou0j",
    description:
      "Description for lateral movement nomination meaning, shown to a recruiter",
  },
  meaningDevelopment: {
    defaultMessage:
      "Being nominated for development opportunities means that the employee has been referred for potential participation in the development programs listed. These programs are often designed to compliment or enhance their skillset in preparation for new career opportunities.",
    id: "BoLvlN",
    description:
      "Description for development nomination meaning, shown to a recruiter",
  },
});

const variantMessages: Record<
  NominationDetailsVariant,
  {
    subtitle: MessageDescriptor;
    whoNominated: MessageDescriptor;
    whatNominatedFor: MessageDescriptor;
    meaningAdvancement: MessageDescriptor;
    meaningLateralMovement: MessageDescriptor;
    meaningDevelopment: MessageDescriptor;
  }
> = {
  nominee: nomineeMessages,
  recruiter: recruiterMessages,
};

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
      contactEmail
    }
    approvedForAdvancement
    approvedForLateralMovement
    approvedForDevelopmentPrograms
    nominatorNames
  }
`);

interface NominationDetailsDialogProps {
  nominationGroupQuery: FragmentType<typeof NominationDetailsDialog_Fragment>;
  variant: NominationDetailsVariant;
}

const NominationDetailsDialog = ({
  nominationGroupQuery,
  variant,
}: NominationDetailsDialogProps) => {
  const intl = useIntl();
  const nominationGroup = getFragment(
    NominationDetailsDialog_Fragment,
    nominationGroupQuery,
  );

  const messages = variantMessages[variant];

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const nullMessage = intl.formatMessage(commonMessages.notFound);
  const notProvided = intl.formatMessage(commonMessages.notProvided);

  const eventName =
    nominationGroup.talentNominationEvent?.name?.localized ?? nullMessage;

  const eventDescription =
    nominationGroup.talentNominationEvent?.description?.localized;

  const contactEmail = nominationGroup.talentNominationEvent?.contactEmail;

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

  const nominationMeanings = [
    nominationGroup.approvedForAdvancement
      ? {
          option: intl.formatMessage(
            talentNominationMessages.nominateForAdvancement,
          ),
          meaning: intl.formatMessage(messages.meaningAdvancement, {
            link: (chunks: ReactNode) =>
              contactEmail ? (
                <Link external color="black" href={`mailto:${contactEmail}`}>
                  {chunks}
                </Link>
              ) : (
                chunks
              ),
          }),
        }
      : null,
    nominationGroup.approvedForLateralMovement
      ? {
          option: intl.formatMessage(
            talentNominationMessages.nominateForLateralMovement,
          ),
          meaning: intl.formatMessage(messages.meaningLateralMovement),
        }
      : null,
    nominationGroup.approvedForDevelopmentPrograms
      ? {
          option: intl.formatMessage(adminMessages.developmentOpportunities),
          meaning: intl.formatMessage(messages.meaningDevelopment),
        }
      : null,
  ].filter(notEmpty);

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
          subtitle={intl.formatMessage(messages.subtitle, { eventName })}
        >
          {intl.formatMessage({
            defaultMessage: "Nomination details",
            id: "gD98oQ",
            description: "Heading for details step of a talent nomination",
          })}
        </Dialog.Header>
        <Dialog.Body>
          {variant === "nominee" ? (
            <Notice.Root mode="inline" className="mb-6" color="success">
              <Notice.Title>
                {intl.formatMessage(
                  {
                    defaultMessage:
                      "Congratulations on being nominated to {eventName}!",
                    id: "ZlD1Sv",
                    description: "Title for important update notice",
                  },
                  { eventName },
                )}
              </Notice.Title>
              {eventDescription ? (
                <Notice.Content>
                  <p>{eventDescription}</p>
                </Notice.Content>
              ) : null}
            </Notice.Root>
          ) : eventDescription ? (
            <Notice.Root mode="inline" className="mb-6" color="success">
              <Notice.Title>{eventName}</Notice.Title>
              <Notice.Content>
                <p>{eventDescription}</p>
              </Notice.Content>
            </Notice.Root>
          ) : null}

          <div className="flex flex-col gap-6">
            <FieldDisplay label={intl.formatMessage(messages.whoNominated)}>
              {nominatedBy}
            </FieldDisplay>

            <FieldDisplay label={intl.formatMessage(messages.whatNominatedFor)}>
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
            {nominationMeanings.length > 0
              ? nominationMeanings.map((nominationMeaning) => (
                  <FieldDisplay
                    key={nominationMeaning.option}
                    label={intl.formatMessage(
                      {
                        defaultMessage:
                          'What it means to be nominated for "{nominationOptions}"',
                        id: "qzzqI0",
                        description:
                          "Label for the meaning of a nomination status, with the status name as a variable",
                      },
                      {
                        nominationOptions: nominationMeaning.option,
                      },
                    )}
                  >
                    {nominationMeaning.meaning}
                  </FieldDisplay>
                ))
              : null}
          </div>
          <Dialog.Footer>
            <Button onClick={() => setIsOpen(false)}>
              {intl.formatMessage(commonMessages.close)}
            </Button>
            {contactEmail ? (
              <Link
                mode="text"
                color="primary"
                external
                href="mailto:recruitmentimit-recrutementgiti@tbs-sct.gc.ca"
              >
                {intl.formatMessage({
                  defaultMessage: "Contact the Digital Community",
                  id: "8+j5O+",
                  description: "Link text to email the digital community",
                })}
              </Link>
            ) : null}
          </Dialog.Footer>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default NominationDetailsDialog;
