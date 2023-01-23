import React from "react";
import { useIntl } from "react-intl";
import {
  FormProvider,
  useForm,
  useFormContext,
  type SubmitHandler,
} from "react-hook-form";

import Dialog from "@common/components/Dialog";
import { Checkbox } from "@common/components/form";

import {
  getEmploymentEquityGroup,
  getEmploymentEquityStatement,
} from "@common/constants";
import { getSelfDeclarationLabels } from "~/components/SelfDeclaration/utils";
import { CommunityList } from "~/components/SelfDeclaration/CommunitySelection";
import { Fieldset } from "~/../../../frontend/common/src/components/inputPartials";
import { FieldLabels } from "~/../../../frontend/common/src/components/form/BasicForm";
import { IndigenousCommunity } from "~/api/generated";

import AddToProfile from "./AddToProfile";
import Definition from "./Definition";
import DialogFooter from "./DialogFooter";
import UnderReview from "./UnderReview";
import { IndigenousDialogProps } from "../types";

interface CommunitySelectionProps {
  labels: FieldLabels;
}

// constrained list of community form values to avoid typos
type FormCommunity = "firstNations" | "inuk" | "metis" | "other";

// small wrapper to send value of confirmation checkbox to CommunityList conditional
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
  communities: Array<IndigenousCommunity>,
): FormValues {
  const isIndigenous = communities.length > 0;

  const firstNationsCommunity: FormCommunity[] =
    communities.includes(IndigenousCommunity.StatusFirstNations) ||
    communities.includes(IndigenousCommunity.NonStatusFirstNations)
      ? ["firstNations"]
      : [];

  let isStatusFirstNations: FormValues["isStatusFirstNations"];
  if (communities.includes(IndigenousCommunity.StatusFirstNations))
    isStatusFirstNations = "yes";
  else if (communities.includes(IndigenousCommunity.NonStatusFirstNations))
    isStatusFirstNations = "no";
  else isStatusFirstNations = null;

  const inukCommunity: FormCommunity[] = communities.includes(
    IndigenousCommunity.Inuit,
  )
    ? ["inuk"]
    : [];
  const metisCommunity: FormCommunity[] = communities.includes(
    IndigenousCommunity.Metis,
  )
    ? ["metis"]
    : [];
  const otherCommunity: FormCommunity[] = communities.includes(
    IndigenousCommunity.Other,
  )
    ? ["other"]
    : [];

  // assemble object from pre-computed values
  return {
    isIndigenous,
    communities: [
      ...firstNationsCommunity,
      ...inukCommunity,
      ...metisCommunity,
      ...otherCommunity,
    ],
    isStatusFirstNations,
  };
}

function formValuesToApiValues(
  formValues: FormValues,
): Array<IndigenousCommunity> {
  if (!formValues.isIndigenous) return [];

  const apiValues = [
    ...(formValues.communities.includes("firstNations") &&
    formValues.isStatusFirstNations === "yes"
      ? [IndigenousCommunity.StatusFirstNations]
      : []),

    ...(formValues.communities.includes("firstNations") &&
    formValues.isStatusFirstNations === "no"
      ? [IndigenousCommunity.NonStatusFirstNations]
      : []),

    ...(formValues.communities.includes("inuk")
      ? [IndigenousCommunity.Inuit]
      : []),

    ...(formValues.communities.includes("metis")
      ? [IndigenousCommunity.Metis]
      : []),

    ...(formValues.communities.includes("other")
      ? [IndigenousCommunity.Other]
      : []),
  ];
  return apiValues;
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
        <Dialog.Header color="ts-secondary">
          {intl.formatMessage(getEmploymentEquityGroup("indigenous"))}
        </Dialog.Header>
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
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default IndigenousDialog;
