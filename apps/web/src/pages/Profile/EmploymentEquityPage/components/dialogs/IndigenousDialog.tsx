import React from "react";
import { useIntl } from "react-intl";
import {
  FormProvider,
  useForm,
  useFormContext,
  type SubmitHandler,
} from "react-hook-form";

import { Dialog } from "@gc-digital-talent/ui";
import { Checkbox, Fieldset, FieldLabels } from "@gc-digital-talent/forms";
import {
  getEmploymentEquityGroup,
  getEmploymentEquityStatement,
} from "@gc-digital-talent/i18n";

import { getSelfDeclarationLabels } from "~/components/SelfDeclaration/utils";
import { CommunityList } from "~/components/SelfDeclaration/CommunitySelection";
import { IndigenousCommunity } from "~/api/generated";

import AddToProfile from "./AddToProfile";
import Definition from "./Definition";
import DialogFooter from "./DialogFooter";
import UnderReview from "./UnderReview";
import { IndigenousDialogProps } from "../../types";

interface CommunitySelectionProps {
  labels: FieldLabels;
}

// constrained list of community form values to avoid typos
type FormCommunity = "firstNations" | "inuk" | "metis" | "other";

// small wrapper to take value of confirmation checkbox and make CommunityList conditional
const CommunitySelection = ({ labels }: CommunitySelectionProps) => {
  const { watch } = useFormContext();

  const [isIndigenousValue] = watch(["isIndigenous"]);
  const isIndigenous = !!isIndigenousValue;

  return isIndigenous ? <CommunityList labels={labels} /> : null;
};
interface FormValues {
  isIndigenous: boolean;
  communities: Array<FormCommunity>;
  isStatusFirstNations: "yes" | "no" | null;
}

function apiValuesToFormValues(
  apiCommunities: Array<IndigenousCommunity>,
): FormValues {
  // array of form communities that will be built and returned
  const formCommunities: Array<FormCommunity> = [];

  if (
    apiCommunities.includes(IndigenousCommunity.StatusFirstNations) ||
    apiCommunities.includes(IndigenousCommunity.NonStatusFirstNations)
  )
    formCommunities.push("firstNations");
  if (apiCommunities.includes(IndigenousCommunity.Inuit))
    formCommunities.push("inuk");
  if (apiCommunities.includes(IndigenousCommunity.Metis))
    formCommunities.push("metis");
  if (apiCommunities.includes(IndigenousCommunity.Other))
    formCommunities.push("other");

  // Figure out if isStatusFirstNations should be yes/no/null
  let isStatusFirstNations: FormValues["isStatusFirstNations"];
  if (apiCommunities.includes(IndigenousCommunity.StatusFirstNations))
    isStatusFirstNations = "yes";
  else if (apiCommunities.includes(IndigenousCommunity.NonStatusFirstNations))
    isStatusFirstNations = "no";
  else isStatusFirstNations = null;

  // assemble object from pre-computed values
  return {
    isIndigenous: apiCommunities.length > 0,
    communities: formCommunities,
    isStatusFirstNations,
  };
}

function formValuesToApiValues(
  formValues: FormValues,
): Array<IndigenousCommunity> {
  // short-circuit if isIndigenous is not checked
  if (!formValues.isIndigenous) return [];

  // array of API communities that will be built and returned
  const apiCommunities: Array<IndigenousCommunity> = [];

  if (
    formValues.communities.includes("firstNations") &&
    formValues.isStatusFirstNations === "yes"
  )
    apiCommunities.push(IndigenousCommunity.StatusFirstNations);
  if (
    formValues.communities.includes("firstNations") &&
    formValues.isStatusFirstNations === "no"
  )
    apiCommunities.push(IndigenousCommunity.NonStatusFirstNations);
  if (formValues.communities.includes("inuk"))
    apiCommunities.push(IndigenousCommunity.Inuit);
  if (formValues.communities.includes("metis"))
    apiCommunities.push(IndigenousCommunity.Metis);
  if (formValues.communities.includes("other"))
    apiCommunities.push(IndigenousCommunity.Other);

  return apiCommunities;
}

const IndigenousDialog = ({
  indigenousCommunities,
  onSave,
  children,
}: IndigenousDialogProps) => {
  const intl = useIntl();
  const methods = useForm<FormValues>({
    defaultValues: apiValuesToFormValues(indigenousCommunities),
  });
  const { handleSubmit } = methods;

  const submitHandler: SubmitHandler<FormValues> = async (data: FormValues) => {
    onSave(formValuesToApiValues(data));
  };

  const labels = getSelfDeclarationLabels(intl);

  return (
    <Dialog.Root>
      <Dialog.Trigger>{children}</Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          {intl.formatMessage(getEmploymentEquityGroup("indigenous"))}
        </Dialog.Header>
        <Dialog.Body>
          <UnderReview />
          <Definition
            url={
              intl.locale === "en"
                ? "https://www23.statcan.gc.ca/imdb/p3Var.pl?Function=DEC&Id=42927"
                : "https://www23.statcan.gc.ca/imdb/p3Var_f.pl?Function=DEC&Id=42927"
            }
          />
          <p data-h2-margin="base(x1, 0)">
            {intl.formatMessage({
              defaultMessage:
                "Indigenous identity refers to whether the person identified with the Indigenous peoples of Canada. This includes those who identify as First Nations (North American Indian), Métis and/or Inuk (Inuit), and/or those who report being Registered or Treaty Indians (that is, registered under the Indian Act of Canada), and/or those who have membership in a First Nation or Indian band. Aboriginal peoples of Canada (referred to here as Indigenous peoples) are defined in the Constitution Act, 1982, Section 35 (2) as including the Indian, Inuit and Métis peoples of Canada.",
              id: "YDeXEW",
              description:
                "Definition of Indigenous identity from the StatsCan 'Indigenous identity of person' page.",
            })}
          </p>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(submitHandler)}>
              <AddToProfile />
              <div data-h2-margin="base(x1, 0, x1.5, 0)">
                <Fieldset
                  legend={intl.formatMessage({
                    defaultMessage: "Self-Declaration",
                    id: "dYS0MA",
                    description: "Form label for a self-declaration input",
                  })}
                  name="isIndigenous"
                  hideOptional
                  trackUnsaved={false}
                >
                  <Checkbox
                    id="isIndigenous"
                    name="isIndigenous"
                    label={intl.formatMessage(
                      getEmploymentEquityStatement("indigenous"),
                    )}
                    trackUnsaved={false}
                  />
                </Fieldset>
                <CommunitySelection labels={labels} />
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

export default IndigenousDialog;
