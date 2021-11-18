import * as React from "react";
import {
  Control,
  FormProvider,
  SubmitHandler,
  useForm,
  useWatch,
} from "react-hook-form";
import { toast } from "react-toastify";
import { useIntl } from "react-intl";
import {
  Submit,
  Select,
  Input,
  MultiSelect,
  Checkbox,
  RadioGroup,
} from "@common/components/form";
import { notEmpty } from "@common/helpers/util";
import { currentDate, enumToOptions } from "@common/helpers/formUtils";
import { navigate } from "@common/helpers/router";
import { getLocale } from "@common/helpers/localize";
import {
  getSalaryRange,
  getLanguage,
} from "@common/constants/localizedConstants";
import { errorMessages, commonMessages } from "@common/messages";
import { poolCandidateTablePath } from "../../adminRoutes";
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
    "email" | "firstName" | "lastName" | "preferredLang" | "telephone"
  > & {
    acceptedOperationalRequirements: string[] | undefined;
    cmoAssets: string[] | undefined;
    expectedClassifications: string[] | undefined;
    pool: string;
    user: string;
    userMode: UserModeValue;
  };

type UserModeValue = "existing" | "new";

const UserFormSection: React.FunctionComponent<{
  control: Control<FormValues>;
  userOptions: Option<string>[];
}> = ({ control, userOptions }) => {
  const userMode = useWatch({
    control,
    name: "userMode",
  });
  const intl = useIntl();
  return (
    <>
      <div
        data-h2-visibility={userMode === "existing" ? undefined : "b(hidden)"}
      >
        <Select
          id="user"
          label={intl.formatMessage(poolCandidateMessages.userLabel)}
          nullSelection={intl.formatMessage(
            poolCandidateMessages.userPlaceholder,
          )}
          name="user"
          options={userOptions}
          rules={{
            required:
              userMode === "existing" ? errorMessages.required : undefined,
          }}
        />
      </div>
      <div data-h2-visibility={userMode === "new" ? null : "b(hidden)"}>
        <Input
          id="email"
          label={intl.formatMessage(userMessages.emailLabel)}
          type="text"
          name="email"
          rules={{
            required: userMode === "new" ? errorMessages.required : undefined,
          }}
        />
        <Input
          id="firstName"
          label={intl.formatMessage(userMessages.firstNameLabel)}
          type="text"
          name="firstName"
          rules={{
            required: userMode === "new" ? errorMessages.required : undefined,
          }}
        />
        <Input
          id="lastName"
          label={intl.formatMessage(userMessages.lastNameLabel)}
          type="text"
          name="lastName"
          rules={{
            required: userMode === "new" ? errorMessages.required : undefined,
          }}
        />
        <Input
          id="telephone"
          label={intl.formatMessage(userMessages.telephoneLabel)}
          type="tel"
          name="telephone"
          rules={{
            required: userMode === "new" ? errorMessages.required : undefined,
            pattern: {
              value: /^\+[1-9]\d{1,14}$/,
              message: errorMessages.telephone,
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
          rules={{
            required: userMode === "new" ? errorMessages.required : undefined,
          }}
          options={enumToOptions(Language).map(({ value }) => ({
            value,
            label: intl.formatMessage(getLanguage(value)),
          }))}
        />
      </div>
    </>
  );
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
    const { control, handleSubmit } = methods;

    const formValuesToSubmitData = (
      values: FormValues,
    ): CreatePoolCandidateInput => {
      // the user part of the submit data could be a mutation to connect an existing user or to create a new user
      let userObject;
      switch (values.userMode) {
        case "existing":
          userObject = { connect: values.user };
          break;
        case "new":
          userObject = {
            create: {
              email: values.email,
              firstName: values.firstName ?? "",
              lastName: values.lastName ?? "",
              preferredLang: values.preferredLang,
              telephone: values.telephone,
            },
          };
          break;
        default:
          userObject = {};
      }

      return {
        acceptedOperationalRequirements: {
          sync: values.acceptedOperationalRequirements,
        },
        cmoAssets: {
          sync: values.cmoAssets,
        },
        cmoIdentifier: values.cmoIdentifier,
        expectedClassifications: {
          sync: values.expectedClassifications,
        },
        expectedSalary: values.expectedSalary,
        expiryDate: values.expiryDate,
        hasDiploma: values.hasDiploma,
        hasDisability: values.hasDisability,
        isIndigenous: values.isIndigenous,
        isVisibleMinority: values.isVisibleMinority,
        isWoman: values.isWoman,
        languageAbility: values.languageAbility,
        locationPreferences: values.locationPreferences,
        pool: { connect: values.pool },
        user: userObject, // connect or create mutation
      };
    };

    const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
      await handleCreatePoolCandidate(formValuesToSubmitData(data))
        .then(() => {
          navigate(poolCandidateTablePath(poolId || data.pool));
          toast.success(
            intl.formatMessage(poolCandidateMessages.createSuccess),
          );
        })
        .catch(() => {
          toast.error(intl.formatMessage(poolCandidateMessages.createError));
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
        <h2 data-h2-text-align="b(center)" data-h2-margin="b(top, none)">
          {intl.formatMessage(poolCandidateMessages.createHeading)}
        </h2>
        <div data-h2-container="b(center, s)">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Select
                id="pool"
                label={intl.formatMessage(poolCandidateMessages.poolLabel)}
                nullSelection={intl.formatMessage(
                  poolCandidateMessages.poolPlaceholder,
                )}
                name="pool"
                options={poolOptions}
                disabled={!!poolId}
                rules={{ required: errorMessages.required }}
              />
              <RadioGroup
                idPrefix="userMode"
                legend="User Assignment"
                name="userMode"
                items={[
                  { value: "existing", label: "Assign Existing User" },
                  { value: "new", label: "Create New User" },
                ]}
                rules={{ required: errorMessages.required }}
              />
              <UserFormSection control={control} userOptions={userOptions} />
              <Input
                id="cmoIdentifier"
                label={intl.formatMessage(
                  poolCandidateMessages.cmoIdentifierLabel,
                )}
                type="text"
                name="cmoIdentifier"
                rules={{ required: errorMessages.required }}
              />
              <Input
                id="expiryDate"
                label={intl.formatMessage(
                  poolCandidateMessages.expiryDateLabel,
                )}
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
                label={intl.formatMessage(poolCandidateMessages.isWomanLabel)}
                name="isWoman"
              />
              <Checkbox
                id="hasDisability"
                label={intl.formatMessage(
                  poolCandidateMessages.hasDisabilityLabel,
                )}
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
              <Checkbox
                id="hasDiploma"
                label={intl.formatMessage(
                  poolCandidateMessages.hasDiplomaLabel,
                )}
                name="hasDiploma"
              />
              <Select
                id="languageAbility"
                label={intl.formatMessage(
                  poolCandidateMessages.languageAbilityLabel,
                )}
                name="languageAbility"
                nullSelection={intl.formatMessage(
                  poolCandidateMessages.languageAbilityPlaceholder,
                )}
                options={enumToOptions(LanguageAbility)}
                rules={{ required: errorMessages.required }}
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
                rules={{ required: errorMessages.required }}
              />
              <MultiSelect
                id="acceptedOperationalRequirements"
                name="acceptedOperationalRequirements"
                label={intl.formatMessage(
                  poolCandidateMessages.acceptedOperationalRequirementsLabel,
                )}
                placeholder={intl.formatMessage(
                  poolCandidateMessages.acceptedOperationalRequirementsPlaceholder,
                )}
                options={operationalRequirementOptions}
                rules={{ required: errorMessages.required }}
              />
              <MultiSelect
                id="expectedSalary"
                label={intl.formatMessage(
                  poolCandidateMessages.expectedClassificationsLabel,
                )}
                name="expectedSalary"
                placeholder={intl.formatMessage(
                  poolCandidateMessages.expectedClassificationsPlaceholder,
                )}
                options={enumToOptions(SalaryRange).map(({ value }) => ({
                  value,
                  label: getSalaryRange(value),
                }))}
                rules={{ required: errorMessages.required }}
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
                rules={{ required: errorMessages.required }}
              />
              <MultiSelect
                id="cmoAssets"
                label={intl.formatMessage(poolCandidateMessages.cmoAssetsLabel)}
                placeholder={intl.formatMessage(
                  poolCandidateMessages.cmoAssetsPlaceholder,
                )}
                name="cmoAssets"
                options={cmoAssetOptions}
                rules={{ required: errorMessages.required }}
              />
              <Select
                id="status"
                label={intl.formatMessage(poolCandidateMessages.statusLabel)}
                nullSelection={intl.formatMessage(
                  poolCandidateMessages.statusPlaceholder,
                )}
                name="status"
                rules={{ required: errorMessages.required }}
                options={enumToOptions(PoolCandidateStatus)}
              />
              <Submit />
            </form>
          </FormProvider>
        </div>
      </section>
    );
  };

export const CreatePoolCandidate: React.FunctionComponent<{ poolId: string }> =
  ({ poolId }) => {
    const intl = useIntl();
    const [lookupResult] = useGetCreatePoolCandidateDataQuery();
    const { data: lookupData, fetching, error } = lookupResult;
    const classifications: Classification[] | [] =
      lookupData?.classifications.filter(notEmpty) ?? [];
    const cmoAssets: CmoAsset[] = lookupData?.cmoAssets.filter(notEmpty) ?? [];
    const operationalRequirements: OperationalRequirement[] =
      lookupData?.operationalRequirements.filter(notEmpty) ?? [];
    const pools: Pool[] = lookupData?.pools.filter(notEmpty) ?? [];
    const users: User[] = lookupData?.users.filter(notEmpty) ?? [];

    const [, executeMutation] = useCreatePoolCandidateMutation();
    const handleCreatePoolCandidate = (data: CreatePoolCandidateInput) =>
      executeMutation({ poolCandidate: data }).then((result) => {
        if (result.data?.createPoolCandidate) {
          return result.data?.createPoolCandidate;
        }
        return Promise.reject(result.error);
      });

    if (fetching)
      return (
        <DashboardContentContainer>
          <p>{intl.formatMessage(commonMessages.loadingTitle)}</p>
        </DashboardContentContainer>
      );
    if (error)
      return (
        <DashboardContentContainer>
          <p>
            {intl.formatMessage(commonMessages.loadingError)} {error.message}
          </p>
        </DashboardContentContainer>
      );

    return (
      <DashboardContentContainer>
        <CreatePoolCandidateForm
          classifications={classifications}
          cmoAssets={cmoAssets}
          operationalRequirements={operationalRequirements}
          pools={pools}
          poolId={poolId}
          users={users}
          handleCreatePoolCandidate={handleCreatePoolCandidate}
        />
      </DashboardContentContainer>
    );
  };
