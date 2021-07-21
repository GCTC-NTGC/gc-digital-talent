import * as React from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import {
  CreatePoolCandidateInput,
  Pool,
  LanguageAbility,
  WorkRegion,
  SalaryRange,
  PoolCandidateStatus,
  User,
  OperationalRequirement,
  CmoAsset,
  Classification,
  useCreatePoolCandidateMutation,
  CreatePoolCandidateMutation,
  PoolCandidate,
  useGetCreatePoolCandidateDataQuery,
} from "../../api/generated";
import errorMessages from "../form/errorMessages";
import Submit from "../form/Submit";
import Select from "../form/Select";
import Input from "../form/Input";
import MultiSelect from "../form/MultiSelect";
import { notEmpty } from "../../helpers/util";
import { currentDate, enumToOptions } from "../form/formUtils";
import { getSalaryRange } from "../../model/localizedConstants";
import Checkbox from "../form/Checkbox";

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
  | "status"
> & {
  acceptedOperationalRequirements: string[] | undefined;
  cmoAssets: string[] | undefined;
  expectedClassifications: string[] | undefined;
  pool: string;
  user: string;
};
interface CreatePoolCandidateFormProps {
  classifications: Classification[];
  cmoAssets: CmoAsset[];
  locale: "en" | "fr";
  operationalRequirements: OperationalRequirement[];
  pools: Pool[];
  users: User[];
  handleCreatePoolCandidate: (
    data: CreatePoolCandidateInput,
  ) => Promise<CreatePoolCandidateMutation["createPoolCandidate"]>;
}

export const CreatePoolCandidateForm: React.FunctionComponent<CreatePoolCandidateFormProps> =
  ({
    classifications,
    cmoAssets,
    locale,
    operationalRequirements,
    pools,
    users,
    handleCreatePoolCandidate,
  }) => {
    const methods = useForm<FormValues>();
    const { handleSubmit } = methods;

    const formValuesToSubmitData = (
      values: FormValues,
    ): CreatePoolCandidateInput => ({
      ...values,
      acceptedOperationalRequirements: {
        sync: values.acceptedOperationalRequirements,
      },
      cmoAssets: {
        sync: values.cmoAssets,
      },
      expectedClassifications: {
        sync: values.expectedClassifications,
      },
      pool: { connect: values.pool },
      user: { connect: values.user },
    });

    const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
      await handleCreatePoolCandidate(formValuesToSubmitData(data))
        .then(() => {
          // TODO: Navigate to pool candidate dashboard.
        })
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
        label: `${group}-0${level}`,
      }),
    );

    const operationalRequirementOptions: Option<string>[] =
      operationalRequirements.map(({ id, name }) => ({
        value: id,
        label: name[locale] || "Error: operational requirement name not found.",
      }));

    const poolOptions: Option<string>[] = pools.map(({ id, name }) => ({
      value: id,
      label: name?.[locale] || "Error: pool name not found",
    }));

    const userOptions: Option<string>[] = users.map(
      ({ id, firstName, lastName }) => ({
        value: id,
        label: `${firstName} ${lastName}`,
      }),
    );

    return (
      <section>
        <h2>Create Pool Candidate</h2>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Select
              id="pool"
              label="Pool: "
              name="pool"
              options={[
                { value: "", label: "Select a pool...", disabled: true },
                ...poolOptions,
              ]}
              rules={{ required: errorMessages.required }}
            />
            <Select
              id="user"
              label="Users: "
              name="user"
              options={[
                { value: "", label: "Select a user...", disabled: true },
                ...userOptions,
              ]}
              rules={{ required: errorMessages.required }}
            />
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
                  value: currentDate(),
                  message: errorMessages.futureDate,
                },
              }}
            />
            <Checkbox id="isWoman" label="Woman: " name="isWoman" />
            <Checkbox
              id="hasDisability"
              label="Has Disability: "
              name="hasDisability"
            />
            <Checkbox
              id="isIndigenous"
              label="Indigenous: "
              name="isIndigenous"
            />
            <Checkbox
              id="isVisibleMinority"
              label="Visible Minority: "
              name="isVisibleMinority"
            />
            <Checkbox id="hasDiploma" label="Has Diploma: " name="hasDiploma" />
            <Select
              id="languageAbility"
              label="Language Ability: "
              name="languageAbility"
              options={[
                {
                  value: "",
                  label: "Select a language ability...",
                  disabled: true,
                },
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
              options={enumToOptions(SalaryRange).map(({ value }) => ({
                value,
                label: getSalaryRange(value),
              }))}
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
                { value: "", label: "Select a status...", disabled: true },
                ...enumToOptions(PoolCandidateStatus),
              ]}
            />
            <Submit />
          </form>
        </FormProvider>
      </section>
    );
  };

export const CreatePoolCandidate: React.FunctionComponent = () => {
  const [lookupResult] = useGetCreatePoolCandidateDataQuery();
  const { data: lookupData, fetching, error } = lookupResult;
  const classifications: Classification[] | [] =
    lookupData?.classifications.filter(notEmpty) ?? [];
  const cmoAssets: CmoAsset[] = lookupData?.cmoAssets.filter(notEmpty) ?? [];
  const operationalRequirements: OperationalRequirement[] =
    lookupData?.operationalRequirements.filter(notEmpty) ?? [];
  const pools: Pool[] = lookupData?.pools.filter(notEmpty) ?? [];
  const users: User[] = lookupData?.users.filter(notEmpty) ?? [];

  const [_result, executeMutation] = useCreatePoolCandidateMutation();
  const handleCreatePoolCandidate = (data: CreatePoolCandidateInput) =>
    executeMutation({ poolCandidate: data }).then((result) => {
      if (result.data?.createPoolCandidate) {
        return result.data?.createPoolCandidate;
      }
      return Promise.reject(result.error);
    });

  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Oh no... {error.message}</p>;

  return (
    <CreatePoolCandidateForm
      classifications={classifications}
      cmoAssets={cmoAssets}
      locale="en"
      operationalRequirements={operationalRequirements}
      pools={pools}
      users={users}
      handleCreatePoolCandidate={handleCreatePoolCandidate}
    />
  );
};
