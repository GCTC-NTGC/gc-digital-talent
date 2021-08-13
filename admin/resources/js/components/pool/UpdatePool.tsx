import { pick } from "lodash";
import * as React from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import {
  Classification,
  CmoAsset,
  OperationalRequirement,
  Pool,
  UpdatePoolInput,
  UpdatePoolMutation,
  useGetUpdatePoolDataQuery,
  User,
  useUpdatePoolMutation,
} from "../../api/generated";
import { notEmpty } from "../../helpers/util";
import errorMessages from "../form/errorMessages";
import { unpackIds } from "../form/formUtils";
import Input from "../form/Input";
import MultiSelect from "../form/MultiSelect";
import Select from "../form/Select";
import Submit from "../form/Submit";
import TextArea from "../form/TextArea";
import messages from "./messages";
import commonMessages from "../commonMessages";
import { getLocale } from "../../helpers/localize";

type Option<V> = { value: V; label: string };

type FormValues = Pick<Pool, "name" | "description"> & {
  assetCriteria: string[] | undefined;
  classifications: string[] | undefined;
  essentialCriteria: string[] | undefined;
  operationalRequirements: string[] | undefined;
  owner: string;
};

interface UpdatePoolFormProps {
  classifications: Classification[];
  cmoAssets: CmoAsset[];
  initialPool: Pool;
  operationalRequirements: OperationalRequirement[];
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
  operationalRequirements,
  users,
  handleUpdatePool,
}) => {
  const intl = useIntl();
  const locale = getLocale(intl.locale);
  const dataToFormValues = (
    data: Pool | UpdatePoolMutation["updatePool"],
  ): FormValues => ({
    ...data,
    assetCriteria: unpackIds(data?.assetCriteria),
    classifications: unpackIds(data?.classifications),
    essentialCriteria: unpackIds(data?.essentialCriteria),
    operationalRequirements: unpackIds(data?.operationalRequirements),
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
    operationalRequirements: {
      sync: values.operationalRequirements,
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
  });

  const methods = useForm<FormValues>({
    defaultValues: dataToFormValues(initialPool),
  });
  const { handleSubmit } = methods;

  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    await handleUpdatePool(initialPool.id, formValuesToSubmitData(data))
      .then(() => {
        // TODO: Navigate to pool dashboard.
      })
      .catch(() => {
        // Something went wrong with handleUpdatePool.
        // Do nothing.
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

  const userOptions: Option<string>[] = users.map(
    ({ id, firstName, lastName }) => ({
      value: id,
      label: `${firstName} ${lastName}`,
    }),
  );

  return (
    <section>
      <h2>{intl.formatMessage(messages.updateHeading)}</h2>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Select
            id="owner"
            label={intl.formatMessage(messages.ownerLabel)}
            name="owner"
            options={[
              { value: "", label: "Select a owner...", disabled: true },
              ...userOptions,
            ]}
            rules={{ required: errorMessages.required }}
          />
          <Input
            id="name_en"
            name="name.en"
            label={intl.formatMessage(messages.nameLabelEN)}
            type="text"
            rules={{ required: errorMessages.required }}
          />
          <Input
            id="name_fr"
            name="name.fr"
            label={intl.formatMessage(messages.nameLabelFR)}
            type="text"
            rules={{ required: errorMessages.required }}
          />
          <TextArea
            id="description_en"
            name="description.en"
            label={intl.formatMessage(messages.descriptionLabelEN)}
            rules={{ required: errorMessages.required }}
          />
          <TextArea
            id="description_fr"
            name="description.fr"
            label={intl.formatMessage(messages.descriptionLabelFR)}
            rules={{ required: errorMessages.required }}
          />
          <MultiSelect
            id="classifications"
            label={intl.formatMessage(messages.classificationsLabel)}
            placeholder={intl.formatMessage(
              messages.classificationsPlaceholder,
            )}
            name="classifications"
            options={classificationOptions}
            rules={{ required: errorMessages.required }}
          />
          <MultiSelect
            id="assetCriteria"
            label={intl.formatMessage(messages.assetCriteriaLabel)}
            placeholder={intl.formatMessage(messages.assetCriteriaPlaceholder)}
            name="assetCriteria"
            options={cmoAssetOptions}
            rules={{ required: errorMessages.required }}
          />
          <MultiSelect
            id="essentialCriteria"
            label={intl.formatMessage(messages.essentialCriteriaLabel)}
            placeholder={intl.formatMessage(
              messages.essentialCriteriaPlaceholder,
            )}
            name="essentialCriteria"
            options={cmoAssetOptions}
            rules={{ required: errorMessages.required }}
          />
          <MultiSelect
            id="operationalRequirements"
            name="operationalRequirements"
            label={intl.formatMessage(messages.operationalRequirementsLabel)}
            placeholder={intl.formatMessage(
              messages.operationalRequirementsPlaceholder,
            )}
            options={operationalRequirementOptions}
            rules={{ required: errorMessages.required }}
          />
          <Submit />
        </form>
      </FormProvider>
    </section>
  );
};

export const UpdatePool: React.FunctionComponent<{
  poolId: string;
}> = ({ poolId }) => {
  const intl = useIntl();
  const [lookupResult] = useGetUpdatePoolDataQuery({
    variables: { id: poolId },
  });
  const { data: lookupData, fetching, error } = lookupResult;
  const classifications: Classification[] | [] =
    lookupData?.classifications.filter(notEmpty) ?? [];
  const cmoAssets: CmoAsset[] = lookupData?.cmoAssets.filter(notEmpty) ?? [];
  const operationalRequirements: OperationalRequirement[] =
    lookupData?.operationalRequirements.filter(notEmpty) ?? [];
  const users: User[] = lookupData?.users.filter(notEmpty) ?? [];

  const [_result, executeMutation] = useUpdatePoolMutation();
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

  if (fetching) return <p>{intl.formatMessage(commonMessages.loadingTitle)}</p>;
  if (error)
    return (
      <p>
        {intl.formatMessage(commonMessages.loadingError)} {error.message}
      </p>
    );

  return lookupData?.pool ? (
    <UpdatePoolForm
      classifications={classifications}
      cmoAssets={cmoAssets}
      initialPool={lookupData.pool}
      operationalRequirements={operationalRequirements}
      users={users}
      handleUpdatePool={handleUpdatePool}
    />
  ) : (
    <p>
      {intl.formatMessage(commonMessages.notFound, {
        type: "Pool",
        id: poolId,
      })}
    </p>
  );
};
