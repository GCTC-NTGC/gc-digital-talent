import { useState } from "react";
import { useIntl } from "react-intl";
import { FormProvider, useForm } from "react-hook-form";
import { useMutation } from "urql";

import { Dialog, Button } from "@gc-digital-talent/ui";
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

  const methods = useForm();
  const { handleSubmit } = methods;

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
        } else {
          void handleError();
        }
      })
      .catch(handleError);
  };
  const handleWipe = async () => {
    await wipeWorkInformation().then(() => {
      setIsOpen(false);
    });
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger>
        <Button color="error" mode="inline">
          {intl.formatMessage(commonMessages.remove)}
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>{dialogTitle}</Dialog.Header>
        <Dialog.Body>
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
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleWipe)}>
              <Dialog.Footer>
                <Button color="error" disabled={fetching} type="submit">
                  {intl.formatMessage({
                    defaultMessage: "Yes, remove this work email",
                    id: "pL+3xG",
                    description: "Action text",
                  })}
                </Button>
                <Dialog.Close>
                  <Button color="warning" mode="inline">
                    {intl.formatMessage(commonMessages.cancel)}
                  </Button>
                </Dialog.Close>
              </Dialog.Footer>
            </form>
          </FormProvider>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default WipeWorkEmailDialog;
