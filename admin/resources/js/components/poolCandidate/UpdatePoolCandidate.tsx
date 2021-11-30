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
} from "@common/components/form";
import { notEmpty } from "@common/helpers/util";
import {
  currentDate,
  unpackIds,
  unpackMaybes,
  enumToOptions,
} from "@common/helpers/formUtils";
import { navigate } from "@common/helpers/router";
import { getLocale } from "@common/helpers/localize";
import {
  getSalaryRange,
  getLanguage,
} from "@common/constants/localizedConstants";
import { errorMessages, commonMessages } from "@common/messages";
import { User } from "@common/api/generated";
import { poolCandidateTablePath } from "../../adminRoutes";
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
  Language,
} from "../../api/generated";
import poolCandidateMessages from "./messages";
import userMessages from "../user/messages";

import DashboardContentContainer from "../DashboardContentContainer";

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
> &
  Pick<
    User,
    "email" | "firstName" | "lastName" | "telephone" | "preferredLang"
  > & {
    userId: User["id"]; // can't use pick since we need a new name
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

export const UpdatePoolCandidateForm: React.FunctionComponent<
  UpdatePoolCandidateProps
> = ({
  classifications,
  cmoAssets,
  initialPoolCandidate,
  operationalRequirements,
  handleUpdatePoolCandidate,
}) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const dataToFormValues = (data: PoolCandidate): FormValues => ({
    ...data,
    acceptedOperationalRequirements: unpackIds(
      data?.acceptedOperationalRequirements,
    ),
    cmoAssets: unpackIds(data?.cmoAssets),
    expectedClassifications: unpackIds(data?.expectedClassifications),
    expectedSalary: unpackMaybes(data?.expectedSalary),
    locationPreferences: unpackMaybes(data?.locationPreferences),
    userId: data?.user?.id ?? "",
    email: data?.user?.email ?? "",
    firstName: data?.user?.firstName,
    lastName: data?.user?.lastName,
    telephone: data?.user?.telephone,
    preferredLang: data?.user?.preferredLang,
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
    user: {
      update: {
        id: values.userId,
        firstName: values.firstName,
        lastName: values.lastName,
        telephone: values.telephone,
        preferredLang: values.preferredLang,
      },
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
        toast.success(intl.formatMessage(poolCandidateMessages.updateSuccess));
      })
      .catch(() => {
        toast.error(intl.formatMessage(poolCandidateMessages.updateError));
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
      <h2 data-h2-text-align="b(center)" data-h2-margin="b(top, none)">
        {intl.formatMessage(poolCandidateMessages.updateHeading)}
      </h2>
      <div data-h2-container="b(center, s)">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <h4>
              {intl.formatMessage({
                description: "Heading for the user information section",
                defaultMessage: "User Information",
              })}
            </h4>
            <Input
              id="email"
              label={intl.formatMessage(userMessages.emailLabel)}
              type="text"
              name="email"
              disabled
              hideOptional
            />
            <Input
              id="firstName"
              label={intl.formatMessage(userMessages.firstNameLabel)}
              type="text"
              name="firstName"
              rules={{ required: intl.formatMessage(errorMessages.required) }}
            />
            <Input
              id="lastName"
              label={intl.formatMessage(userMessages.lastNameLabel)}
              type="text"
              name="lastName"
              rules={{ required: intl.formatMessage(errorMessages.required) }}
            />
            <Input
              id="telephone"
              label={intl.formatMessage(userMessages.telephoneLabel)}
              type="tel"
              name="telephone"
              rules={{
                required: intl.formatMessage(errorMessages.required),
                pattern: {
                  value: /^\+[1-9]\d{1,14}$/,
                  message: intl.formatMessage(errorMessages.telephone),
                },
              }}
            />
            <Select
              id="preferredLang"
              label={intl.formatMessage(userMessages.preferredLanguageLabel)}
              name="preferredLang"
              nullSelection={intl.formatMessage(
                userMessages.preferredLanguagePlaceholder,
              )}
              rules={{ required: intl.formatMessage(errorMessages.required) }}
              options={enumToOptions(Language).map(({ value }) => ({
                value,
                label: intl.formatMessage(getLanguage(value)),
              }))}
            />
            <h4>
              {intl.formatMessage({
                description: "Heading for the candidate information section",
                defaultMessage: "Candidate Information",
              })}
            </h4>
            <Input
              id="cmoIdentifier"
              label={intl.formatMessage(
                poolCandidateMessages.cmoIdentifierLabel,
              )}
              type="text"
              name="cmoIdentifier"
              rules={{ required: intl.formatMessage(errorMessages.required) }}
            />
            <Input
              id="expiryDate"
              label={intl.formatMessage(poolCandidateMessages.expiryDateLabel)}
              type="date"
              name="expiryDate"
              rules={{
                required: intl.formatMessage(errorMessages.required),
                min: {
                  value: currentDate(),
                  message: intl.formatMessage(errorMessages.futureDate),
                },
              }}
            />
            <Checkbox
              id="isWoman"
              label={intl.formatMessage(poolCandidateMessages.isWomanLabel)}
              name="isWoman"
            />
            <Checkbox
              id="hasDisability"
              label={intl.formatMessage(poolCandidateMessages.hasDiplomaLabel)}
              name="hasDisability"
            />
            <Checkbox
              id="isIndigenous"
              label={intl.formatMessage(
                poolCandidateMessages.isIndigenousLabel,
              )}
              name="isIndigenous"
            />
            <Checkbox
              id="isVisibleMinority"
              label={intl.formatMessage(
                poolCandidateMessages.isVisibleMinorityLabel,
              )}
              name="isVisibleMinority"
            />
            <Select
              id="languageAbility"
              label={intl.formatMessage(
                poolCandidateMessages.languageAbilityLabel,
              )}
              name="languageAbility"
              options={enumToOptions(LanguageAbility)}
              rules={{ required: intl.formatMessage(errorMessages.required) }}
            />
            <MultiSelect
              id="locationPreferences"
              name="locationPreferences"
              label={intl.formatMessage(
                poolCandidateMessages.locationPreferencesLabel,
              )}
              placeholder={intl.formatMessage(
                poolCandidateMessages.locationPreferencesPlaceholder,
              )}
              options={enumToOptions(WorkRegion)}
              rules={{ required: intl.formatMessage(errorMessages.required) }}
            />
            <MultiSelect
              id="acceptedOperationalRequirements.sync"
              name="acceptedOperationalRequirements"
              label={intl.formatMessage(
                poolCandidateMessages.acceptedOperationalRequirementsLabel,
              )}
              placeholder={intl.formatMessage(
                poolCandidateMessages.acceptedOperationalRequirementsPlaceholder,
              )}
              options={operationalRequirementOptions}
              rules={{ required: intl.formatMessage(errorMessages.required) }}
            />
            <MultiSelect
              id="expectedSalary"
              label={intl.formatMessage(
                poolCandidateMessages.expectedSalaryLabel,
              )}
              name="expectedSalary"
              placeholder={intl.formatMessage(
                poolCandidateMessages.expectedSalaryPlaceholder,
              )}
              options={enumToOptions(SalaryRange).map(({ value }) => ({
                value,
                label: getSalaryRange(value),
              }))}
              rules={{ required: intl.formatMessage(errorMessages.required) }}
            />
            <MultiSelect
              id="expectedClassifications"
              label={intl.formatMessage(
                poolCandidateMessages.expectedClassificationsLabel,
              )}
              placeholder={intl.formatMessage(
                poolCandidateMessages.expectedClassificationsPlaceholder,
              )}
              name="expectedClassifications"
              options={classificationOptions}
              rules={{ required: intl.formatMessage(errorMessages.required) }}
            />
            <MultiSelect
              id="cmoAssets"
              label={intl.formatMessage(poolCandidateMessages.cmoAssetsLabel)}
              placeholder={intl.formatMessage(
                poolCandidateMessages.cmoAssetsPlaceholder,
              )}
              name="cmoAssets"
              options={cmoAssetOptions}
              rules={{ required: intl.formatMessage(errorMessages.required) }}
            />
            <Select
              id="status"
              label={intl.formatMessage(poolCandidateMessages.statusLabel)}
              nullSelection={intl.formatMessage(
                poolCandidateMessages.statusPlaceholder,
              )}
              name="status"
              rules={{ required: intl.formatMessage(errorMessages.required) }}
              options={enumToOptions(PoolCandidateStatus)}
            />
            <Submit />
          </form>
        </FormProvider>
      </div>
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

  const [, executeMutation] = useUpdatePoolCandidateMutation();
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
        "user.update.id",
        "user.update.firstName",
        "user.update.lastName",
        "user.update.telephone",
        "user.update.preferredLang",
      ]),
    }).then((result) => {
      if (result.data?.updatePoolCandidate) {
        return result.data?.updatePoolCandidate;
      }
      return Promise.reject(result.error);
    });

  if (fetchingLookupData)
    return (
      <DashboardContentContainer>
        <p>{intl.formatMessage(commonMessages.loadingTitle)}</p>
      </DashboardContentContainer>
    );
  if (lookupDataError)
    return (
      <DashboardContentContainer>
        <p>
          {intl.formatMessage(commonMessages.loadingError)}{" "}
          {lookupDataError.message}
        </p>
      </DashboardContentContainer>
    );

  return lookupData?.poolCandidate ? (
    <DashboardContentContainer>
      <UpdatePoolCandidateForm
        classifications={classifications}
        cmoAssets={cmoAssets}
        initialPoolCandidate={lookupData.poolCandidate}
        operationalRequirements={operationalRequirements}
        handleUpdatePoolCandidate={handleUpdatePoolCandidate}
      />
    </DashboardContentContainer>
  ) : (
    <DashboardContentContainer>
      <p>
        {intl.formatMessage(poolCandidateMessages.notFound, {
          poolCandidateId,
        })}
      </p>
    </DashboardContentContainer>
  );
};
