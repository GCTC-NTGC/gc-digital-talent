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
import { getLocale } from "@common/helpers/localize";
import { notEmpty } from "@common/helpers/util";
import { navigate } from "@common/helpers/router";
import { errorMessages, commonMessages } from "@common/messages";
import { poolTablePath } from "../../routes";
import {
  Classification,
  CmoAsset,
  CreatePoolInput,
  CreatePoolMutation,
  OperationalRequirement,
  Pool,
  useCreatePoolMutation,
  useGetCreatePoolDataQuery,
  User,
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

interface CreatePoolFormProps {
  classifications: Classification[];
  cmoAssets: CmoAsset[];
  operationalRequirements: OperationalRequirement[];
  users: User[];
  handleCreatePool: (
    data: CreatePoolInput,
  ) => Promise<CreatePoolMutation["createPool"]>;
}

export const CreatePoolForm: React.FunctionComponent<CreatePoolFormProps> = ({
  classifications,
  cmoAssets,
  operationalRequirements,
  users,
  handleCreatePool,
}) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const methods = useForm<FormValues>();
  const { handleSubmit } = methods;

  const formValuesToSubmitData = (values: FormValues): CreatePoolInput => ({
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
  });

  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    await handleCreatePool(formValuesToSubmitData(data))
      .then(() => {
        navigate(poolTablePath());
        toast.success(intl.formatMessage(messages.createSuccess));
      })
      .catch(() => {
        toast.error(intl.formatMessage(messages.createError));
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
      <h2>{intl.formatMessage(messages.createHeading)}</h2>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Select
            id="owner"
            label={intl.formatMessage(messages.ownerLabel)}
            name="owner"
            nullSelection={intl.formatMessage(messages.ownerPlaceholder)}
            options={userOptions}
            rules={{ required: errorMessages.required }}
          />
          <Input
            id="name_en"
            name="name.en"
            label={intl.formatMessage(messages.nameLabelEn)}
            type="text"
            rules={{ required: errorMessages.required }}
          />
          <Input
            id="name_fr"
            name="name.fr"
            label={intl.formatMessage(messages.nameLabelFr)}
            type="text"
            rules={{ required: errorMessages.required }}
          />
          <TextArea
            id="description_en"
            name="description.en"
            label={intl.formatMessage(messages.descriptionLabelEn)}
            rules={{ required: errorMessages.required }}
          />
          <TextArea
            id="description_fr"
            name="description.fr"
            label={intl.formatMessage(messages.descriptionLabelFr)}
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

export const CreatePool: React.FunctionComponent = () => {
  const intl = useIntl();
  const [lookupResult] = useGetCreatePoolDataQuery();
  const { data: lookupData, fetching, error } = lookupResult;
  const classifications: Classification[] | [] =
    lookupData?.classifications.filter(notEmpty) ?? [];
  const cmoAssets: CmoAsset[] = lookupData?.cmoAssets.filter(notEmpty) ?? [];
  const operationalRequirements: OperationalRequirement[] =
    lookupData?.operationalRequirements.filter(notEmpty) ?? [];
  const users: User[] = lookupData?.users.filter(notEmpty) ?? [];

  const [_result, executeMutation] = useCreatePoolMutation();
  const handleCreatePool = (data: CreatePoolInput) =>
    executeMutation({ pool: data }).then((result) => {
      if (result.data?.createPool) {
        return result.data?.createPool;
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
      <CreatePoolForm
        classifications={classifications}
        cmoAssets={cmoAssets}
        operationalRequirements={operationalRequirements}
        users={users}
        handleCreatePool={handleCreatePool}
      />
    </DashboardContentContainer>
  );
};
