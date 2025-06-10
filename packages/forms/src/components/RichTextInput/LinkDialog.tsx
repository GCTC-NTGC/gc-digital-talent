import { useIntl } from "react-intl";
import { Editor } from "@tiptap/react";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import LinkIcon from "@heroicons/react/20/solid/LinkIcon";
import { KeyboardEventHandler, useState } from "react";

import { Dialog, Button } from "@gc-digital-talent/ui";
import {
  richTextMessages,
  errorMessages,
  commonMessages,
} from "@gc-digital-talent/i18n";
import { sanitizeUrl } from "@gc-digital-talent/helpers";

import Input from "../Input/Input";
import Checkbox from "../Checkbox/Checkbox";
import MenuButton from "./MenuButton";

const validLinkRegex =
  /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?$/i;
const looseProtocolRegex = /^(?!(?:\w+?:)?\/\/)/;
const localHostRegex = /^\.*\/|^(?!localhost)\w+?:/;

const prependHttp = (url: string, https = false): string => {
  const transformedUrl = url.trim();

  // Don't prepend to localhost or a hash
  if (localHostRegex.test(transformedUrl) || transformedUrl === "#") {
    return transformedUrl;
  }

  // Append to beginning of string if protocol does not exist
  return transformedUrl.replace(
    looseProtocolRegex,
    https ? "https://" : "http://",
  );
};

interface FormValues {
  href: string;
  newTab?: boolean;
  action: "add" | "remove";
}

interface LinkDialogProps {
  editor: Editor | null;
}

const LinkDialog = ({ editor }: LinkDialogProps) => {
  const intl = useIntl();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleSubmit: SubmitHandler<FormValues> = (
    { href, newTab, action },
    e,
  ) => {
    e?.stopPropagation();
    if (action === "add") {
      const sanitizedUrl = sanitizeUrl(href) ?? "";
      editor
        ?.chain()
        .focus()
        .setLink({
          href: prependHttp(sanitizedUrl) || "",
          target: newTab ? "_blank" : "__self",
        })
        .run();
    } else {
      editor?.chain().focus().unsetLink().run();
    }
    setIsOpen(false);
    return false;
  };

  const methods = useForm<FormValues>();
  const actionProps = methods.register("action");

  const handleSave = async (action: FormValues["action"]) => {
    methods.setValue("action", action);
    await methods.handleSubmit(handleSubmit)();
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      const attributes = editor?.getAttributes("link");
      if (newOpen && (attributes?.href || attributes?.target)) {
        if (attributes?.href) {
          methods.setValue("href", String(attributes.href));
        }
        if (attributes?.target) {
          methods.setValue("newTab", attributes.target === "_blank");
        }
      }
    } else {
      methods.resetField("href");
      methods.resetField("newTab");
    }

    setIsOpen(newOpen);
  };

  const handleKeyDown: KeyboardEventHandler = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      void handleSave("add");
    }
  };

  const isValidLink = (value: string) => {
    const url = prependHttp(value);

    return (
      validLinkRegex.test(url) ||
      url === "#" ||
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
                <div className="flex flex-col gap-y-3">
                  <Input
                    id="href"
                    name="href"
                    type="text"
                    label={intl.formatMessage(richTextMessages.url)}
                    onKeyDown={handleKeyDown}
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
                <Dialog.Footer className="justify-start">
                  <Button
                    type="button"
                    color="primary"
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
