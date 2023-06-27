import React from "react";
import { useIntl } from "react-intl";
import { FormProvider, useForm, type SubmitHandler } from "react-hook-form";

import { Dialog } from "@gc-digital-talent/ui";
import { Checklist } from "@gc-digital-talent/forms";
import {
  errorMessages,
  getEmploymentEquityGroup,
  getEmploymentEquityStatement,
} from "@gc-digital-talent/i18n";

import type { EquityDialogProps } from "../types";

import Definition from "./Definition";
import DialogFooter from "./DialogFooter";
import UnderReview from "./UnderReview";

interface FormValues {
  isWoman: boolean;
}

const WomanDialog = ({ isAdded, onSave, children }: EquityDialogProps) => {
  const intl = useIntl();
  const methods = useForm<FormValues>({
    defaultValues: {
      isWoman: isAdded,
    },
  });
  const { handleSubmit } = methods;

  const submitHandler: SubmitHandler<FormValues> = async (data: FormValues) => {
    onSave(data.isWoman);
  };

  return (
    <Dialog.Root>
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
              title: intl.formatMessage(getEmploymentEquityGroup("woman")),
            },
          )}
        </Dialog.Header>
        <Dialog.Body>
          <UnderReview />
          <Definition
            url={
              intl.locale === "en"
                ? "https://www23.statcan.gc.ca/imdb/p3VD.pl?Function=getVD&TVD=1326727&CVD=1326727&CLV=0&MLV=1&D=1"
                : "https://www23.statcan.gc.ca/imdb/p3VD_f.pl?Function=getVD&TVD=1326727&CVD=1326727&CLV=0&MLV=1&D=1"
            }
            quotedDefinition={intl.formatMessage({
              defaultMessage:
                '"... includes persons whose reported gender is female. It includes cisgender (cis) and transgender (trans) women."',
              id: "2yXxyQ",
              description:
                "Definition of the Woman category from the StatsCan 'Classification of gender' page.",
            })}
          />
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(submitHandler)}>
              <div data-h2-margin="base(x1, 0, 0, 0)">
                <Checklist
                  idPrefix="isWoman"
                  id="isWoman"
                  name="isWoman"
                  legend={intl.formatMessage({
                    defaultMessage:
                      "Based on the definition provided, I want to add:",
                    id: "O+fNOe",
                    description:
                      "Prompt text for a user selecting an employment equity group for their profile",
                  })}
                  rules={{
                    required: intl.formatMessage(errorMessages.required),
                  }}
                  trackUnsaved={false}
                  items={[
                    {
                      value: "true",
                      label: intl.formatMessage(
                        getEmploymentEquityStatement("woman"),
                      ),
                    },
                  ]}
                />
              </div>
              <Dialog.Footer>
                <DialogFooter />
              </Dialog.Footer>
            </form>
          </FormProvider>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default WomanDialog;
