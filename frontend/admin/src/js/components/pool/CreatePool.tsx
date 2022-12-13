import * as React from "react";
import { useNavigate } from "react-router-dom";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { Squares2X2Icon } from "@heroicons/react/24/outline";

import { toast } from "@common/components/Toast";
import { Select, Submit } from "@common/components/form";
import { unpackMaybes } from "@common/helpers/formUtils";
import { errorMessages, commonMessages } from "@common/messages";
import { getGenericJobTitlesWithClassification } from "@common/constants/localizedConstants";
import Pending from "@common/components/Pending";
import PageHeader from "@common/components/PageHeader/PageHeader";
import Breadcrumbs, {
  BreadcrumbsProps,
} from "@common/components/Breadcrumbs/Breadcrumbs";
import Link from "@common/components/Link/Link";
import SEO from "@common/components/SEO/SEO";
import { getLocalizedName } from "@common/helpers/localize";

import { useAdminRoutes } from "../../adminRoutes";
import {
  CreatePoolAdvertisementInput,
  useCreatePoolAdvertisementMutation,
  CreatePoolAdvertisementMutation,
  useGetMePoolCreationQuery,
  GenericJobTitleKey,
  Classification,
} from "../../api/generated";
import DashboardContentContainer from "../DashboardContentContainer";

type Option<V> = { value: V; label: string };

type FormValues = {
  classification: string[];
};

interface GenericJobTitle {
  key: GenericJobTitleKey;
  id: string;
  classificationId: string;
}

interface CreatePoolFormProps {
  userId: string;
  genericJobTitles: GenericJobTitle[];
  classificationsArray: Classification[];
  handleCreatePool: (
    userId: string,
    data: CreatePoolAdvertisementInput,
  ) => Promise<CreatePoolAdvertisementMutation["createPoolAdvertisement"]>;
}

export const CreatePoolForm: React.FunctionComponent<CreatePoolFormProps> = ({
  userId,
  genericJobTitles,
  classificationsArray,
  handleCreatePool,
}) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const paths = useAdminRoutes();
  const methods = useForm<FormValues>();
  const { handleSubmit } = methods;

  // submission section, and navigate to edit the created pool
  const formValuesToSubmitData = (
    values: FormValues,
  ): CreatePoolAdvertisementInput => ({
    classifications: {
      sync: values.classification,
    },
  });
  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    await handleCreatePool(userId, formValuesToSubmitData(data))
      .then((result) => {
        if (result) {
          navigate(paths.poolEdit(result.id));
          toast.success(
            intl.formatMessage({
              defaultMessage: "Pool created successfully!",
              id: "wZ91g+",
              description:
                "Message displayed to user after pool is created successfully.",
            }),
          );
        }
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

  const links = [
    {
      title: intl.formatMessage({
        defaultMessage: "My Pools",
        id: "7N+tQw",
        description: "Breadcrumb title for the pools page link.",
      }),
      href: paths.poolTable(),
    },
    {
      title: intl.formatMessage({
        defaultMessage: `New Pool`,
        id: "iQzlmB",
        description: "New pool breadcrumb text",
      }),
    },
  ] as BreadcrumbsProps["links"];

  // NOTICE NOTICE NOTICE NOTICE NOTICE
  // how the CreatePool will function, in example, Generic Job Classifications vs regular Classifications is undecided so code segments are left in despite being unused
  // TODO RESOLVE THIS

  // create the options for the select input, and ensure classification Ids are attached to each option
  // take care not to try and attach generic job title Id instead, wrong Id throws confusing sql errors
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const jobTitleOptions: Option<string>[] = genericJobTitles.map(
    ({ key, classificationId }) => ({
      value: classificationId,
      label:
        intl.formatMessage(getGenericJobTitlesWithClassification(key)) ??
        intl.formatMessage(commonMessages.nameNotLoaded),
    }),
  );

  // recycled from EditPool
  const classificationOptions: Option<string>[] = classificationsArray
    .map(({ id, group, level, name }) => ({
      value: id,
      label: `${group}-0${level} (${getLocalizedName(name, intl)})`,
    }))
    .sort((a, b) => (a.label >= b.label ? 1 : -1));

  return (
    <section data-h2-container="base(left, small, 0)">
      <PageHeader icon={Squares2X2Icon}>
        {intl.formatMessage({
          defaultMessage: "Create New Pool",
          id: "+umNAP",
          description: "Header for page to create pool advertisements",
        })}
      </PageHeader>
      <Breadcrumbs links={links} />
      <div data-h2-margin="base(x2, 0, 0, 0)">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <h2 data-h2-margin="base(x.25, 0)" data-h2-font-size="base(h3)">
              {intl.formatMessage({
                defaultMessage: "Start blank job poster",
                id: "gv1Hwu",
                description: "Form header to create new pool",
              })}
            </h2>
            <p>
              {intl.formatMessage({
                defaultMessage: "Create a new job poster from scratch",
                id: "QodYZE",
                description: "Form blurb describing create pool form",
              })}
            </p>
            <Select
              id="classification"
              label={intl.formatMessage({
                defaultMessage: "Starting group and level",
                id: "gN5gy5",
                description:
                  "Label displayed on the pool form classification field.",
              })}
              name="classification"
              nullSelection={intl.formatMessage({
                defaultMessage: "Select a classification...",
                id: "7aG86f",
                description:
                  "Placeholder displayed on the pool form classification field.",
              })}
              options={classificationOptions}
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
            <Submit
              color="cta"
              text={intl.formatMessage({
                defaultMessage: "Create new pool",
                id: "TLl20s",
                description:
                  "Label displayed on submit button for new pool form.",
              })}
            />
          </form>
        </FormProvider>
      </div>

      <div data-h2-margin="base(x2, 0, 0, 0)">
        <Link
          type="button"
          href={paths.poolTable()}
          mode="outline"
          color="primary"
        >
          {intl.formatMessage({
            defaultMessage: "Cancel and go back",
            id: "dJxNRU",
            description: "Label displayed on cancel button for new pool form.",
          })}
        </Link>
      </div>
    </section>
  );
};

const CreatePool: React.FunctionComponent = () => {
  const intl = useIntl();
  const [lookupResult] = useGetMePoolCreationQuery();
  const { data: lookupData, fetching, error } = lookupResult;

  // current user -> type change to only string
  const userIdQueryUntyped = lookupData?.me?.id;
  const restrictUserType = (user: string | undefined): string => {
    if (user) {
      return user;
    }
    return "";
  };
  const userIdQuery = restrictUserType(userIdQueryUntyped);

  // get rid of all those annoying Maybes, make sure classifications isn't a maybe either
  const jobTitlesData = unpackMaybes(lookupData?.genericJobTitles);
  const jobTitlesMapped = jobTitlesData
    ? jobTitlesData.map((jobTitle) => {
        return {
          key: jobTitle.key,
          id: jobTitle.id,
          classificationId: jobTitle.classification
            ? jobTitle.classification.id
            : "",
        };
      })
    : [];

  // fetched all classifications
  const classificationsData = unpackMaybes(lookupData?.classifications);

  const [, executeMutation] = useCreatePoolAdvertisementMutation();
  const handleCreatePool = (
    userId: string,
    data: CreatePoolAdvertisementInput,
  ) =>
    executeMutation({ userId, poolAdvertisement: data }).then((result) => {
      if (result.data?.createPoolAdvertisement) {
        return result.data?.createPoolAdvertisement;
      }
      return Promise.reject(result.error);
    });

  return (
    <>
      <SEO
        title={intl.formatMessage({
          defaultMessage: "Create pool",
          id: "zwYuly",
          description: "Page title for the pool creation page",
        })}
      />
      <Pending fetching={fetching} error={error}>
        <DashboardContentContainer>
          <CreatePoolForm
            userId={userIdQuery}
            genericJobTitles={jobTitlesMapped}
            classificationsArray={classificationsData}
            handleCreatePool={handleCreatePool}
          />
        </DashboardContentContainer>
      </Pending>
    </>
  );
};

export default CreatePool;
