import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import pick from "lodash/pick";
import { useIntl } from "react-intl";

import { toast } from "@common/components/Toast";
import { Submit, Select, Input } from "@common/components/form";
import Heading from "@common/components/Heading/Heading";
import { notEmpty } from "@common/helpers/util";
import { enumToOptions } from "@common/helpers/formUtils";
import {
  getLanguage,
  getPoolCandidateStatus,
} from "@common/constants/localizedConstants";
import { errorMessages, commonMessages } from "@common/messages";
import { User } from "@common/api/generated";
import { useAdminRoutes } from "../../adminRoutes";
import {
  UpdatePoolCandidateAsAdminInput,
  PoolCandidateStatus,
  CmoAsset,
  Classification,
  PoolCandidate,
  useUpdatePoolCandidateMutation,
  UpdatePoolCandidateMutation,
  useGetUpdatePoolCandidateDataQuery,
  Language,
  Scalars,
} from "../../api/generated";

import DashboardContentContainer from "../DashboardContentContainer";

type FormValues = Pick<
  PoolCandidate,
  "cmoIdentifier" | "expiryDate" | "status"
> &
  Pick<
    User,
    "email" | "firstName" | "lastName" | "telephone" | "preferredLang"
  > & {
    userId: User["id"]; // can't use pick since we need a new name
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
> = ({ initialPoolCandidate, handleUpdatePoolCandidate }) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const paths = useAdminRoutes();
  const dataToFormValues = (data: PoolCandidate): FormValues => ({
    ...data,
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
            id: "ECIFDU",
            description:
              "Message displayed to user after pool candidate is updated successfully.",
          }),
        );
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: updating pool candidate failed",
            id: "HH7lQo",
            description:
              "Message displayed to pool candidate after pool candidate fails to get updated.",
          }),
        );
      });
  };

  return (
    <section data-h2-container="base(left, s)">
      <Heading level="h1" size="h2">
        {intl.formatMessage({
          defaultMessage: "Update Pool Candidate",
          id: "cy2UdP",
          description: "Title displayed on the update a user form.",
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
            <Input
              id="email"
              label={intl.formatMessage({
                defaultMessage: "Email",
                id: "sZHcsV",
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
                id: "XKjVO0",
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
                id: "oQnVSn",
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
                id: "8L5kDc",
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
              disabled
              options={enumToOptions(Language).map(({ value }) => ({
                value,
                label: intl.formatMessage(getLanguage(value)),
              }))}
            />
            <Heading level="h2" size="h4">
              {intl.formatMessage({
                description: "Heading for the candidate information section",
                defaultMessage: "Candidate Information",
                id: "1THfui",
              })}
            </Heading>
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
  poolCandidateId: Scalars["ID"];
};

const UpdatePoolCandidate = () => {
  const intl = useIntl();
  const { poolCandidateId } = useParams<RouteParams>();
  const [lookupResult] = useGetUpdatePoolCandidateDataQuery({
    variables: { id: poolCandidateId || "" },
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
            id: "6Lo9lm",
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

export default UpdatePoolCandidate;
