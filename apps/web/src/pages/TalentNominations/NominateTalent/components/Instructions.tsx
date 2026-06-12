import { useState } from "react";
import { useIntl } from "react-intl";
import { useQuery } from "urql";
import ClipboardDocumentListIcon from "@heroicons/react/24/outline/ClipboardDocumentListIcon";
import type { ReactNode } from "react";
import { useNavigate } from "react-router";

import { TalentNominationStep, graphql } from "@gc-digital-talent/graphql";
import { Link, Dialog, Button } from "@gc-digital-talent/ui";
import { hasRequiredRoles, useAuthorization } from "@gc-digital-talent/auth";
import { notEmpty } from "@gc-digital-talent/helpers";

import useRoutes from "~/hooks/useRoutes";

import useCurrentStep from "../useCurrentStep";
import SubHeading from "./SubHeading";
import UpdateForm from "./UpdateForm";

export const NominationInstructions_Query = graphql(/* GraphQL */ `
  query NominationInstructionsQuery($id: UUID!) {
    talentNomination(id: $id) {
      id
      talentNominationEvent {
        id
        closeDate
      }
    }
  }
`);

interface InstructionsProps {
  nominationId: string;
}

interface InstructionsQueryData {
  talentNomination?: {
    talentNominationEvent?: {
      closeDate?: string | null;
    } | null;
  } | null;
}

const Instructions = ({ nominationId }: InstructionsProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const navigate = useNavigate();
  const { current } = useCurrentStep();
  const { userAuthInfo } = useAuthorization();
  const roleAssignments = userAuthInfo?.roleAssignments?.filter(notEmpty) ?? [];
  const [showForm, setShowForm] = useState(false);

  const [result] = useQuery<InstructionsQueryData>({
    query: NominationInstructions_Query,
    variables: { id: nominationId },
    pause: !nominationId,
  });

  const canNominatePast = hasRequiredRoles({
    toCheck: [
      { name: "community_talent_coordinator" },
      { name: "community_admin" },
    ],
    userRoles: roleAssignments,
  });

  const data = result.data;
  const closeDate = data?.talentNomination?.talentNominationEvent?.closeDate;
  const isPastEvent = closeDate ? new Date() > new Date(closeDate) : false;
  const showDialogue = isPastEvent && canNominatePast && !showForm;

  const handleToNomination = () => {
    setShowForm(true);
  };

  const handleDialogClose = async () => {
    await navigate(paths.adminTalentManagementEvents());
  };

  if (current !== TalentNominationStep.Instructions) {
    return null;
  }

  if (showDialogue) {
    return (
      <>
        <Dialog.Root
          open
          onOpenChange={async (open) => {
            if (!open) {
              await handleDialogClose();
            }
          }}
        >
          <Dialog.Content
            closeLabel={intl.formatMessage({
              defaultMessage: "Close",
              id: "4p0QdF",
              description: "Button text used to close an open modal",
            })}
          >
            <Dialog.Header>
              {intl.formatMessage({
                defaultMessage: "Closed nomination event",
                id: "PONcJx",
                description: "Title for past talent event confirmation dialog",
              })}
            </Dialog.Header>
            <Dialog.Body>
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "This event is already closed. Are you sure you want to submit a nomination?",
                  id: "IAR6nU",
                  description:
                    "Body text for past talent event confirmation dialog",
                })}
              </p>
              <Dialog.Footer>
                <Button
                  mode="solid"
                  color="primary"
                  onClick={handleToNomination}
                >
                  {intl.formatMessage({
                    defaultMessage: "Start nomination",
                    id: "9Ky9Y4",
                    description: "Confirm button for past talent event dialog",
                  })}
                </Button>
                <Dialog.Close>
                  <Link
                    mode="inline"
                    color="secondary"
                    href={paths.adminTalentManagementEvents()}
                  >
                    {intl.formatMessage({
                      defaultMessage: "Cancel",
                      id: "Wr9Ml4",
                      description: "Cancel button for past talent event dialog",
                    })}
                  </Link>
                </Dialog.Close>
              </Dialog.Footer>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Root>
      </>
    );
  }

  return (
    <UpdateForm>
      <SubHeading icon={ClipboardDocumentListIcon}>
        {intl.formatMessage({
          defaultMessage: "Instructions",
          id: "fhbTHo",
          description: "Heading for instructions step of a talent nomination",
        })}
      </SubHeading>
      <p className="my-6">
        {intl.formatMessage({
          defaultMessage:
            "Welcome to the talent nomination form. This form allows you to nominate a candidate for advancement, lateral movement, or development opportunities unique to their area of work.",
          id: "6ZwHMj",
          description:
            "Paragraph one, instructions on how to submit a nomination",
        })}
      </p>
      <p className="my-6">
        {intl.formatMessage({
          defaultMessage:
            "Nominations must be sponsored by a C-suite level executive working in the candidate’s domain and will be triaged by the associated functional community team. Once confirmed, the candidate will be entered in that community’s talent management system for the current year.",
          id: "QqwcpX",
          description:
            "Paragraph two, instructions on how to submit a nomination",
        })}
      </p>
      <p className="my-6">
        {intl.formatMessage(
          {
            defaultMessage:
              "Have questions? <link>Reach out to our support team</link>.",
            id: "3RUGGK",
            description:
              "Paragraph two, instructions on how to submit a nomination",
          },
          {
            link: (chunks: ReactNode) => (
              <Link href={paths.support()} color="black">
                {chunks}
              </Link>
            ),
          },
        )}
      </p>
    </UpdateForm>
  );
};

export default Instructions;
