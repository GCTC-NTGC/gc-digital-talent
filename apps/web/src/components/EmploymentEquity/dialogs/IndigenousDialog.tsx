import React from "react";
import { useIntl } from "react-intl";
import { FormProvider, useForm, type SubmitHandler } from "react-hook-form";

import { Dialog } from "@gc-digital-talent/ui";
import {
  errorMessages,
  getEmploymentEquityGroup,
} from "@gc-digital-talent/i18n";

import { getSelfDeclarationLabels } from "~/pages/Applications/ApplicationSelfDeclarationPage/SelfDeclaration/utils";
import { CommunityList } from "~/pages/Applications/ApplicationSelfDeclarationPage/SelfDeclaration/CommunitySelection";
import {
  apiCommunitiesToFormValuesWithBoolean as apiCommunitiesToFormValues,
  FormValuesWithBoolean as FormValues,
  formValuesToApiCommunities,
} from "~/utils/indigenousDeclaration";
import { Input } from "@gc-digital-talent/forms";
import { IndigenousDialogProps } from "../types";

import Definition from "./Definition";
import DialogFooter from "./DialogFooter";
import UnderReview from "./UnderReview";

interface FormValuesWithSignature extends FormValues {
  signature: string | undefined;
}

const IndigenousDialog = ({
  indigenousCommunities,
  signature,
  onSave,
  children,
}: IndigenousDialogProps) => {
  const intl = useIntl();
  const methods = useForm<FormValuesWithSignature>({
    defaultValues: {
      ...apiCommunitiesToFormValues(indigenousCommunities),
      signature,
    },
  });
  const { handleSubmit } = methods;

  const submitHandler: SubmitHandler<FormValuesWithSignature> = async (
    data: FormValuesWithSignature,
  ) => {
    onSave({
      indigenousCommunities: formValuesToApiCommunities(data),
      indigenousDeclarationSignature: data.signature,
    });
  };

  const labels = getSelfDeclarationLabels(intl);

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
              title: intl.formatMessage(getEmploymentEquityGroup("indigenous")),
            },
          )}
        </Dialog.Header>
        <Dialog.Body>
          <UnderReview />
          <Definition
            url={
              intl.locale === "en"
                ? "https://www23.statcan.gc.ca/imdb/p3Var.pl?Function=DEC&Id=42927"
                : "https://www23.statcan.gc.ca/imdb/p3Var_f.pl?Function=DEC&Id=42927"
            }
            quotedDefinition={intl.formatMessage({
              defaultMessage:
                '"... refers to whether the person identified with the Indigenous peoples of Canada. This includes those who identify as First Nations (North American Indian), Métis and/or Inuk (Inuit), and/or those who report being Registered or Treaty Indians (that is, registered under the Indian Act of Canada), and/or those who have membership in a First Nation or Indian band. Aboriginal peoples of Canada (referred to here as Indigenous peoples) are defined in the Constitution Act, 1982, Section 35 (2) as including the Indian, Inuit and Métis peoples of Canada."',
              id: "AfSlkm",
              description:
                "Definition of Indigenous identity from the StatsCan 'Indigenous identity of person' page.",
            })}
          />
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(submitHandler)}>
              <p data-h2-margin="base(x1, 0, x.5, 0)">
                {intl.formatMessage({
                  defaultMessage:
                    "You can Self-Declare with one or more of the communities listed alphabetically below.",
                  id: "/kQQWi",
                  description:
                    "Text that appears before employment equity form options.",
                })}
              </p>
              <div data-h2-margin="base(x1, 0, x1.5, 0)">
                <CommunityList labels={labels} />
              </div>
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "By submitting your signature (typing your full name), you are contributing to an honest and safe space for Indigenous Peoples to access these opportunities.",
                  id: "cVszq/",
                  description:
                    "Sentence before signature space on the add indigenous identity dialog",
                })}
              </p>
              <Input
                id="signature"
                name="signature"
                type="text"
                label={labels.signature}
                rules={{ required: intl.formatMessage(errorMessages.required) }}
              />
              <Dialog.Footer>
                <DialogFooter
                  saveText={intl.formatMessage({
                    defaultMessage: "Sign and save changes",
                    id: "fgVziE",
                    description:
                      "Button text to submit indigenous identity form.",
                  })}
                />
              </Dialog.Footer>
            </form>
          </FormProvider>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default IndigenousDialog;
