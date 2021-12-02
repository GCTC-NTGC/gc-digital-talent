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
        {...(userMode === "existing"
          ? { "data-h2-visibility": "initial" }
          : { "data-h2-visibility": "b(hidden)" })}
      >
        <Select
          id="user"
          label={intl.formatMessage({
            defaultMessage: "User:",
            description:
              "Label displayed on the pool candidate form user field.",
          })}
          nullSelection={intl.formatMessage({
            defaultMessage: "Select a user...",
            description:
              "Placeholder displayed on the pool candidate form user field.",
          })}
          name="user"
          options={userOptions}
          rules={{
            required:
              userMode === "existing"
                ? intl.formatMessage(errorMessages.required)
                : undefined,
          }}
        />
      </div>
      <div
        {...(userMode === "new"
          ? { "data-h2-visibility": "initial" }
          : { "data-h2-visibility": "b(hidden)" })}
      >
        <Input
          id="email"
          label={intl.formatMessage({
            defaultMessage: "Email:",
            description: "Label displayed on the user form email field.",
          })}
          type="text"
          name="email"
          rules={{
            required:
              userMode === "new"
                ? intl.formatMessage(errorMessages.required)
                : undefined,
          }}
        />
        <Input
          id="firstName"
          label={intl.formatMessage({
            defaultMessage: "First Name:",
            description: "Label displayed on the user form first name field.",
          })}
          type="text"
          name="firstName"
          rules={{
            required:
              userMode === "new"
                ? intl.formatMessage(errorMessages.required)
                : undefined,
          }}
        />
        <Input
          id="lastName"
          label={intl.formatMessage({
            defaultMessage: "Last Name:",
            description: "Label displayed on the user form last name field.",
          })}
          type="text"
          name="lastName"
          rules={{
            required:
              userMode === "new"
                ? intl.formatMessage(errorMessages.required)
                : undefined,
          }}
        />
        <Input
          id="telephone"
          label={intl.formatMessage({
            defaultMessage: "Telephone:",
            description: "Label displayed on the user form telephone field.",
          })}
          type="tel"
          name="telephone"
          rules={{
            required:
              userMode === "new"
                ? intl.formatMessage(errorMessages.required)
                : undefined,
            pattern: {
              value: /^\+[1-9]\d{1,14}$/,
              message: intl.formatMessage(errorMessages.telephone),
            },
          }}
        />
        <Select
          id="preferredLang"
          label={intl.formatMessage({
            defaultMessage: "Preferred Language:",
            description:
              "Label displayed on the user form preferred language field.",
          })}
          name="preferredLang"
          nullSelection={intl.formatMessage({
            defaultMessage: "Select a language...",
            description:
              "Placeholder displayed on the user form preferred language field.",
          })}
          rules={{
            required:
              userMode === "new"
                ? intl.formatMessage(errorMessages.required)
                : undefined,
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

export const CreatePoolCandidateForm: React.FunctionComponent<
  CreatePoolCandidateFormProps
> = ({
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
          intl.formatMessage({
            defaultMessage: "Pool Candidate created successfully!",
            description:
              "Message displayed to user after pool candidate is created successfully.",
          }),
        );
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: creating pool candidate failed",
            description:
              "Message displayed to pool candidate after pool candidate fails to get created.",
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
        {intl.formatMessage({
          defaultMessage: "Create Pool Candidate",
          description: "Title displayed on the create a user form.",
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
            <RadioGroup
              idPrefix="userMode"
              legend="User Assignment"
              name="userMode"
              items={[
                {
                  value: "existing",
                  label: intl.formatMessage({
                    defaultMessage: "Assign Existing User",
                    description:
                      "Label for the existing user assignment option in the create pool candidate form.",
                  }),
                },
                {
                  value: "new",
                  label: intl.formatMessage({
                    defaultMessage: "Create New User",
                    description:
                      "Label for the new user assignment option in the create pool candidate form.",
                  }),
                },
              ]}
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
            <UserFormSection control={control} userOptions={userOptions} />
            <h4>
              {intl.formatMessage({
                description: "Heading for the candidate information section",
                defaultMessage: "Candidate Information",
              })}
            </h4>
            <Select
              id="pool"
              label={intl.formatMessage({
                defaultMessage: "Pool:",
                description:
                  "Label displayed on the pool candidate form pool field.",
              })}
              nullSelection={intl.formatMessage({
                defaultMessage: "Select a pool...",
                description:
                  "Placeholder displayed on the pool candidate form Pool field.",
              })}
              name="pool"
              options={poolOptions}
              disabled={!!poolId}
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
            <Select
              id="user"
              label={intl.formatMessage({
                defaultMessage: "User:",
                description:
                  "Label displayed on the pool candidate form user field.",
              })}
              nullSelection={intl.formatMessage({
                defaultMessage: "Select a user...",
                description:
                  "Placeholder displayed on the pool candidate form user field.",
              })}
              name="user"
              options={userOptions}
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
            <Input
              id="cmoIdentifier"
              label={intl.formatMessage({
                defaultMessage: "CMO Identifier:",
                description:
                  "Label displayed on the pool candidate form cmo identifier field.",
              })}
              type="text"
              name="cmoIdentifier"
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
            <Input
              id="expiryDate"
              label={intl.formatMessage({
                defaultMessage: "Expiry Date: ",
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
                defaultMessage: "Woman:",
                description:
                  "Label displayed on the pool candidate form is woman field.",
              })}
              name="isWoman"
            />
            <Checkbox
              id="hasDisability"
              label={intl.formatMessage({
                defaultMessage: "Has Disability:",
                description:
                  "Label displayed on the pool candidate form has disability field.",
              })}
              name="hasDisability"
            />
            <Checkbox
              id="isIndigenous"
              label={intl.formatMessage({
                defaultMessage: "Indigenous:",
                description:
                  "Placeholder displayed on the pool candidate form is indigenous field.",
              })}
              name="isIndigenous"
            />
            <Checkbox
              id="isVisibleMinority"
              label={intl.formatMessage({
                defaultMessage: "Visible Minority:",
                description:
                  "Label displayed on the pool candidate form is visible minority field.",
              })}
              name="isVisibleMinority"
            />
            <Checkbox
              id="hasDiploma"
              label={intl.formatMessage({
                defaultMessage: "Has Diploma:",
                description:
                  "Label displayed on the pool candidate form has diploma field.",
              })}
              name="hasDiploma"
            />
            <Select
              id="languageAbility"
              label={intl.formatMessage({
                defaultMessage: "Language Ability:",
                description:
                  "Label displayed on the pool candidate form language ability field.",
              })}
              name="languageAbility"
              nullSelection={intl.formatMessage({
                defaultMessage: "Select a language ability...",
                description:
                  "Placeholder displayed on the pool candidate form language ability field.",
              })}
              options={enumToOptions(LanguageAbility)}
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
            <MultiSelect
              id="locationPreferences"
              name="locationPreferences"
              label={intl.formatMessage({
                defaultMessage: "Location Preferences:",
                description:
                  "Label displayed on the pool candidate form location preferences field.",
              })}
              placeholder={intl.formatMessage({
                defaultMessage: "Select one or more location preferences...",
                description:
                  "Placeholder displayed on the pool candidate form location preferences field.",
              })}
              options={enumToOptions(WorkRegion)}
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
            <MultiSelect
              id="acceptedOperationalRequirements"
              name="acceptedOperationalRequirements"
              label={intl.formatMessage({
                defaultMessage: "Operational Requirements:",
                description:
                  "Label displayed on the pool candidate form operational requirements field.",
              })}
              placeholder={intl.formatMessage({
                defaultMessage:
                  "Select one or more operational requirements...",
                description:
                  "Placeholder displayed on the pool candidate form operational requirements field.",
              })}
              options={operationalRequirementOptions}
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
            <MultiSelect
              id="expectedSalary"
              label={intl.formatMessage({
                defaultMessage: "Expected Salary:",
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
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
            <MultiSelect
              id="expectedClassifications"
              label={intl.formatMessage({
                defaultMessage: "Expected Classifications:",
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
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
            <MultiSelect
              id="cmoAssets"
              label={intl.formatMessage({
                defaultMessage: "CMO Assets:",
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
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
            <Select
              id="status"
              label={intl.formatMessage({
                defaultMessage: "Status:",
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
              options={enumToOptions(PoolCandidateStatus)}
            />
            <Submit />
          </form>
        </FormProvider>
      </div>
    </section>
  );
};

export const CreatePoolCandidate: React.FunctionComponent<{
  poolId: string;
}> = ({ poolId }) => {
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
          {intl.formatMessage(commonMessages.loadingError)}
          {error.message}
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
