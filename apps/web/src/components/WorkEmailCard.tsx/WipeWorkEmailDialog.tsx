import { useState } from "react";
import { useIntl } from "react-intl";
import { useMutation } from "urql";

import { Button, AlertDialog } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";
import { graphql } from "@gc-digital-talent/graphql";
import { toast } from "@gc-digital-talent/toast";

const WipeWorkEmail_Mutation = graphql(/* GraphQL */ `
  mutation WipeWorkEmail($id: UUID!) {
    wipeUserWorkEmail(id: $id) {
      id
    }
  }
`);

interface WipeWorkEmailDialogProps {
  id: string;
  workEmail: string;
}

const WipeWorkEmailDialog = ({ id, workEmail }: WipeWorkEmailDialogProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const intl = useIntl();

  const dialogTitle = intl.formatMessage({
    defaultMessage: "Remove this work email?",
    id: "PTfLmk",
    description: "Dialog header",
  });
  const handleError = () => {
    toast.error(
      intl.formatMessage({
        defaultMessage: "Error: failed to delete",
        id: "jyECqY",
        description: "Error for failing to delete",
      }),
    );
  };

  const [{ fetching }, executeWipeWorkInformationMutation] = useMutation(
    WipeWorkEmail_Mutation,
  );
  const wipeWorkInformation = async () => {
    await executeWipeWorkInformationMutation({ id })
      .then((result) => {
        if (result.data?.wipeUserWorkEmail) {
          toast.success(
            intl.formatMessage({
              defaultMessage: "Work email deleted",
              id: "3bVNFv",
              description: "Successfully cleared work email information",
            }),
          );
          setIsOpen(false);
        } else {
          void handleError();
        }
      })
      .catch(handleError);
  };
  const handleWipe = async () => {
    await wipeWorkInformation();
  };

  return (
    <AlertDialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialog.Trigger>
        <Button color="error" mode="inline">
          {intl.formatMessage(commonMessages.remove)}
        </Button>
      </AlertDialog.Trigger>
      <AlertDialog.Content>
        <AlertDialog.Title>{dialogTitle}</AlertDialog.Title>
        <AlertDialog.Description>
          <p className="mb-6">
            {intl.formatMessage(
              {
                id: "Z/+VPX",
                defaultMessage:
                  "Are you sure you want to remove <underline>{workEmail}</underline>? Removing it while verified will pause access to your employee tools until you verify a new work email",
                description: "Text to confirm deletion action",
              },
              {
                workEmail,
              },
            )}
          </p>
          <AlertDialog.Footer>
            <AlertDialog.Action>
              <Button
                color="error"
                disabled={fetching}
                type="submit"
                onClick={handleWipe}
              >
                {intl.formatMessage({
                  defaultMessage: "Yes, remove this work email",
                  id: "pL+3xG",
                  description: "Action text",
                })}
              </Button>
            </AlertDialog.Action>
            <AlertDialog.Cancel>
              <Button color="warning" mode="inline">
                {intl.formatMessage(commonMessages.cancel)}
              </Button>
            </AlertDialog.Cancel>
          </AlertDialog.Footer>
        </AlertDialog.Description>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
};

export default WipeWorkEmailDialog;
