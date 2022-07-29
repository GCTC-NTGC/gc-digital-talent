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
  GenericJobTitles,
  GenericJobTitlesSorted,
  getGenericJobTitles,
  getGenericJobTitlesWithClassification,
  OperationalRequirementV2,
} from "@common/constants/localizedConstants";
import Pending from "@common/components/Pending";
import PageHeader from "@common/components/PageHeader/PageHeader";
import Breadcrumbs, {
  BreadcrumbsProps,
} from "@common/components/Breadcrumbs/Breadcrumbs";
import { ViewGridIcon } from "@heroicons/react/outline";
import { ViewGridIcon as SolidGridIcon } from "@heroicons/react/solid";
import Link from "@common/components/Link/Link";
import { useAdminRoutes } from "../../adminRoutes";
import {
  Classification,
  CmoAsset,
  CreatePoolInput,
  CreatePoolMutation,
  Pool,
  useCreatePoolMutation,
  useGetCreatePoolDataQuery,
  useGetGenericJobTitlesQuery,
  User,
  PoolStatus,
  GenericJobTitle,
} from "../../api/generated";
import DashboardContentContainer from "../DashboardContentContainer";

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
  genericJobTitles: GenericJobTitle[];
}

export const CreatePoolForm: React.FunctionComponent<CreatePoolFormProps> = ({
  classifications,
  cmoAssets,
  users,
  handleCreatePool,
  genericJobTitles,
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
            description:
              "Message displayed to user after pool is created successfully.",
          }),
        );
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: creating pool failed",
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

  const links = [
    {
      title: intl.formatMessage({
        defaultMessage: "My Pools",
        description: "Breadcrumb title for the pools page link.",
      }),
      href: paths.poolTable(),
      icon: <SolidGridIcon style={{ width: "1rem", marginRight: "5px" }} />,
    },
    {
      title: intl.formatMessage({
        defaultMessage: `New Pool`,
        description: "New pool breadcrumb text",
      }),
    },
  ] as BreadcrumbsProps["links"];

  return (
    <section>
      <PageHeader icon={ViewGridIcon}>
        {intl.formatMessage({
          defaultMessage: "Create New Pool",
          description: "Header for page to create pool advertisements",
        })}
      </PageHeader>
      <Breadcrumbs links={links} />
      <div
        data-h2-container="b(left, s)"
        data-h2-bg-color="b(lightgray)"
        data-h2-padding="b(all, xs)"
        data-h2-margin="b(top, l)"
        data-h2-radius="b(s)"
      >
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <h3 data-h2-margin="b(top-bottom, xs)">
              {intl.formatMessage({
                defaultMessage: "Start blank job poster",
                description: "Form header to create new pool",
              })}
            </h3>
            <p>
              {intl.formatMessage({
                defaultMessage: "Create a new job poster from scratch",
                description: "Form blurb describing create pool form",
              })}
            </p>
            <div
              data-h2-display="b(flex)"
              data-h2-flex-direction="b(column) s(row)"
            >
              <div data-h2-padding="s(right, xs)">
                <Select
                  id="classification"
                  label={intl.formatMessage({
                    defaultMessage: "Starting group and level",
                    description:
                      "Label displayed on the pool form classification field.",
                  })}
                  name="classification"
                  nullSelection={intl.formatMessage({
                    defaultMessage: "Select a classification...",
                    description:
                      "Placeholder displayed on the pool form classification field.",
                  })}
                  options={GenericJobTitlesSorted.map((value) => ({
                    value,
                    label: intl.formatMessage(
                      getGenericJobTitlesWithClassification(value),
                    ),
                  }))}
                  rules={{
                    required: intl.formatMessage(errorMessages.required),
                  }}
                />
              </div>
              <div>
                <Select
                  id="stream"
                  label={intl.formatMessage({
                    defaultMessage: "Streams",
                    description:
                      "Label displayed on the pool form streams field.",
                  })}
                  name="stream"
                  nullSelection={intl.formatMessage({
                    defaultMessage: "Select a stream...",
                    description:
                      "Placeholder displayed on the pool form stream field.",
                  })}
                  options={GenericJobTitlesSorted.map((value) => ({
                    value,
                    label: intl.formatMessage(
                      getGenericJobTitlesWithClassification(value),
                    ),
                  }))}
                  rules={{
                    required: intl.formatMessage(errorMessages.required),
                  }}
                />
              </div>
            </div>
            <Input
              id="key"
              name="key"
              label={intl.formatMessage({
                defaultMessage: "Key",
                description: "Label displayed on the pool form name key field.",
              })}
              type="text"
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
              context={intl.formatMessage({
                defaultMessage:
                  "The 'key' is a string that uniquely identifies a Pool. It's auto-generated based on the pool's group and job title.",
                description: "Context displayed on the pool form key field.",
              })}
            />
            <Submit
              text={intl.formatMessage({
                defaultMessage: "Create new pool",
                description:
                  "Label displayed on submit button for new pool form.",
              })}
            />
          </form>
        </FormProvider>
      </div>

      <div data-h2-margin="b(top, l)">
        <Link
          type="button"
          href={paths.poolTable()}
          mode="outline"
          color="primary"
        >
          {intl.formatMessage({
            defaultMessage: "Cancel and go back",
            description: "Label displayed on cancel button for new pool form.",
          })}
        </Link>
      </div>
    </section>
  );
};

const CreatePool: React.FunctionComponent = () => {
  const [lookupResult] = useGetCreatePoolDataQuery();
  const [genericJobTitlesQuery] = useGetGenericJobTitlesQuery();
  const { data: lookupdata2 } = genericJobTitlesQuery;
  const { data: lookupData, fetching, error } = lookupResult;
  const classifications: Classification[] | [] =
    lookupData?.classifications.filter(notEmpty) ?? [];
  const cmoAssets: CmoAsset[] = lookupData?.cmoAssets.filter(notEmpty) ?? [];
  const users: User[] = lookupData?.users.filter(notEmpty) ?? [];
  const genericJobTitles: GenericJobTitle[] | [] =
    lookupdata2?.genericJobTitles.filter(notEmpty) ?? [];

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
          genericJobTitles={genericJobTitles}
        />
      </DashboardContentContainer>
    </Pending>
  );
};

export default CreatePool;
