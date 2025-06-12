import { useIntl } from "react-intl";

import { Button, Dialog } from "@gc-digital-talent/ui";

import CloseButton from "./CloseButton";
import type { BasicDialogProps } from "./types";

const SelfDeclarationDialog = ({ children, btnProps }: BasicDialogProps) => {
  const intl = useIntl();

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button
          color="secondary"
          mode="text"
          className="font-bold"
          {...btnProps}
        >
          {children}
        </Button>
      </Dialog.Trigger>
      <Dialog.Content
        closeLabel={intl.formatMessage({
          defaultMessage: "Close",
          id: "4p0QdF",
          description: "Button text used to close an open modal",
        })}
      >
        <Dialog.Header>
          {intl.formatMessage({
            defaultMessage: "Why are we asking you to self declare?",
            id: "5dgCOy",
            description: "Heading for the self-declaration explanation dialog",
          })}
        </Dialog.Header>
        <Dialog.Body>
          <p className="my-6">
            {intl.formatMessage({
              defaultMessage:
                "We recognize the importance of Indigenous voices in the federal government. The goal of the IT Apprenticeship Program for Indigenous Peoples is to amplify Indigenous voices by creating opportunities for First Nations, Inuit, and Métis peoples to join the federal public service.",
              id: "J2uivT",
              description:
                "Paragraph one for the self-declaration explanation dialog",
            })}
          </p>
          <p className="my-6">
            {intl.formatMessage({
              defaultMessage:
                "These opportunities support improved employment and economic outcomes for Indigenous peoples, consistent with the principles contained in the United Nations Declaration on the Rights of Indigenous Peoples. The opportunities also support the process of reconciliation in our country.",
              id: "dT/c1r",
              description:
                "Paragraph two for the self-declaration explanation dialog",
            })}
          </p>
          <p className="my-6">
            {intl.formatMessage({
              defaultMessage:
                " To ensure the program remains available to Indigenous peoples in Canada, we ask that you complete the Indigenous Peoples Self-Declaration Form and confirm for us that you are a member of one or more of the Indigenous communities in Canada.",
              id: "qEvJjr",
              description:
                "Paragraph three for the self-declaration explanation dialog",
            })}
          </p>
          <Dialog.Footer>
            <CloseButton />
          </Dialog.Footer>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default SelfDeclarationDialog;
