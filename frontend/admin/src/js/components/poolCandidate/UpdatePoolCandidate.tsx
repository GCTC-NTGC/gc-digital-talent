import * as React from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import pick from "lodash/pick";
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
  getLanguageAbility,
  getWorkRegion,
  getPoolCandidateStatus,
  getOperationalRequirement,
} from "@common/constants/localizedConstants";
import { errorMessages, commonMessages } from "@common/messages";
import { User } from "@common/api/generated";
import { useAdminRoutes } from "../../adminRoutes";
import {
  UpdatePoolCandidateAsAdminInput,
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
  | "acceptedOperationalRequirements"
  | "status"
> &
  Pick<
    User,
    "email" | "firstName" | "lastName" | "telephone" | "preferredLang"
  > & {
    userId: User["id"]; // can't use pick since we need a new name
    cmoAssets: string[] | undefined;
    expectedClassifications: string[] | undefined;
  };

interface UpdatePoolCandidateProps {
  classifications: Classification[];
  cmoAssets: CmoAsset[];
  initialPoolCandidate: PoolCandidate;
  handleUpdatePoolCandidate: (
    id: string,
    data: UpdatePoolCandidateAsAdminInput,
  ) => Promise<UpdatePoolCandidateMutation["updatePoolCandidateAsAdmin"]>;
}

export const UpdatePoolCandidateForm: React.FunctionComponent<
  UpdatePoolCandidateProps
> = ({
  classifications,
  cmoAssets,
  initialPoolCandidate,
  handleUpdatePoolCandidate,
}) => {
  const intl = useIntl();
  const paths = useAdminRoutes();
  const locale = getLocale(intl);
  const dataToFormValues = (data: PoolCandidate): FormValues => ({
    ...data,
    acceptedOperationalRequirements: unpackMaybes(
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
  ): UpdatePoolCandidateAsAdminInput => ({
    ...values,
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
        navigate(paths.poolCandidateTable(initialPoolCandidate.pool?.id || ""));
        toast.success(
          intl.formatMessage({
            defaultMessage: "Pool Candidate updated successfully!",
            description:
              "Message displayed to user after pool candidate is updated successfully.",
          }),
        );
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: updating pool candidate failed",
            description:
              "Message displayed to pool candidate after pool candidate fails to get updated.",
          }),
        );
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

  return (
    <section>
      <h2 data-h2-text-align="b(center)" data-h2-margin="b(top, none)">
        {intl.formatMessage({
          defaultMessage: "Update Pool Candidate",
          description: "Title displayed on the update a user form.",
        })}
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
              label={intl.formatMessage({
                defaultMessage: "Email",
                description: "Label displayed on the user form email field.",
              })}
              type="email"
              name="email"
              disabled
              hideOptional
            />
            <Input
              id="firstName"
              label={intl.formatMessage({
                defaultMessage: "First Name",
                description:
                  "Label displayed on the user form first name field.",
              })}
              type="text"
              name="firstName"
              disabled
            />
            <Input
              id="lastName"
              label={intl.formatMessage({
                defaultMessage: "Last Name",
                description:
                  "Label displayed on the user form last name field.",
              })}
              type="text"
              name="lastName"
              disabled
            />
            <Input
              id="telephone"
              label={intl.formatMessage({
                defaultMessage: "Telephone",
                description:
                  "Label displayed on the user form telephone field.",
              })}
              type="tel"
              name="telephone"
              disabled
            />
            <Select
              id="preferredLang"
              label={intl.formatMessage({
                defaultMessage: "Preferred Language",
                description:
                  "Label displayed on the user form preferred language field.",
              })}
              name="preferredLang"
              nullSelection={intl.formatMessage({
                defaultMessage: "Select a language...",
                description:
                  "Placeholder displayed on the user form preferred language field.",
              })}
              disabled
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
              label={intl.formatMessage({
                defaultMessage: "Process Number",
                description:
                  "Label displayed on the pool candidate form process number field.",
              })}
              type="text"
              name="cmoIdentifier"
            />
            <Input
              id="expiryDate"
              label={intl.formatMessage({
                defaultMessage: "Expiry Date",
                description:
                  "Label displayed on the pool candidate form expiry date field.",
              })}
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
              label={intl.formatMessage({
                defaultMessage: "Woman",
                description:
                  "Label displayed on the pool candidate form is woman field.",
              })}
              name="isWoman"
            />
            <Checkbox
              id="hasDisability"
              label={intl.formatMessage({
                defaultMessage: "Has Disability",
                description:
                  "Label displayed on the pool candidate form has disability field.",
              })}
              name="hasDisability"
            />
            <Checkbox
              id="isIndigenous"
              label={intl.formatMessage({
                defaultMessage: "Indigenous",
                description:
                  "Placeholder displayed on the pool candidate form is indigenous field.",
              })}
              name="isIndigenous"
            />
            <Checkbox
              id="isVisibleMinority"
              label={intl.formatMessage({
                defaultMessage: "Visible Minority",
                description:
                  "Label displayed on the pool candidate form is visible minority field.",
              })}
              name="isVisibleMinority"
            />
            <Checkbox
              id="hasDiploma"
              label={intl.formatMessage({
                defaultMessage: "Has Diploma",
                description:
                  "Label displayed on the pool candidate form has diploma field.",
              })}
              name="hasDiploma"
            />
            <Select
              id="languageAbility"
              label={intl.formatMessage({
                defaultMessage: "Language Ability",
                description:
                  "Label displayed on the pool candidate form language ability field.",
              })}
              name="languageAbility"
              options={enumToOptions(LanguageAbility).map(({ value }) => ({
                value,
                label: intl.formatMessage(getLanguageAbility(value)),
              }))}
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
            <MultiSelect
              id="locationPreferences"
              name="locationPreferences"
              label={intl.formatMessage({
                defaultMessage: "Location Preferences",
                description:
                  "Label displayed on the pool candidate form location preferences field.",
              })}
              placeholder={intl.formatMessage({
                defaultMessage: "Select one or more location preferences...",
                description:
                  "Placeholder displayed on the pool candidate form location preferences field.",
              })}
              options={enumToOptions(WorkRegion).map(({ value }) => ({
                value,
                label: intl.formatMessage(getWorkRegion(value)),
              }))}
            />
            <MultiSelect
              id="acceptedOperationalRequirements"
              name="acceptedOperationalRequirements"
              label={intl.formatMessage({
                defaultMessage: "Operational Requirements",
                description:
                  "Label displayed on the pool candidate form operational requirements field.",
              })}
              placeholder={intl.formatMessage({
                defaultMessage:
                  "Select one or more operational requirements...",
                description:
                  "Placeholder displayed on the pool candidate form operational requirements field.",
              })}
              options={enumToOptions(OperationalRequirement).map(
                ({ value }) => ({
                  value,
                  label: intl.formatMessage(getOperationalRequirement(value)),
                }),
              )}
            />
            <MultiSelect
              id="expectedSalary"
              label={intl.formatMessage({
                defaultMessage: "Expected Salary",
                description:
                  "Label displayed on the pool candidate form expected salary field.",
              })}
              name="expectedSalary"
              placeholder={intl.formatMessage({
                defaultMessage: "Select one or more expected salaries...",
                description:
                  "Placeholder displayed on the pool candidate form expected salary field.",
              })}
              options={enumToOptions(SalaryRange).map(({ value }) => ({
                value,
                label: getSalaryRange(value),
              }))}
            />
            <MultiSelect
              id="expectedClassifications"
              label={intl.formatMessage({
                defaultMessage: "Expected Classifications",
                description:
                  "Label displayed on the pool candidate form expected classifications field.",
              })}
              placeholder={intl.formatMessage({
                defaultMessage: "Select one or more classifications...",
                description:
                  "Placeholder displayed on the pool candidate form expected classifications field.",
              })}
              name="expectedClassifications"
              options={classificationOptions}
            />
            <MultiSelect
              id="cmoAssets"
              label={intl.formatMessage({
                defaultMessage: "CMO Assets",
                description:
                  "Label displayed on the pool candidate form cmo assets field.",
              })}
              placeholder={intl.formatMessage({
                defaultMessage: "Select one or more CMO Assets...",
                description:
                  "Placeholder displayed on the pool candidate form cmo assets field.",
              })}
              name="cmoAssets"
              options={cmoAssetOptions}
            />
            <Select
              id="status"
              label={intl.formatMessage({
                defaultMessage: "Status",
                description:
                  "Label displayed on the pool candidate form status field.",
              })}
              nullSelection={intl.formatMessage({
                defaultMessage: "Select a status...",
                description:
                  "Placeholder displayed on the pool candidate form status field.",
              })}
              name="status"
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
              options={enumToOptions(PoolCandidateStatus).map(({ value }) => ({
                value,
                label: intl.formatMessage(getPoolCandidateStatus(value)),
              }))}
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

  const [, executeMutation] = useUpdatePoolCandidateMutation();
  const handleUpdatePoolCandidate = (
    id: string,
    data: UpdatePoolCandidateAsAdminInput,
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
      if (result.data?.updatePoolCandidateAsAdmin) {
        return result.data?.updatePoolCandidateAsAdmin;
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
        handleUpdatePoolCandidate={handleUpdatePoolCandidate}
      />
    </DashboardContentContainer>
  ) : (
    <DashboardContentContainer>
      <p>
        {intl.formatMessage(
          {
            defaultMessage: "Pool Candidate {poolCandidateId} not found.",
            description: "Message displayed for pool candidate not found.",
          },
          {
            poolCandidateId,
          },
        )}
      </p>
    </DashboardContentContainer>
  );
};
