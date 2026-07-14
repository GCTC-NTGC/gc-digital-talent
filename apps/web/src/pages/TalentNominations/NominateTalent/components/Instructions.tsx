import { useState } from "react";
import { useIntl } from "react-intl";
import ClipboardDocumentListIcon from "@heroicons/react/24/outline/ClipboardDocumentListIcon";
import type { ReactNode } from "react";
import { useNavigate } from "react-router";

import type { FragmentType } from "@gc-digital-talent/graphql";
import {
  Permission,
  TalentNominationStep,
  graphql,
  getFragment,
} from "@gc-digital-talent/graphql";
import { Link, Dialog, Button } from "@gc-digital-talent/ui";
import { useHasPermissions } from "@gc-digital-talent/auth";
import { htmlToRichTextJSON, RichTextRenderer } from "@gc-digital-talent/forms";

import useRoutes from "~/hooks/useRoutes";

import useCurrentStep from "../useCurrentStep";
import SubHeading from "./SubHeading";
import UpdateForm from "./UpdateForm";

export const NominateTalentInstructions_Fragment = graphql(/* GraphQL */ `
  fragment NominateTalentInstructions on TalentNomination {
    id
    talentNominationEvent {
      id
      closeDate
      customInstructions {
        localized
      }
      contactEmail
    }
  }
`);

interface InstructionsProps {
  instructionsQuery: FragmentType<typeof NominateTalentInstructions_Fragment>;
}

const Instructions = ({ instructionsQuery }: InstructionsProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const navigate = useNavigate();
  const { current } = useCurrentStep();
  const data = getFragment(
    NominateTalentInstructions_Fragment,
    instructionsQuery,
  );
  const [showForm, setShowForm] = useState(false);

  const canNominatePast = useHasPermissions({
    permission: Permission.CreateOwnPastTalentNomination,
  });

  const closeDate = data?.talentNominationEvent?.closeDate;
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
                      id: "FhWYXz",
                      description: "Label for close general question dialog.",
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
      {data.talentNominationEvent.customInstructions?.localized ? (
        <div className="my-6">
          <RichTextRenderer
            node={htmlToRichTextJSON(
              data.talentNominationEvent.customInstructions.localized,
            )}
          />
        </div>
      ) : null}

      {data.talentNominationEvent.contactEmail ? (
        <div className="my-6">
          {intl.formatMessage(
            {
              defaultMessage:
                "Have questions? <link>Reach out to the community event team.</link>",
              id: "jUI9DU",
              description:
                "Paragraph two, instructions on how to submit a nomination",
            },
            {
              link: (chunks: ReactNode) => (
                <Link
                  href={`mailto:${data.talentNominationEvent.contactEmail}`}
                  color="black"
                >
                  {chunks}
                </Link>
              ),
            },
          )}
        </div>
      ) : null}
    </UpdateForm>
  );
};

export default Instructions;
