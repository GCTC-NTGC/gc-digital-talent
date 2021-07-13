import * as React from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { isEmpty } from "lodash";
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
  useGetClassificationsQuery,
  useGetCmoAssetsQuery,
  useGetOperationalRequirementsQuery,
  useAllUsersQuery,
  useGetPoolsQuery,
  Maybe,
  PoolCandidate,
} from "../../api/generated";
import errorMessages from "../form/errorMessages";
import Submit from "../form/Submit";
import Select from "../form/Select";
import Input from "../form/Input";
import { enumToOptions, notEmpty } from "../../helpers/util";
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

    const cmoAssetOptions: Option<string>[] = cmoAssets.map(({ id, key }) => ({
      value: id,
      label: key,
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
                { value: "", label: "Select a pool..." },
                ...poolOptions,
              ]}
              rules={{ required: errorMessages.required }}
            />
            <Select
              id="users"
              label="Users: "
              name="users"
              options={[
                { value: "", label: "Select a user..." },
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

export const CreatePoolCandidate: React.FunctionComponent = () => {
  const [classificationsState] = useGetClassificationsQuery();
  const classifications: Classification[] | [] =
    classificationsState.data?.classifications.filter(notEmpty) ?? [];

  const [cmoAssetState] = useGetCmoAssetsQuery();
  const cmoAssets: CmoAsset[] =
    cmoAssetState.data?.cmoAssets.filter(notEmpty) ?? [];

  const [operationalRequirementState] = useGetOperationalRequirementsQuery();
  const operationalRequirements: OperationalRequirement[] =
    operationalRequirementState.data?.operationalRequirements.filter(
      notEmpty,
    ) ?? [];

  const [poolsState] = useGetPoolsQuery();
  const pools: Pool[] = poolsState.data?.pools.filter(notEmpty) ?? [];

  const [usersState] = useAllUsersQuery();
  const users: User[] = usersState.data?.users.filter(notEmpty) ?? [];

  const fetchingData =
    classificationsState.fetching ||
    cmoAssetState.fetching ||
    operationalRequirementState.fetching ||
    poolsState.fetching ||
    usersState.fetching;
  const errors = [
    classificationsState.error,
    cmoAssetState.error,
    operationalRequirementState.error,
    poolsState.error,
    usersState.error,
  ];

  const [_result, executeMutation] = useCreatePoolCandidateMutation();
  const handleCreatePoolCandidate = (data: CreatePoolCandidateInput) =>
    executeMutation({ poolCandidate: data }).then((result) => {
      if (result.data?.createPoolCandidate) {
        return result.data?.createPoolCandidate;
      }
      return Promise.reject(result.error);
    });

  if (fetchingData) return <p>Loading...</p>;
  if (isEmpty(errors))
    return (
      <>{errors.map((error) => error && <p>Oh no... {error.message}</p>)}</>
    );
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
