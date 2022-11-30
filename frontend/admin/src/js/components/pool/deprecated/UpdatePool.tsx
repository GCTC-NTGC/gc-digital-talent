import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import pick from "lodash/pick";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useIntl } from "react-intl";

import { toast } from "@common/components/Toast";
import {
  Input,
  MultiSelect,
  Select,
  Submit,
  TextArea,
} from "@common/components/form";
import { notEmpty } from "@common/helpers/util";
import { enumToOptions, unpackIds } from "@common/helpers/formUtils";
import { getLocale } from "@common/helpers/localize";
import { errorMessages, commonMessages } from "@common/messages";
import {
  getOperationalRequirement,
  getPoolStatus,
  OperationalRequirementV2,
} from "@common/constants/localizedConstants";
import Pending from "@common/components/Pending";
import NotFound from "@common/components/NotFound";
import Heading from "@common/components/Heading/Heading";

import { useAdminRoutes } from "../../../adminRoutes";
import {
  Classification,
  CmoAsset,
  Pool,
  PoolStatus,
  Scalars,
  UpdatePoolInput,
  UpdatePoolMutation,
  useGetUpdatePoolDataQuery,
  User,
  useUpdatePoolMutation,
} from "../../../api/generated";
import DashboardContentContainer from "../../DashboardContentContainer";

type Option<V> = { value: V; label: string };

type FormValues = Pick<
  Pool,
  "name" | "description" | "operationalRequirements" | "keyTasks" | "status"
> & {
  assetCriteria: string[] | undefined;
  classifications: string[] | undefined;
  essentialCriteria: string[] | undefined;
  owner: string;
};

interface UpdatePoolFormProps {
  classifications: Classification[];
  cmoAssets: CmoAsset[];
  initialPool: Pool;
  users: User[];
  handleUpdatePool: (
    id: string,
    data: UpdatePoolInput,
  ) => Promise<UpdatePoolMutation["updatePool"]>;
}

export const UpdatePoolForm: React.FunctionComponent<UpdatePoolFormProps> = ({
  classifications,
  cmoAssets,
  initialPool,
  users,
  handleUpdatePool,
}) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const navigate = useNavigate();
  const paths = useAdminRoutes();
  const dataToFormValues = (
    data: Pool | UpdatePoolMutation["updatePool"],
  ): FormValues => ({
    ...data,
    assetCriteria: unpackIds(data?.assetCriteria),
    classifications: unpackIds(data?.classifications),
    essentialCriteria: unpackIds(data?.essentialCriteria),
    owner: data?.owner?.id || "",
  });

  const formValuesToSubmitData = (values: FormValues): UpdatePoolInput => ({
    ...values,
    assetCriteria: {
      sync: values.assetCriteria,
    },
    classifications: {
      sync: values.classifications,
    },
    essentialCriteria: {
      sync: values.essentialCriteria,
    },
    owner: { connect: values.owner },
    name: {
      en: values.name?.en,
      fr: values.name?.fr,
    },
    description: {
      en: values.description?.en,
      fr: values.description?.fr,
    },
    keyTasks: {
      en: values.keyTasks?.en,
      fr: values.keyTasks?.fr,
    },
  });

  const methods = useForm<FormValues>({
    defaultValues: dataToFormValues(initialPool),
  });
  const { handleSubmit } = methods;

  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    await handleUpdatePool(initialPool.id, formValuesToSubmitData(data))
      .then(() => {
        navigate(paths.poolTable());
        toast.success(
          intl.formatMessage({
            defaultMessage: "Pool updated successfully!",
            id: "ANLJ2T",
            description:
              "Message displayed to user after pool is updated successfully.",
          }),
        );
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: updating pool failed",
            id: "ZbW9T7",
            description:
              "Message displayed to pool after pool fails to get updated.",
          }),
        );
      });
  };

  const cmoAssetOptions: Option<string>[] = cmoAssets.map(({ id, name }) => ({
    value: id,
    label: name[locale] ?? intl.formatMessage(commonMessages.nameNotLoaded),
  }));

  const classificationOptions: Option<string>[] = classifications.map(
    ({ id, group, level }) => ({
      value: id,
      label: `${group}-0${level}`,
    }),
  );

  const userOptions: Option<string>[] = users.map(
    ({ id, firstName, lastName }) => ({
      value: id,
      label: `${firstName} ${lastName}`,
    }),
  );

  return (
    <section data-h2-container="base(left, small, 0)">
      <Heading level="h1" size="h2">
        {intl.formatMessage({
          defaultMessage: "Update Pool",
          id: "H5EJq1",
          description: "Title displayed on the update a pool form.",
        })}
      </Heading>
      <div>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Select
              id="owner"
              label={intl.formatMessage({
                defaultMessage: "Owner",
                id: "Urq3fM",
                description: "Label displayed on the pool form owner field.",
              })}
              name="owner"
              nullSelection={intl.formatMessage({
                defaultMessage: "Select an owner...",
                id: "os4TSk",
                description:
                  "Placeholder displayed on the pool form owner field.",
              })}
              options={userOptions}
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
            <Input
              id="name_en"
              name="name.en"
              label={intl.formatMessage({
                defaultMessage: "Name (English)",
                id: "Ue4SoL",
                description:
                  "Label displayed on the pool form name (English) field.",
              })}
              type="text"
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
            <Input
              id="name_fr"
              name="name.fr"
              label={intl.formatMessage({
                defaultMessage: "Name (French)",
                id: "Xk7io5",
                description:
                  "Label displayed on the pool form name (French) field.",
              })}
              type="text"
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
            <TextArea
              id="description_en"
              name="description.en"
              label={intl.formatMessage({
                defaultMessage: "Description (English)",
                id: "6jTDpQ",
                description:
                  "Label displayed on the pool form description (English) field.",
              })}
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
            <TextArea
              id="description_fr"
              name="description.fr"
              label={intl.formatMessage({
                defaultMessage: "Description (French)",
                id: "lfnGmL",
                description:
                  "Label displayed on the pool form description (French) field.",
              })}
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
            <MultiSelect
              id="classifications"
              label={intl.formatMessage({
                defaultMessage: "Classifications",
                id: "ZSXEfX",
                description:
                  "Label displayed on the pool form classifications field.",
              })}
              placeholder={intl.formatMessage({
                defaultMessage: "Select one or more classifications...",
                id: "0tYHRO",
                description:
                  "Placeholder displayed on the pool form classifications field.",
              })}
              name="classifications"
              options={classificationOptions}
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
            <MultiSelect
              id="assetCriteria"
              label={intl.formatMessage({
                defaultMessage: "Asset Criteria",
                id: "GGjwcl",
                description:
                  "Label displayed on the pool form asset criteria field.",
              })}
              placeholder={intl.formatMessage({
                defaultMessage: "Select one or more asset...",
                id: "l7xk8j",
                description:
                  "Placeholder displayed on the pool form asset criteria field.",
              })}
              name="assetCriteria"
              options={cmoAssetOptions}
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
            <MultiSelect
              id="essentialCriteria"
              label={intl.formatMessage({
                defaultMessage: "Essential Criteria",
                id: "Y9jn9b",
                description:
                  "Label displayed on the pool form essential criteria field.",
              })}
              placeholder={intl.formatMessage({
                defaultMessage: "Select one or more essential...",
                id: "B0lDYB",
                description:
                  "Placeholder displayed on the pool form essential criteria field.",
              })}
              name="essentialCriteria"
              options={cmoAssetOptions}
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
            <MultiSelect
              id="operationalRequirements"
              name="operationalRequirements"
              label={intl.formatMessage({
                defaultMessage: "Operational Requirements",
                id: "Rimr49",
                description:
                  "Label displayed on the pool form operational requirements field.",
              })}
              placeholder={intl.formatMessage({
                defaultMessage:
                  "Select one or more operational requirements...",
                id: "vkus5u",
                description:
                  "Placeholder displayed on the pool form operational requirements field.",
              })}
              options={OperationalRequirementV2.map((value) => ({
                value,
                label: intl.formatMessage(getOperationalRequirement(value)),
              }))}
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
            <TextArea
              id="keyTasks_en"
              name="keyTasks.en"
              label={intl.formatMessage({
                defaultMessage: "Key Tasks (English)",
                id: "AiOtNy",
                description:
                  "Label displayed on the pool form key tasks (English) field.",
              })}
            />
            <TextArea
              id="keyTasks_fr"
              name="keyTasks.fr"
              label={intl.formatMessage({
                defaultMessage: "Key Tasks (French)",
                id: "InHDUX",
                description:
                  "Label displayed on the pool form key tasks (French) field.",
              })}
            />
            <Select
              id="status"
              label={intl.formatMessage({
                defaultMessage: "Status",
                id: "fu4Fen",
                description: "Label displayed on the pool form status field.",
              })}
              nullSelection={intl.formatMessage({
                defaultMessage: "Select a status...",
                id: "qr5RPo",
                description:
                  "Placeholder displayed on the pool form status field.",
              })}
              name="status"
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
              options={enumToOptions(PoolStatus).map(({ value }) => ({
                value,
                label: intl.formatMessage(getPoolStatus(value)),
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

const UpdatePool = () => {
  const intl = useIntl();
  const { poolId } = useParams<RouteParams>();
  const [lookupResult] = useGetUpdatePoolDataQuery({
    variables: { id: poolId || "" },
  });
  const { data: lookupData, fetching, error } = lookupResult;
  const classifications: Classification[] | [] =
    lookupData?.classifications.filter(notEmpty) ?? [];
  const cmoAssets: CmoAsset[] = lookupData?.cmoAssets.filter(notEmpty) ?? [];
  const users: User[] = lookupData?.users.filter(notEmpty) ?? [];

  const [, executeMutation] = useUpdatePoolMutation();
  const handleUpdatePool = (id: string, formData: UpdatePoolInput) =>
    /* We must pick only the fields belonging to UpdatePoolInput, because it's possible
      the data object contains other props at runtime, and this will cause the
      graphql operation to fail. */
    executeMutation({
      id,
      pool: pick(formData, [
        "owner",
        "name",
        "description",
        "keyTasks",
        "status",
        "classifications",
        "assetCriteria",
        "essentialCriteria",
        "operationalRequirements",
      ]),
    }).then((result) => {
      if (result.data?.updatePool) {
        return result.data?.updatePool;
      }
      return Promise.reject(result.error);
    });

  return (
    <Pending fetching={fetching} error={error}>
      <DashboardContentContainer>
        {lookupData?.pool ? (
          <UpdatePoolForm
            classifications={classifications}
            cmoAssets={cmoAssets}
            initialPool={lookupData.pool}
            users={users}
            handleUpdatePool={handleUpdatePool}
          />
        ) : (
          <NotFound
            headingMessage={intl.formatMessage(commonMessages.notFound)}
          >
            <p>
              {intl.formatMessage(
                {
                  defaultMessage: "Pool {poolId} not found.",
                  id: "Sb2fEr",
                  description: "Message displayed for pool not found.",
                },
                { poolId },
              )}
            </p>
          </NotFound>
        )}
      </DashboardContentContainer>
    </Pending>
  );
};

export default UpdatePool;
