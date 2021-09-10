import * as React from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { pick } from "lodash";
import { toast } from "react-toastify";
import { useIntl } from "react-intl";
import {
  Submit,
  Select,
  Input,
  MultiSelect,
  Checkbox,
} from "gc-digital-talent-common/components";
import {
  notEmpty,
  currentDate,
  enumToOptions,
  navigate,
  getLocale,
  unpackIds,
  unpackMaybes,
  poolCandidateTablePath,
} from "gc-digital-talent-common/helpers";
import { getSalaryRange } from "gc-digital-talent-common/constants";
import {
  errorMessages,
  commonMessages,
} from "gc-digital-talent-common/messages";
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
  useGetUpdatePoolCandidateDataQuery,
} from "../../api/generated";
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
};

interface UpdatePoolCandidateProps {
  classifications: Classification[];
  cmoAssets: CmoAsset[];
  initialPoolCandidate: PoolCandidate;
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
    operationalRequirements,
    handleUpdatePoolCandidate,
  }) => {
    const intl = useIntl();
    const locale = getLocale(intl);
    const dataToFormValues = (
      data: PoolCandidate | UpdatePoolCandidateMutation["updatePoolCandidate"],
    ): FormValues => ({
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
      defaultValues: dataToFormValues(initialPoolCandidate),
    });
    const { handleSubmit } = methods;

    const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
      await handleUpdatePoolCandidate(
        initialPoolCandidate.id,
        formValuesToSubmitData(data),
      )
        .then(() => {
          navigate(poolCandidateTablePath(initialPoolCandidate.pool?.id || ""));
          toast.success(intl.formatMessage(messages.updateSuccess));
        })
        .catch(() => {
          toast.error(intl.formatMessage(messages.updateError));
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

    return (
      <section>
        <h2>{intl.formatMessage(messages.updateHeading)}</h2>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
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
              label={intl.formatMessage(messages.hasDiplomaLabel)}
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
            <Select
              id="languageAbility"
              label={intl.formatMessage(messages.languageAbilityLabel)}
              name="languageAbility"
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
              id="acceptedOperationalRequirements.sync"
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
              label={intl.formatMessage(messages.expectedSalaryLabel)}
              name="expectedSalary"
              placeholder={intl.formatMessage(
                messages.expectedSalaryPlaceholder,
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

export const UpdatePoolCandidate: React.FunctionComponent<{
  poolCandidateId: string;
}> = ({ poolCandidateId }) => {
  const intl = useIntl();
  const [lookupResult] = useGetUpdatePoolCandidateDataQuery({
    variables: { id: poolCandidateId },
  });
  const {
    data: lookupData,
    fetching: fetchingLookupData,
    error: lookupDataError,
  } = lookupResult;
  const classifications: Classification[] | [] =
    lookupData?.classifications.filter(notEmpty) ?? [];
  const cmoAssets: CmoAsset[] = lookupData?.cmoAssets.filter(notEmpty) ?? [];
  const operationalRequirements: OperationalRequirement[] =
    lookupData?.operationalRequirements.filter(notEmpty) ?? [];

  const [_result, executeMutation] = useUpdatePoolCandidateMutation();
  const handleUpdatePoolCandidate = (
    id: string,
    data: UpdatePoolCandidateInput,
  ) =>
    /* We must pick only the fields belonging to UpdateUserInput, because its possible
      the data object contains other props at runtime, and this will cause the
      graphql operation to fail. */
    executeMutation({
      id,
      poolCandidate: pick(data, [
        "cmoIdentifier",
        "expiryDate",
        "isWoman",
        "hasDisability",
        "isIndigenous",
        "isVisibleMinority",
        "hasDiploma",
        "languageAbility",
        "locationPreferences",
        "acceptedOperationalRequirements",
        "expectedSalary",
        "expectedClassifications",
        "cmoAssets",
        "status",
      ]),
    }).then((result) => {
      if (result.data?.updatePoolCandidate) {
        return result.data?.updatePoolCandidate;
      }
      return Promise.reject(result.error);
    });

  if (fetchingLookupData)
    return <p>{intl.formatMessage(commonMessages.loadingTitle)}</p>;
  if (lookupDataError)
    return (
      <p>
        {intl.formatMessage(commonMessages.loadingError)}{" "}
        {lookupDataError.message}
      </p>
    );
  return lookupData?.poolCandidate ? (
    <UpdatePoolCandidateForm
      classifications={classifications}
      cmoAssets={cmoAssets}
      initialPoolCandidate={lookupData.poolCandidate}
      operationalRequirements={operationalRequirements}
      handleUpdatePoolCandidate={handleUpdatePoolCandidate}
    />
  ) : (
    <p>{intl.formatMessage(messages.notFound, { poolCandidateId })}</p>
  );
};
