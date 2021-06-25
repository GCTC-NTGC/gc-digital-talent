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
  Scalars,
  LocalizedString,
  Maybe,
} from "../../api/generated";
import errorMessages from "../form/errorMessages";
import Submit from "../form/Submit";
import Select from "../form/Select";
import Input from "../form/Input";
import { enumToOptions, getId, notEmpty } from "../../helpers/util";
import MultiSelect from "../form/MultiSelect";

type Option<V> = { value: V; label: string };

type FormValues = Pick<
  PoolCandidate,
  | "cmoIdentifier"
  | "expiryDate"
  | "hasDiploma"
  | "hasDisability"
  | "isIndigenous"
  | "isVisibleMinority"
  | "isWoman"
  | "languageAbility"
  | "expectedSalary"
  | "locationPreferences"
> & {
  acceptedOperationalRequirements: string[] | undefined;
  cmoAssets: string[] | undefined;
  expectedClassifications: string[] | undefined;
};

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
    function unpackMaybes<T>(data: Maybe<Array<Maybe<T>>> | undefined): T[] {
      return data?.filter(notEmpty) ?? [];
    }
    const unpackIds = (data: Maybe<Array<Maybe<{ id: string }>>> | undefined) =>
      unpackMaybes<{ id: string }>(data).map(getId);

    const dataToFormValuesalues = (
      data: PoolCandidate | UpdatePoolCandidateMutation["updatePoolCandidate"],
    ): FormValues => ({
      // TODO: Convert rest of data to form values format (specifically the multi select).
      ...data,
      acceptedOperationalRequirements: unpackIds(
        data?.acceptedOperationalRequirements,
      ),
      cmoAssets: unpackIds(data?.cmoAssets),
      expectedClassifications: unpackIds(data?.expectedClassifications),
      expectedSalary: unpackMaybes(data?.expectedSalary),
      locationPreferences: unpackMaybes(data?.locationPreferences),
    });

    const formValuesToSubmitData = (
      values: FormValues,
    ): UpdatePoolCandidateInput => ({
      ...values,
      acceptedOperationalRequirements: {
        sync: values.acceptedOperationalRequirements,
      },
      expectedClassifications: {
        sync: values.expectedClassifications,
      },
      cmoAssets: {
        sync: values.cmoAssets,
      },
    });

    const methods = useForm<FormValues>({
      defaultValues: initialPoolCandidate
        ? dataToFormValuesalues(initialPoolCandidate)
        : {},
    });
    const { handleSubmit, reset } = methods;

    const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
      await handleUpdatePoolCandidate(
        initialPoolCandidate.id,
        formValuesToSubmitData(data),
      )
        .then((resolved) => reset(dataToFormValuesalues(resolved))) // Reset form with returned data. This resets isDirty flag.
        .catch(() => {
          // Something went wrong with handleCreatePoolCandidate.
          // Do nothing.
        });
    };

    const cmoAssetOptions: Option<string>[] = cmoAssets.map(({ id, name }) => ({
      value: id,
      label: name[locale] ?? "Error: name not loaded",
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
