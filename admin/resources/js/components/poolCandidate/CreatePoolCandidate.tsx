import * as React from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useIntl } from "react-intl";
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
import { navigate } from "../../helpers/router";
import { poolTable } from "../../helpers/routes";
import { getLocale } from "../../helpers/localize";
import messages from "./messages";

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
  operationalRequirements: OperationalRequirement[];
  pools: Pool[];
  poolId?: string;
  users: User[];
  handleCreatePoolCandidate: (
    data: CreatePoolCandidateInput,
  ) => Promise<CreatePoolCandidateMutation["createPoolCandidate"]>;
}

export const CreatePoolCandidateForm: React.FunctionComponent<CreatePoolCandidateFormProps> =
  ({
    classifications,
    cmoAssets,
    operationalRequirements,
    pools,
    poolId,
    users,
    handleCreatePoolCandidate,
  }) => {
    const intl = useIntl();
    const locale = getLocale(intl);
    const methods = useForm<FormValues>({ defaultValues: { pool: poolId } });
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
          navigate(poolTable(locale));
          toast.success(intl.formatMessage(messages.createSuccess));
        })
        .catch(() => {
          toast.error(intl.formatMessage(messages.createError));
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

    const poolOptions: Option<string>[] = pools?.map(({ id, name }) => ({
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
        <h2>{intl.formatMessage(messages.createHeading)}</h2>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Select
              id="pool"
              label={intl.formatMessage(messages.poolLabel)}
              nullSelection={intl.formatMessage(messages.poolPlaceholder)}
              name="pool"
              options={poolOptions}
              disabled={!!poolId}
              rules={{ required: errorMessages.required }}
            />
            <Select
              id="user"
              label={intl.formatMessage(messages.userLabel)}
              nullSelection={intl.formatMessage(messages.userPlaceholder)}
              name="user"
              options={userOptions}
              rules={{ required: errorMessages.required }}
            />
            <Input
              id="cmoIdentifier"
              label={intl.formatMessage(messages.cmoIdentifierLabel)}
              type="text"
              name="cmoIdentifier"
              rules={{ required: errorMessages.required }}
            />
            <Input
              id="expiryDate"
              label={intl.formatMessage(messages.expiryDateLabel)}
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
            <Checkbox
              id="isWoman"
              label={intl.formatMessage(messages.isWomanLabel)}
              name="isWoman"
            />
            <Checkbox
              id="hasDisability"
              label={intl.formatMessage(messages.hasDisabilityLabel)}
              name="hasDisability"
            />
            <Checkbox
              id="isIndigenous"
              label={intl.formatMessage(messages.isIndigenousLabel)}
              name="isIndigenous"
            />
            <Checkbox
              id="isVisibleMinority"
              label={intl.formatMessage(messages.isVisibleMinorityLabel)}
              name="isVisibleMinority"
            />
            <Checkbox
              id="hasDiploma"
              label={intl.formatMessage(messages.hasDiplomaLabel)}
              name="hasDiploma"
            />
            <Select
              id="languageAbility"
              label={intl.formatMessage(messages.languageAbilityLabel)}
              name="languageAbility"
              nullSelection={intl.formatMessage(
                messages.languageAbilityPlaceholder,
              )}
              options={enumToOptions(LanguageAbility)}
              rules={{ required: errorMessages.required }}
            />
            <MultiSelect
              id="locationPreferences"
              name="locationPreferences"
              label={intl.formatMessage(messages.locationPreferencesLabel)}
              placeholder={intl.formatMessage(
                messages.locationPreferencesPlaceholder,
              )}
              options={enumToOptions(WorkRegion)}
              rules={{ required: errorMessages.required }}
            />
            <MultiSelect
              id="acceptedOperationalRequirements"
              name="acceptedOperationalRequirements"
              label={intl.formatMessage(
                messages.acceptedOperationalRequirementsLabel,
              )}
              placeholder={intl.formatMessage(
                messages.acceptedOperationalRequirementsPlaceholder,
              )}
              options={operationalRequirementOptions}
              rules={{ required: errorMessages.required }}
            />
            <MultiSelect
              id="expectedSalary"
              label={intl.formatMessage(messages.expectedClassificationsLabel)}
              name="expectedSalary"
              placeholder={intl.formatMessage(
                messages.expectedClassificationsPlaceholder,
              )}
              options={enumToOptions(SalaryRange).map(({ value }) => ({
                value,
                label: getSalaryRange(value),
              }))}
              rules={{ required: errorMessages.required }}
            />
            <MultiSelect
              id="expectedClassifications"
              label={intl.formatMessage(messages.expectedClassificationsLabel)}
              placeholder={intl.formatMessage(
                messages.expectedClassificationsPlaceholder,
              )}
              name="expectedClassifications"
              options={classificationOptions}
              rules={{ required: errorMessages.required }}
            />
            <MultiSelect
              id="cmoAssets"
              label={intl.formatMessage(messages.cmoAssetsLabel)}
              placeholder={intl.formatMessage(messages.cmoAssetsPlaceholder)}
              name="cmoAssets"
              options={cmoAssetOptions}
              rules={{ required: errorMessages.required }}
            />
            <Select
              id="status"
              label={intl.formatMessage(messages.statusLabel)}
              nullSelection={intl.formatMessage(messages.statusPlaceholder)}
              name="status"
              rules={{ required: errorMessages.required }}
              options={enumToOptions(PoolCandidateStatus)}
            />
            <Submit />
          </form>
        </FormProvider>
      </section>
    );
  };

export const CreatePoolCandidate: React.FunctionComponent<{ poolId: string }> =
  ({ poolId }) => {
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
        operationalRequirements={operationalRequirements}
        pools={pools}
        poolId={poolId}
        users={users}
        handleCreatePoolCandidate={handleCreatePoolCandidate}
      />
    );
  };
