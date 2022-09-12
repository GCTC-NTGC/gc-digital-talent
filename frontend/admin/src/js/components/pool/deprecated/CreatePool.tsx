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
import { errorMessages } from "@common/messages";
import { keyStringRegex } from "@common/constants/regularExpressions";
import { enumToOptions } from "@common/helpers/formUtils";
import {
  getOperationalRequirement,
  getPoolStatus,
  OperationalRequirementV2,
} from "@common/constants/localizedConstants";
import Pending from "@common/components/Pending";
import { useAdminRoutes } from "../../../adminRoutes";
import {
  Classification,
  CmoAsset,
  CreatePoolInput,
  CreatePoolMutation,
  Pool,
  useCreatePoolMutation,
  useGetCreatePoolDataQuery,
  User,
  PoolStatus,
} from "../../../api/generated";
import DashboardContentContainer from "../../DashboardContentContainer";

type Option<V> = { value: V; label: string };

type FormValues = Pick<
  Pool,
  "description" | "operationalRequirements" | "keyTasks" | "status"
> & {
  key: string;
  name: {
    en: string;
    fr: string;
  };
  assetCriteria: string[] | undefined;
  classifications: string[] | undefined;
  essentialCriteria: string[] | undefined;
  owner: string;
};

interface CreatePoolFormProps {
  classifications: Classification[];
  cmoAssets: CmoAsset[];
  users: User[];
  handleCreatePool: (
    data: CreatePoolInput,
  ) => Promise<CreatePoolMutation["createPool"]>;
}

export const CreatePoolForm: React.FunctionComponent<CreatePoolFormProps> = ({
  classifications,
  cmoAssets,
  users,
  handleCreatePool,
}) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const paths = useAdminRoutes();
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
    owner: { connect: values.owner },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    await handleCreatePool(formValuesToSubmitData(data))
      .then(() => {
        navigate(paths.poolTable());
        toast.success(
          intl.formatMessage({
            defaultMessage: "Pool created successfully!",
            id: "wZ91g+",
            description:
              "Message displayed to user after pool is created successfully.",
          }),
        );
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: creating pool failed",
            id: "W2qRX5",
            description:
              "Message displayed to pool after pool fails to get created.",
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

  const userOptions: Option<string>[] = users.map(
    ({ id, firstName, lastName }) => ({
      value: id,
      label: `${firstName} ${lastName}`,
    }),
  );

  return (
    <section data-h2-container="base(left, small, 0)">
      <h2 data-h2-font-weight="base(700)" data-h2-margin="base(x3, 0, x1, 0)">
        {intl.formatMessage({
          defaultMessage: "Create Pool",
          id: "ekKb+G",
          description: "Title displayed on the create a pool form.",
        })}
      </h2>
      <div data-h2-margin="base(x2, 0, 0, 0)">
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
            <Input
              id="key"
              name="key"
              label={intl.formatMessage({
                defaultMessage: "Key",
                id: "T+Ak4D",
                description: "Label displayed on the 'key' input field.",
              })}
              context={intl.formatMessage({
                defaultMessage:
                  "The 'key' is a string that uniquely identifies a Pool. It should be based on the Pool's English name, and it should be concise. A good example would be \"digital_careers\". It may be used in the code to refer to this particular Pool, so it cannot be changed later.",
                id: "sFl+Xl",
                description:
                  "Additional context describing the purpose of the Pool's 'key' field.",
              })}
              type="text"
              rules={{
                required: intl.formatMessage(errorMessages.required),
                pattern: {
                  value: keyStringRegex,
                  message: intl.formatMessage({
                    defaultMessage:
                      "Please use only lowercase letters and underscores.",
                    id: "aPqZsz",
                  }),
                },
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

const CreatePool: React.FunctionComponent = () => {
  const [lookupResult] = useGetCreatePoolDataQuery();
  const { data: lookupData, fetching, error } = lookupResult;
  const classifications: Classification[] | [] =
    lookupData?.classifications.filter(notEmpty) ?? [];
  const cmoAssets: CmoAsset[] = lookupData?.cmoAssets.filter(notEmpty) ?? [];
  const users: User[] = lookupData?.users.filter(notEmpty) ?? [];

  const [, executeMutation] = useCreatePoolMutation();
  const handleCreatePool = (data: CreatePoolInput) =>
    executeMutation({ pool: data }).then((result) => {
      if (result.data?.createPool) {
        return result.data?.createPool;
      }
      return Promise.reject(result.error);
    });

  return (
    <Pending fetching={fetching} error={error}>
      <DashboardContentContainer>
        <CreatePoolForm
          classifications={classifications}
          cmoAssets={cmoAssets}
          users={users}
          handleCreatePool={handleCreatePool}
        />
      </DashboardContentContainer>
    </Pending>
  );
};

export default CreatePool;
