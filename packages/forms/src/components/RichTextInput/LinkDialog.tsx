import React from "react";
import { useIntl } from "react-intl";
import { Editor } from "@tiptap/react";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import LinkIcon from "@heroicons/react/20/solid/LinkIcon";

import { Dialog, Button } from "@gc-digital-talent/ui";
import {
  richTextMessages,
  errorMessages,
  commonMessages,
} from "@gc-digital-talent/i18n";
import { sanitizeUrl } from "@gc-digital-talent/helpers";

import Input from "../Input";
import Checkbox from "../Checkbox";
import MenuButton from "./MenuButton";

const validLinkRegex =
  /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?$/i;

type FormValues = {
  href: string;
  newTab?: boolean;
  action: "add" | "remove";
};

interface LinkDialogProps {
  editor: Editor | null;
}

const LinkDialog = ({ editor }: LinkDialogProps) => {
  const intl = useIntl();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const handleSubmit: SubmitHandler<FormValues> = ({
    href,
    newTab,
    action,
  }) => {
    if (action === "add") {
      editor
        ?.chain()
        .focus()
        .setLink({
          href: sanitizeUrl(href) ?? "",
          target: newTab ? "_blank" : "__self",
        })
        .run();
    } else {
      editor?.chain().focus().unsetLink().run();
    }
    setIsOpen(false);
  };

  const methods = useForm<FormValues>();
  const actionProps = methods.register("action");

  const handleSave = (action: FormValues["action"]) => {
    methods.setValue("action", action);
    methods.handleSubmit(handleSubmit)();
  };

  const handleOpenChange = (newOpen: boolean) => {
    const attributes = editor?.getAttributes("link");
    if (newOpen && (attributes?.href || attributes?.target)) {
      if (attributes?.href) {
        methods.setValue("href", attributes.href);
      }
      if (attributes?.target) {
        methods.setValue("newTab", attributes.target === "_blank");
      }
    }
    setIsOpen(newOpen);
  };

  const isValidLink = (value: string) => {
    return (
      validLinkRegex.test(value) ||
      value === "#" ||
      intl.formatMessage(richTextMessages.invalidLink)
    );
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Dialog.Trigger>
        <MenuButton
          active={isOpen}
          icon={LinkIcon}
          disabled={
            !editor?.isEditable ||
            !editor?.can().setLink({ href: "" }) ||
            editor?.view.state.selection.empty
          }
        >
          {intl.formatMessage(richTextMessages.link)}
        </MenuButton>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Content>
          <Dialog.Header>
            {intl.formatMessage(richTextMessages.addLink)}
          </Dialog.Header>
          <Dialog.Body>
            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(handleSubmit)}>
                <div
                  data-h2-display="base(flex)"
                  data-h2-flex-direction="base(column)"
                  data-h2-gap="base(x1 0)"
                >
                  <Input
                    id="href"
                    name="href"
                    type="text"
                    label={intl.formatMessage(richTextMessages.url)}
                    rules={{
                      required: intl.formatMessage(errorMessages.required),
                      validate: {
                        isValidLink,
                      },
                    }}
                  />
                  <Checkbox
                    id="newTab"
                    name="newTab"
                    label={intl.formatMessage(richTextMessages.newTab)}
                  />
                </div>
                <Dialog.Footer data-h2-justify-content="base(flex-start)">
                  <Button
                    type="button"
                    color="secondary"
                    {...actionProps}
                    value="add"
                    onClick={() => handleSave("add")}
                  >
                    {intl.formatMessage(richTextMessages.addLink)}
                  </Button>
                  {editor?.getAttributes("link").href && (
                    <Button
                      type="button"
                      color="error"
                      {...actionProps}
                      value="remove"
                      onClick={() => handleSave("remove")}
                    >
                      {intl.formatMessage(richTextMessages.removeLink)}
                    </Button>
                  )}
                  <Dialog.Close>
                    <Button mode="inline" color="black">
                      {intl.formatMessage(commonMessages.cancel)}
                    </Button>
                  </Dialog.Close>
                </Dialog.Footer>
              </form>
            </FormProvider>
          </Dialog.Body>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default LinkDialog;
