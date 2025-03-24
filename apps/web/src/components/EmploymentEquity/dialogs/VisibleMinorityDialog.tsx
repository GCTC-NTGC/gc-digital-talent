import { useIntl } from "react-intl";
import { FormProvider, useForm, type SubmitHandler } from "react-hook-form";
import { useState } from "react";

import { Dialog } from "@gc-digital-talent/ui";
import { Checklist } from "@gc-digital-talent/forms";
import {
  formMessages,
  getEmploymentEquityGroup,
} from "@gc-digital-talent/i18n";

import type { EquityDialogProps } from "../types";
import Definition from "./Definition";
import DialogFooter from "./DialogFooter";
import UnderReview from "./UnderReview";

interface FormValues {
  isVisibleMinority: boolean;
}

const VisibleMinorityDialog = ({
  isAdded,
  onSave,
  children,
  disabled,
}: EquityDialogProps) => {
  const intl = useIntl();
  const [isOpen, setOpen] = useState<boolean>(false);
  const methods = useForm<FormValues>({
    defaultValues: {
      isVisibleMinority: isAdded,
    },
  });
  const { handleSubmit } = methods;

  const submitHandler: SubmitHandler<FormValues> = async (data: FormValues) => {
    await onSave(data.isVisibleMinority).then(() => setOpen(false));
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setOpen}>
      <Dialog.Trigger>{children}</Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          {intl.formatMessage(
            {
              defaultMessage: 'Add "{title}" to your profile',
              id: "OleLgS",
              description:
                "Heading for the add employment equity option to profile dialogs",
            },
            {
              title: intl.formatMessage(getEmploymentEquityGroup("minority")),
            },
          )}
        </Dialog.Header>
        <Dialog.Body>
          <UnderReview />
          <Definition
            url={
              intl.locale === "en"
                ? "https://www23.statcan.gc.ca/imdb/p3Var.pl?Function=DEC&Id=45152"
                : "https://www23.statcan.gc.ca/imdb/p3Var_f.pl?Function=DEC&Id=45152"
            }
            quotedDefinition={intl.formatMessage({
              defaultMessage:
                '"refers to whether a person is a visible minority or not, as defined by the Employment Equity Act. The Employment Equity Act defines visible minorities as "persons, other than Aboriginal peoples, who are non-Caucasian in race or non-white in colour". The visible minority population consists mainly of the following groups: South Asian, Chinese, Black, Filipino, Arab, Latin American, Southeast Asian, West Asian, Korean and Japanese."',
              id: "3tu/Mv",
              description:
                "Definition of Visible minority from the StatsCan 'Visible minority of person' page.",
            })}
          />
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(submitHandler)}>
              <div data-h2-margin="base(x1, 0, 0, 0)">
                <Checklist
                  idPrefix="isVisibleMinority"
                  id="isVisibleMinority"
                  name="isVisibleMinority"
                  legend={intl.formatMessage(formMessages.identifyAs)}
                  trackUnsaved={false}
                  items={[
                    {
                      value: "true",
                      label: intl.formatMessage({
                        defaultMessage: "a member of a visible minority.",
                        id: "VlI6x0",
                        description:
                          "Statement for when someone indicates they are a visible minority",
                      }),
                    },
                  ]}
                />
              </div>
              <Dialog.Footer>
                <DialogFooter disabled={disabled} />
              </Dialog.Footer>
            </form>
          </FormProvider>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default VisibleMinorityDialog;
