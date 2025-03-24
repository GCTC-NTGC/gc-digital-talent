import { useIntl } from "react-intl";
import { FormProvider, useForm, type SubmitHandler } from "react-hook-form";
import { useState } from "react";

import { Dialog } from "@gc-digital-talent/ui";
import { Input } from "@gc-digital-talent/forms";
import {
  errorMessages,
  formMessages,
  getEmploymentEquityGroup,
} from "@gc-digital-talent/i18n";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import { getSelfDeclarationLabels } from "~/components/SelfDeclaration/utils";
import { CommunityList } from "~/components/SelfDeclaration/CommunitySelection";
import {
  apiCommunitiesToFormValuesWithBoolean as apiCommunitiesToFormValues,
  FormValuesWithBoolean as FormValues,
  formValuesToApiCommunities,
} from "~/utils/indigenousDeclaration";

import { IndigenousDialogProps } from "../types";
import Definition from "./Definition";
import DialogFooter from "./DialogFooter";
import UnderReview from "./UnderReview";

interface FormValuesWithSignature extends FormValues {
  signature: string | undefined | null;
}

const IndigenousDialog = ({
  indigenousCommunities,
  signature,
  onSave,
  children,
  disabled,
}: IndigenousDialogProps) => {
  const intl = useIntl();
  const [isOpen, setOpen] = useState<boolean>(false);
  const methods = useForm<FormValuesWithSignature>({
    defaultValues: {
      ...apiCommunitiesToFormValues(
        unpackMaybes(
          indigenousCommunities.flatMap((community) => community.value),
        ),
      ),
      signature,
    },
  });
  const { handleSubmit, watch } = methods;
  const communities = watch("communities");
  const hasCommunitiesSelected = communities && communities.length > 0;

  const submitHandler: SubmitHandler<FormValuesWithSignature> = async (
    data: FormValuesWithSignature,
  ) => {
    const newCommunities = formValuesToApiCommunities(data);
    await onSave({
      indigenousCommunities: newCommunities,
      indigenousDeclarationSignature:
        newCommunities.length > 0 ? data.signature : null,
    }).then(() => setOpen(false));
  };

  const labels = getSelfDeclarationLabels(intl);

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
                '"refers to whether the person identified with the Indigenous peoples of Canada. This includes those who identify as First Nations (North American Indian), Métis and/or Inuk (Inuit), and/or those who report being Registered or Treaty Indians (that is, registered under the Indian Act of Canada), and/or those who have membership in a First Nation or Indian band. Aboriginal peoples of Canada (referred to here as Indigenous peoples) are defined in the Constitution Act, 1982, Section 35 (2) as including the Indian, Inuit and Métis peoples of Canada."',
              id: "eX+V6c",
              description:
                "Definition of Indigenous identity from the StatsCan 'Indigenous identity of person' page.",
            })}
          />
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(submitHandler)}>
              <p data-h2-margin="base(x1, 0, x.5, 0)">
                {intl.formatMessage({
                  defaultMessage:
                    "You can self-declare with one or more of the communities listed alphabetically below.",
                  id: "CWy2xr",
                  description:
                    "Text that appears before employment equity form options.",
                })}
              </p>
              <div data-h2-margin="base(x1, 0, x1.5, 0)">
                <CommunityList labels={labels} />
              </div>

              {hasCommunitiesSelected && (
                <>
                  <p data-h2-padding-bottom="base(x1)">
                    {intl.formatMessage({
                      defaultMessage:
                        "By submitting your signature (typing your full name), you are contributing to an honest and safe space for Indigenous Peoples to access these job opportunities.",
                      id: "9LR5wC",
                      description:
                        "Disclaimer before signing Indigenous self-declaration form",
                    })}
                  </p>
                  <Input
                    id="signature"
                    name="signature"
                    type="text"
                    label={labels.signature}
                    rules={{
                      required: intl.formatMessage(errorMessages.required),
                    }}
                  />
                </>
              )}
              <Dialog.Footer>
                <DialogFooter
                  disabled={disabled}
                  saveText={
                    hasCommunitiesSelected
                      ? intl.formatMessage({
                          defaultMessage: "Sign and save changes",
                          id: "fgVziE",
                          description:
                            "Button text to submit indigenous identity form.",
                        })
                      : intl.formatMessage(formMessages.saveChanges)
                  }
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
