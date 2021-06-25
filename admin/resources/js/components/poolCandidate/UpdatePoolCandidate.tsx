import * as React from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import {
  UpdatePoolCandidateInput,
  LanguageAbility,
  WorkRegion,
  SalaryRange,
  PoolCandidateStatus,
  OperationalRequirement,
  CmoAsset,
  Classification,
  PoolCandidate,
  useUpdatePoolCandidateMutation,
  UpdatePoolCandidateMutation,
} from "../../api/generated";
import errorMessages from "../form/errorMessages";
import Submit from "../form/Submit";
import Select from "../form/Select";
import Input from "../form/Input";
import { enumToOptions, getValues } from "../../helpers/util";
import MultiSelect from "../form/MultiSelect";

type Option<V> = { value: V; label: string };
interface FormValues {
  acceptedOperationalRequirements: Option<string>[];
  cmoAssets: Option<string>[];
  cmoIdentifier: string | null;
  expectedClassifications: Option<string>[];
  expectedSalary: Option<SalaryRange>[];
  expiryDate: string | null;
  hasDiploma: boolean | null;
  hasDisability: boolean | null;
  isIndigenous: boolean | null;
  isVisibleMinority: boolean | null;
  isWoman: boolean | null;
  languageAbility: LanguageAbility | null;
  locationPreferences: Option<WorkRegion>[];
  status: PoolCandidateStatus | null;
}

interface UpdatePoolCandidateProps {
  classifications: Classification[];
  cmoAssets: CmoAsset[];
  initialPoolCandidate: PoolCandidate;
  locale: "en" | "fr";
  operationalRequirements: OperationalRequirement[];
  handleUpdatePoolCandidate: (
    id: string,
    data: UpdatePoolCandidateInput,
  ) => Promise<UpdatePoolCandidateMutation["updatePoolCandidate"]>;
}

export const UpdatePoolCandidateForm: React.FunctionComponent<UpdatePoolCandidateProps> =
  ({
    classifications,
    cmoAssets,
    initialPoolCandidate,
    locale,
    operationalRequirements,
    handleUpdatePoolCandidate,
  }) => {
    const dataToFormValues = (
      data: PoolCandidate | UpdatePoolCandidateMutation["updatePoolCandidate"],
    ): FormValues => ({
      // TODO: Convert rest of data to form values format (specifically the multi select).
      acceptedOperationalRequirements: [],
      cmoAssets: [],
      cmoIdentifier: data?.cmoIdentifier || null,
      expiryDate: data?.expiryDate || null,
      expectedClassifications: [],
      expectedSalary: [],
      hasDiploma: data?.hasDiploma || null,
      hasDisability: data?.hasDisability || null,
      isIndigenous: data?.isIndigenous || null,
      isWoman: data?.isWoman || null,
      isVisibleMinority: data?.isVisibleMinority || null,
      languageAbility: data?.languageAbility || null,
      locationPreferences: [],
      status: data?.status || null,
    });

    const formValuesToData = (
      values: FormValues,
    ): UpdatePoolCandidateInput => ({
      cmoIdentifier: values.cmoIdentifier,
      expiryDate: values.expiryDate,
      isWoman: values.isWoman,
      hasDisability: values.hasDisability,
      isIndigenous: values.isIndigenous,
      isVisibleMinority: values.isVisibleMinority,
      hasDiploma: values.hasDiploma,
      languageAbility: values.languageAbility,
      locationPreferences: getValues(values.locationPreferences),
      acceptedOperationalRequirements: {
        sync: getValues(values.acceptedOperationalRequirements),
      },
      expectedSalary: getValues(values.expectedSalary),
      expectedClassifications: {
        sync: getValues(values.expectedClassifications),
      },
      cmoAssets: {
        sync: getValues(values.cmoAssets),
      },
      status: values.status,
    });

    const methods = useForm<FormValues>({
      defaultValues: initialPoolCandidate
        ? dataToFormValues(initialPoolCandidate)
        : {},
    });
    const { handleSubmit, reset } = methods;

    const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
      await handleUpdatePoolCandidate(
        initialPoolCandidate.id,
        formValuesToData(data),
      )
        .then((resolved) => reset(dataToFormValues(resolved))) // Reset form with returned data. This resets isDirty flag.
        .catch(() => {
          // Something went wrong with handleCreatePoolCandidate.
          // Do nothing.
        });
    };

    const cmoAssetOptions: Option<string>[] = cmoAssets.map(({ id, key }) => ({
      value: id,
      label: key,
    }));

    const classificationOptions: Option<string>[] = classifications.map(
      ({ id, group, level }) => ({
        value: id,
        label: `${group}-${level}`,
      }),
    );

    const operationalRequirementOptions: Option<string>[] =
      operationalRequirements.map(({ id, name }) => ({
        value: id,
        label: name[locale] || "Error: operational requirement name not found.",
      }));

    return (
      <section>
        <h2>Edit Pool Candidate</h2>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              id="cmoIdentifier"
              label="Cmo Identifier: "
              type="text"
              name="cmoIdentifier"
              rules={{ required: errorMessages.required }}
            />
            <Input
              id="expiryDate"
              label="Expiry Date: "
              type="date"
              name="expiryDate"
              rules={{
                required: errorMessages.required,
                min: {
                  value: new Date().toISOString().slice(0, 10),
                  message: errorMessages.futureDate,
                },
              }}
            />
            <Input
              id="isWoman"
              label="Woman: "
              type="checkbox"
              name="isWoman"
            />
            <Input
              id="hasDisability"
              label="Has Disability: "
              type="checkbox"
              name="hasDisability"
            />
            <Input
              id="isIndigenous"
              label="Indigenous: "
              type="checkbox"
              name="isIndigenous"
            />
            <Input
              id="isVisibleMinority"
              label="Visible Minority: "
              type="checkbox"
              name="isVisibleMinority"
            />
            <Input
              id="hasDiploma"
              label="Has Diploma: "
              type="checkbox"
              name="hasDiploma"
            />
            <Select
              id="languageAbility"
              label="Language Ability: "
              name="languageAbility"
              options={[
                { value: "", label: "Select a language ability..." },
                ...enumToOptions(LanguageAbility),
              ]}
              rules={{ required: errorMessages.required }}
            />
            <MultiSelect
              id="locationPreferences"
              name="locationPreferences"
              label="Location Preferences: "
              placeholder="Select one or more location preferences..."
              options={enumToOptions(WorkRegion)}
              rules={{ required: errorMessages.required }}
            />
            <MultiSelect
              id="acceptedOperationalRequirements"
              name="acceptedOperationalRequirements"
              label="Operational Requirements: "
              placeholder="Select one or more operational requirements..."
              options={operationalRequirementOptions}
              rules={{ required: errorMessages.required }}
            />
            <MultiSelect
              id="expectedSalary"
              label="Expected Salary: "
              name="expectedSalary"
              placeholder="Select one or more expected salaries..."
              options={enumToOptions(SalaryRange)}
              rules={{ required: errorMessages.required }}
            />
            <MultiSelect
              id="expectedClassifications"
              label="Expected Classifications: "
              placeholder="Select one or more classifications..."
              name="expectedClassifications"
              options={classificationOptions}
              rules={{ required: errorMessages.required }}
            />
            <MultiSelect
              id="cmoAssets"
              label="Cmo Assets: "
              name="cmoAssets"
              options={cmoAssetOptions}
              rules={{ required: errorMessages.required }}
            />
            <Select
              id="status"
              label="Status: "
              name="status"
              rules={{ required: errorMessages.required }}
              options={[
                { value: "", label: "Select a status..." },
                ...enumToOptions(PoolCandidateStatus),
              ]}
            />
            <Submit />
          </form>
        </FormProvider>
      </section>
    );
  };

export const UpdatePoolCandidate: React.FunctionComponent<{
  initialPoolCandidate: PoolCandidate;
}> = ({ initialPoolCandidate }) => {
  const [_result, executeMutation] = useUpdatePoolCandidateMutation();
  const handleUpdatePoolCandidate = (
    id: string,
    data: UpdatePoolCandidateInput,
  ) =>
    executeMutation({ id, poolCandidate: data }).then((result) => {
      if (result.data?.updatePoolCandidate) {
        return result.data?.updatePoolCandidate;
      }
      return Promise.reject(result.error);
    });

  return (
    <UpdatePoolCandidateForm
      classifications={[]}
      cmoAssets={[]}
      initialPoolCandidate={initialPoolCandidate}
      locale="en"
      operationalRequirements={[]}
      handleUpdatePoolCandidate={handleUpdatePoolCandidate}
    />
  );
};
