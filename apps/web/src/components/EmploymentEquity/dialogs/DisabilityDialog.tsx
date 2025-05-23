import { useIntl } from "react-intl";
import { FormProvider, useForm, type SubmitHandler } from "react-hook-form";
import { useState } from "react";

import { Dialog } from "@gc-digital-talent/ui";
import {
  formMessages,
  getEmploymentEquityGroup,
} from "@gc-digital-talent/i18n";
import Checklist from "@gc-digital-talent/forms/Checklist";

import type { EquityDialogProps } from "../types";
import Definition from "./Definition";
import DialogFooter from "./DialogFooter";
import UnderReview from "./UnderReview";

interface FormValues {
  hasDisability: boolean;
}

const DisabilityDialog = ({
  isAdded,
  onSave,
  children,
  disabled,
}: EquityDialogProps) => {
  const intl = useIntl();
  const [isOpen, setOpen] = useState<boolean>(false);
  const methods = useForm<FormValues>({
    defaultValues: {
      hasDisability: isAdded,
    },
  });
  const { handleSubmit } = methods;

  const submitHandler: SubmitHandler<FormValues> = async (data: FormValues) => {
    await onSave(data.hasDisability).then(() => setOpen(false));
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
              title: intl.formatMessage(getEmploymentEquityGroup("disability")),
            },
          )}
        </Dialog.Header>
        <Dialog.Body>
          <UnderReview />
          <Definition
            url={
              intl.locale === "en"
                ? "https://www23.statcan.gc.ca/imdb/p3VD.pl?Function=getVD&TVD=247841&CVD=247841&CLV=0&MLV=1&D=1"
                : "https://www23.statcan.gc.ca/imdb/p3VD_f.pl?Function=getVD&TVD=247841&CVD=247841&CLV=0&MLV=1&D=1"
            }
            quotedDefinition={intl.formatMessage({
              defaultMessage:
                '"refers to a person whose daily activities are limited as a result of an impairment or difficulty with particular tasks. The only exception to this is for developmental disabilities where a person is considered to be disabled if the respondent has been diagnosed with this condition."',
              id: "JbSK7q",
              description:
                "Definition of Person with a disability from the StatsCan 'Classification of Status of Disability' page.",
            })}
          />
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(submitHandler)}>
              <div data-h2-margin="base(x1, 0, 0, 0)">
                <Checklist
                  idPrefix="hasDisability"
                  id="hasDisability"
                  name="hasDisability"
                  legend={intl.formatMessage(formMessages.identifyAs)}
                  trackUnsaved={false}
                  items={[
                    {
                      value: "true",
                      label: intl.formatMessage({
                        defaultMessage: "a person with a disability.",
                        id: "X8e/zb",
                        description:
                          "Statement for when someone indicates they have a disability",
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

export default DisabilityDialog;
