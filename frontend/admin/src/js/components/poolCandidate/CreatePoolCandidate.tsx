import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Control,
  FormProvider,
  SubmitHandler,
  useForm,
  useWatch,
} from "react-hook-form";
import { toast } from "@common/components/Toast";
import { useIntl } from "react-intl";
import { Submit, Select, Input, RadioGroup } from "@common/components/form";
import { empty, notEmpty } from "@common/helpers/util";
import { enumToOptions } from "@common/helpers/formUtils";
import { getLocale } from "@common/helpers/localize";
import {
  getLanguage,
  getPoolCandidateStatus,
} from "@common/constants/localizedConstants";
import { errorMessages } from "@common/messages";
import Pending from "@common/components/Pending";
import Heading from "@common/components/Heading/Heading";

import { useAdminRoutes } from "../../adminRoutes";
import {
  CreatePoolCandidateAsAdminInput,
  Pool,
  PoolCandidateStatus,
  User,
  CmoAsset,
  Classification,
  useCreatePoolCandidateMutation,
  CreatePoolCandidateMutation,
  PoolCandidate,
  useGetCreatePoolCandidateDataQuery,
  Language,
  Scalars,
} from "../../api/generated";
import DashboardContentContainer from "../DashboardContentContainer";

type Option<V> = { value: V; label: string };

type FormValues = Pick<
  PoolCandidate,
  "cmoIdentifier" | "expiryDate" | "status"
> &
  Pick<User, "firstName" | "lastName" | "preferredLang" | "telephone"> & {
    email: string; // email is Maybe<string> in User definition, but is required in the form.
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
          ? { "data-h2-visibility": "base(visible)" }
          : { "data-h2-visibility": "base(hidden)" })}
      >
        <Select
          id="user"
          label={intl.formatMessage({
            defaultMessage: "User",
            id: "mqswWd",
            description:
              "Label displayed on the pool candidate form user field.",
          })}
          nullSelection={intl.formatMessage({
            defaultMessage: "Select a user...",
            id: "h6kyvS",
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
          ? { "data-h2-visibility": "base(visible)" }
          : { "data-h2-visibility": "base(hidden)" })}
      >
        <Input
          id="email"
          label={intl.formatMessage({
            defaultMessage: "Email",
            id: "sZHcsV",
            description: "Label displayed on the user form email field.",
          })}
          type="email"
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
            defaultMessage: "First Name",
            id: "XKjVO0",
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
            defaultMessage: "Last Name",
            id: "oQnVSn",
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
            defaultMessage: "Telephone",
            id: "8L5kDc",
            description: "Label displayed on the user form telephone field.",
          })}
          type="tel"
          name="telephone"
          rules={{
            required:
              userMode === "new"
                ? intl.formatMessage(errorMessages.required)
                : undefined,
          }}
        />
        <Select
          id="preferredLang"
          label={intl.formatMessage({
            defaultMessage: "Preferred Language",
            id: "o+ZObe",
            description:
              "Label displayed on the user form preferred language field.",
          })}
          name="preferredLang"
          nullSelection={intl.formatMessage({
            defaultMessage: "Select a language...",
            id: "vnhTgE",
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
  pools: Pool[];
  poolId?: string;
  users: User[];
  handleCreatePoolCandidate: (
    data: CreatePoolCandidateAsAdminInput,
  ) => Promise<CreatePoolCandidateMutation["createPoolCandidateAsAdmin"]>;
}

export const CreatePoolCandidateForm: React.FunctionComponent<
  CreatePoolCandidateFormProps
> = ({ pools, poolId, users, handleCreatePoolCandidate }) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const locale = getLocale(intl);
  const paths = useAdminRoutes();
  const methods = useForm<FormValues>({
    defaultValues: {
      pool: poolId,
      status: PoolCandidateStatus.NewApplication, // Status for new candidates default
    },
  });
  const { control, handleSubmit } = methods;

  const formValuesToSubmitData = (
    values: FormValues,
  ): CreatePoolCandidateAsAdminInput => {
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
            telephone:
              // empty string isn't valid according to API validation regex pattern, but null is valid.
              empty(values.telephone) || values.telephone === ""
                ? null
                : values.telephone,
          },
        };
        break;
      default:
        userObject = {};
    }

    return {
      cmoIdentifier: values.cmoIdentifier,
      expiryDate: values.expiryDate,
      status: values.status,
      pool: { connect: values.pool },
      user: userObject, // connect or create mutation
    };
  };

  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    await handleCreatePoolCandidate(formValuesToSubmitData(data))
      .then(() => {
        navigate(paths.poolCandidateTable(poolId || data.pool));
        toast.success(
          intl.formatMessage({
            defaultMessage: "Pool Candidate created successfully!",
            id: "yoshF7",
            description:
              "Message displayed to user after pool candidate is created successfully.",
          }),
        );
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: creating pool candidate failed",
            id: "YOHJFE",
            description:
              "Message displayed to pool candidate after pool candidate fails to get created.",
          }),
        );
      });
  };

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
    <section data-h2-container="base(left, s)">
      <Heading level="h1" size="h2">
        {intl.formatMessage({
          defaultMessage: "Create Pool Candidate",
          id: "SqZuQS",
          description: "Title displayed on the create a user form.",
        })}
      </Heading>
      <div>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Heading level="h2" size="h4">
              {intl.formatMessage({
                description: "Heading for the user information section",
                defaultMessage: "User Information",
                id: "mv+9jt",
              })}
            </Heading>
            <RadioGroup
              idPrefix="userMode"
              legend="User Assignment"
              name="userMode"
              items={[
                {
                  value: "existing",
                  label: intl.formatMessage({
                    defaultMessage: "Assign Existing User",
                    id: "s9dqrf",
                    description:
                      "Label for the existing user assignment option in the create pool candidate form.",
                  }),
                },
                {
                  value: "new",
                  label: intl.formatMessage({
                    defaultMessage: "Create New User",
                    id: "ZH3zx+",
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
            <Heading level="h2" size="h4">
              {intl.formatMessage({
                description: "Heading for the candidate information section",
                defaultMessage: "Candidate Information",
                id: "1THfui",
              })}
            </Heading>
            <Select
              id="pool"
              label={intl.formatMessage({
                defaultMessage: "Pool",
                id: "1b39FQ",
                description:
                  "Label displayed on the pool candidate form pool field.",
              })}
              nullSelection={intl.formatMessage({
                defaultMessage: "Select a pool...",
                id: "4Gf0FC",
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
            <Input
              id="cmoIdentifier"
              label={intl.formatMessage({
                defaultMessage: "Process Number",
                id: "0MYQ73",
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
                id: "x3SuY9",
                description:
                  "Label displayed on the pool candidate form expiry date field.",
              })}
              type="date"
              name="expiryDate"
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
            <Select
              id="status"
              label={intl.formatMessage({
                defaultMessage: "Status",
                id: "rfkkae",
                description:
                  "Label displayed on the pool candidate form status field.",
              })}
              nullSelection={intl.formatMessage({
                defaultMessage: "Select a status...",
                id: "33VQf6",
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

type RouteParams = {
  poolId: Scalars["ID"];
};

const CreatePoolCandidate = () => {
  const { poolId } = useParams<RouteParams>();
  const [lookupResult] = useGetCreatePoolCandidateDataQuery();
  const { data: lookupData, fetching, error } = lookupResult;
  const classifications: Classification[] | [] =
    lookupData?.classifications.filter(notEmpty) ?? [];
  const cmoAssets: CmoAsset[] = lookupData?.cmoAssets.filter(notEmpty) ?? [];
  const pools: Pool[] = lookupData?.pools.filter(notEmpty) ?? [];
  const users: User[] = lookupData?.users.filter(notEmpty) ?? [];

  const [, executeMutation] = useCreatePoolCandidateMutation();
  const handleCreatePoolCandidate = (data: CreatePoolCandidateAsAdminInput) =>
    executeMutation({ poolCandidate: data }).then((result) => {
      if (result.data?.createPoolCandidateAsAdmin) {
        return result.data?.createPoolCandidateAsAdmin;
      }
      return Promise.reject(result.error);
    });

  return (
    <Pending fetching={fetching} error={error}>
      <DashboardContentContainer>
        <CreatePoolCandidateForm
          classifications={classifications}
          cmoAssets={cmoAssets}
          pools={pools}
          poolId={poolId}
          users={users}
          handleCreatePoolCandidate={handleCreatePoolCandidate}
        />
      </DashboardContentContainer>
    </Pending>
  );
};

export default CreatePoolCandidate;
