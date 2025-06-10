import { useIntl } from "react-intl";

import { Button, Dialog } from "@gc-digital-talent/ui";

import CloseButton from "./CloseButton";
import type { BasicDialogProps } from "./types";

const DefinitionDialog = ({ children, btnProps }: BasicDialogProps) => {
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
            defaultMessage: "Indigenous as defined for this program",
            id: "UOeiIa",
            description: "Heading for the definition of Indigenous dialog",
          })}
        </Dialog.Header>
        <Dialog.Body>
          <p className="my-6">
            {intl.formatMessage({
              defaultMessage:
                '<strong>Indigenous</strong>: means a person who is recognized as "one of the aboriginal peoples of Canada" within the meaning of section 35 the Constitution Act, 1982, which further states that for the purposes of the Constitution, the "aboriginal peoples of Canada includes the Indian, Inuit, and Métis peoples of Canada". This policy (consistent with general Canadian practices) understands the term "Indians" in the Constitution to now be replaced by the term "First Nations".',
              id: "w4SSBu",
              description: "Content for the definition of Indigenous dialog",
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

export default DefinitionDialog;
