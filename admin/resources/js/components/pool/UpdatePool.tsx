import { pick } from "lodash";
import * as React from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { toast } from "react-toastify";
import {
  Input,
  MultiSelect,
  Select,
  Submit,
  TextArea,
} from "@common/components/form";
import { notEmpty } from "@common/helpers/util";
import { unpackIds } from "@common/helpers/formUtils";
import { getLocale } from "@common/helpers/localize";
import { navigate } from "@common/helpers/router";
import { errorMessages, commonMessages } from "@common/messages";
import { poolTablePath } from "../../adminRoutes";
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
import messages from "./messages";
import DashboardContentContainer from "../DashboardContentContainer";

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
  const locale = getLocale(intl);
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
        navigate(poolTablePath());
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

  const userOptions: Option<string>[] = users.map(
    ({ id, firstName, lastName }) => ({
      value: id,
      label: `${firstName} ${lastName}`,
    }),
  );

  return (
    <section>
      <h2 data-h2-text-align="b(center)" data-h2-margin="b(top, none)">
        {intl.formatMessage(messages.updateHeading)}
      </h2>
      <div data-h2-container="b(center, s)">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Select
              id="owner"
              label={intl.formatMessage(messages.ownerLabel)}
              name="owner"
              nullSelection={intl.formatMessage(messages.ownerPlaceholder)}
              options={userOptions}
              rules={{ required: intl.formatMessage(errorMessages.required) }}
            />
            <Input
              id="name_en"
              name="name.en"
              label={intl.formatMessage(messages.nameLabelEn)}
              type="text"
              rules={{ required: intl.formatMessage(errorMessages.required) }}
            />
            <Input
              id="name_fr"
              name="name.fr"
              label={intl.formatMessage(messages.nameLabelFr)}
              type="text"
              rules={{ required: intl.formatMessage(errorMessages.required) }}
            />
            <TextArea
              id="description_en"
              name="description.en"
              label={intl.formatMessage(messages.descriptionLabelEn)}
              rules={{ required: intl.formatMessage(errorMessages.required) }}
            />
            <TextArea
              id="description_fr"
              name="description.fr"
              label={intl.formatMessage(messages.descriptionLabelFr)}
              rules={{ required: intl.formatMessage(errorMessages.required) }}
            />
            <MultiSelect
              id="classifications"
              label={intl.formatMessage(messages.classificationsLabel)}
              placeholder={intl.formatMessage(
                messages.classificationsPlaceholder,
              )}
              name="classifications"
              options={classificationOptions}
              rules={{ required: intl.formatMessage(errorMessages.required) }}
            />
            <MultiSelect
              id="assetCriteria"
              label={intl.formatMessage(messages.assetCriteriaLabel)}
              placeholder={intl.formatMessage(
                messages.assetCriteriaPlaceholder,
              )}
              name="assetCriteria"
              options={cmoAssetOptions}
              rules={{ required: intl.formatMessage(errorMessages.required) }}
            />
            <MultiSelect
              id="essentialCriteria"
              label={intl.formatMessage(messages.essentialCriteriaLabel)}
              placeholder={intl.formatMessage(
                messages.essentialCriteriaPlaceholder,
              )}
              name="essentialCriteria"
              options={cmoAssetOptions}
              rules={{ required: intl.formatMessage(errorMessages.required) }}
            />
            <MultiSelect
              id="operationalRequirements"
              name="operationalRequirements"
              label={intl.formatMessage(messages.operationalRequirementsLabel)}
              placeholder={intl.formatMessage(
                messages.operationalRequirementsPlaceholder,
              )}
              options={operationalRequirementOptions}
              rules={{ required: intl.formatMessage(errorMessages.required) }}
            />
            <Submit />
          </form>
        </FormProvider>
      </div>
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

  return lookupData?.pool ? (
    <DashboardContentContainer>
      <UpdatePoolForm
        classifications={classifications}
        cmoAssets={cmoAssets}
        initialPool={lookupData.pool}
        operationalRequirements={operationalRequirements}
        users={users}
        handleUpdatePool={handleUpdatePool}
      />
    </DashboardContentContainer>
  ) : (
    <DashboardContentContainer>
      <p>{intl.formatMessage(messages.notFound, { poolId })}</p>
    </DashboardContentContainer>
  );
};
