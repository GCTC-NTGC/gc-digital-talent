import { useNavigate } from "react-router";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { useMutation, useQuery } from "urql";
import IdentificationIcon from "@heroicons/react/24/outline/IdentificationIcon";

import { toast } from "@gc-digital-talent/toast";
import {
  Input,
  OptGroupOrOption,
  Select,
  Submit,
} from "@gc-digital-talent/forms";
import {
  errorMessages,
  commonMessages,
  formMessages,
  getLocalizedName,
} from "@gc-digital-talent/i18n";
import {
  Pending,
  NotFound,
  Heading,
  Link,
  CardSeparator,
  CardBasic,
} from "@gc-digital-talent/ui";
import {
  FragmentType,
  InputMaybe,
  LocalizedStringInput,
  Scalars,
  UpdateWorkStreamInput,
  WorkStreamQuery,
  getFragment,
  graphql,
} from "@gc-digital-talent/graphql";
import { ROLE_NAME } from "@gc-digital-talent/auth";
import { notEmpty } from "@gc-digital-talent/helpers";

import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import useRequiredParams from "~/hooks/useRequiredParams";
import adminMessages from "~/messages/adminMessages";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import pageTitles from "~/messages/pageTitles";
import Hero from "~/components/Hero";

const UpdateWorkStream_Mutation = graphql(/* GraphQL */ `
  mutation UpdateWorkStream($id: UUID!, $workStream: UpdateWorkStreamInput!) {
    updateWorkStream(id: $id, workStream: $workStream) {
      id
    }
  }
`);

export const WorkStreamForm_Fragment = graphql(/* GraphQL */ `
  fragment WorkStreamForm on WorkStream {
    id
    name {
      en
      fr
    }
    plainLanguageName {
      en
      fr
    }
    community {
      id
      key
      name {
        en
        fr
      }
    }
  }
`);

interface FormValues {
  key?: InputMaybe<Scalars["String"]["input"]>;
  name?: InputMaybe<LocalizedStringInput>;
  plainLanguageName?: InputMaybe<LocalizedStringInput>;
  community: string;
}

const formValuesToSubmitData = (data: FormValues): UpdateWorkStreamInput => {
  const communityId = data.community;
  return {
    name: {
      en: data.name?.en,
      fr: data.name?.fr,
    },
    plainLanguageName: {
      en: data.plainLanguageName?.en,
      fr: data.plainLanguageName?.fr,
    },
    community: { connect: communityId },
  };
};

interface UpdateWorkStreamProps {
  query: FragmentType<typeof WorkStreamForm_Fragment>;
  communityOptions: OptGroupOrOption[];
  handleWorkStreamUpdate: (
    id: string,
    data: UpdateWorkStreamInput,
  ) => Promise<FragmentType<typeof WorkStreamForm_Fragment>>;
}

export const UpdateWorkStreamForm = ({
  query,
  communityOptions,
  handleWorkStreamUpdate,
}: UpdateWorkStreamProps) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const paths = useRoutes();
  const initialWorkStream = getFragment(WorkStreamForm_Fragment, query);
  const methods = useForm<FormValues>({
    defaultValues: {
      name: initialWorkStream.name,
      plainLanguageName: initialWorkStream.plainLanguageName,
      community: initialWorkStream.community?.id,
    },
  });
  const { handleSubmit } = methods;

  const handleError = () => {
    toast.error(
      intl.formatMessage({
        defaultMessage: "Error: updating work stream failed",
        id: "uNKq32",
        description:
          "Message displayed to user after work stream fails to get updated.",
      }),
    );
  };

  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    return executeMutation({
      id: workStream.id,
      workStream: formValuesToSubmitData(data),
    })
      .then(async (result) => {
        if (result.data?.updateWorkStream) {
          await navigate(
            paths.workStreamView(result.data?.updateWorkStream.id),
          );
        toast.success(
          intl.formatMessage({
            defaultMessage: "Work stream updated successfully!",
            id: "0cieq3",
            description:
              "Message displayed to user after work stream is updated successfully.",
          }),
        );
        } else {
          handleError();
        }
      })
      .catch(handleError);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardBasic>
          <div
            data-h2-display="base(flex)"
            data-h2-justify-content="base(center) p-tablet(flex-start)"
          >
            <Heading
              level="h2"
              color="primary"
              Icon={IdentificationIcon}
              data-h2-margin="base(0, 0, x1.5, 0)"
              data-h2-font-weight="base(400)"
            >
              {intl.formatMessage({
                defaultMessage: "Work stream information",
                id: "3D8drd",
                description: "Heading for the 'update a work stream' form",
              })}
            </Heading>
          </div>
          <div
            data-h2-display="base(grid)"
            data-h2-grid-template-columns="p-tablet(repeat(2, 1fr))"
            data-h2-gap="base(x1)"
          >
            <Input
              id="name_en"
              name="name.en"
              label={intl.formatMessage(adminMessages.nameEn)}
              type="text"
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
            <Input
              id="name_fr"
              name="name.fr"
              label={intl.formatMessage(adminMessages.nameFr)}
              type="text"
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
            <Input
              id="plainLanguageName_en"
              name="plainLanguageName.en"
              label={intl.formatMessage({
                defaultMessage: "Plain language alternative (English)",
                id: "yW8bEZ",
                description: "Label for plain language alt english input",
              })}
              type="text"
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
            <Input
              id="plainLanguageName_fr"
              name="plainLanguageName.fr"
              label={intl.formatMessage({
                defaultMessage: "Plain language alternative (French)",
                id: "OKCVhm",
                description: "Label for plain language alt french input",
              })}
              type="text"
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
            <div data-h2-grid-column="p-tablet(span 2)">
              <Select
                id="community"
                name="community"
                label={intl.formatMessage(adminMessages.community)}
                nullSelection={intl.formatMessage(
                  commonMessages.selectACommunity,
                )}
                rules={{
                  required: intl.formatMessage(errorMessages.required),
                }}
                options={communityOptions}
              />
            </div>
          </div>
          <CardSeparator />
          <div
            data-h2-display="base(flex)"
            data-h2-flex-direction="base(column) p-tablet(row)"
            data-h2-gap="base(x1)"
            data-h2-align-items="base(center)"
          >
            <Submit text={intl.formatMessage(formMessages.saveChanges)} />
            <Link
              color="warning"
              mode="inline"
              href={paths.workStreamView(initialWorkStream.id)}
            >
              {intl.formatMessage(commonMessages.cancel)}
            </Link>
          </div>
        </CardBasic>
      </form>
    </FormProvider>
  );
};

interface RouteParams extends Record<string, string> {
  workStreamId: Scalars["ID"]["output"];
}

const WorkStream_Query = graphql(/* GraphQL */ `
  query WorkStream($id: UUID!) {
    workStream(id: $id) {
      name {
        en
        fr
      }
      ...WorkStreamForm
    }
    communities {
      id
      name {
        en
        fr
      }
    }
  }
`);

const UpdateWorkStream_Mutation = graphql(/* GraphQL */ `
  mutation UpdateWorkStream($id: UUID!, $workStream: UpdateWorkStreamInput!) {
    updateWorkStream(id: $id, workStream: $workStream) {
      ...WorkStreamForm
    }
  }
`);

const UpdateWorkStreamPage = () => {
  const intl = useIntl();
  const routes = useRoutes();
  const { workStreamId } = useRequiredParams<RouteParams>("workStreamId");
  const [{ data: workStreamData, fetching, error }] = useQuery<WorkStreamQuery>(
    {
      query: WorkStream_Query,
      variables: { id: workStreamId },
    },
  );
  const [, executeMutation] = useMutation(UpdateWorkStream_Mutation);
  const handleWorkStreamUpdate = (id: string, data: UpdateWorkStreamInput) =>
    executeMutation({
      id,
      workStream: data,
    }).then((result) => {
      if (result.data?.updateWorkStream) {
        return result.data?.updateWorkStream;
      }
      return Promise.reject(new Error(result.error?.toString()));
    });

  const workStreamName = getLocalizedName(
    workStreamData?.workStream?.name,
    intl,
  );

  const navigationCrumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(pageTitles.workStreams),
        url: routes.workStreamTable(),
      },
      {
        label: workStreamName,
        url: routes.workStreamView(workStreamId),
      },
      ...(workStreamId
        ? [
            {
              label: intl.formatMessage({
                defaultMessage: "Edit<hidden> work stream</hidden>",
                id: "da/TLc",
                description:
                  "Breadcrumb title for the edit work stream page link.",
              }),
              url: routes.workStreamUpdate(workStreamId),
            },
          ]
        : []),
    ],
  });

  const pageTitle = intl.formatMessage({
    defaultMessage: "Edit a work stream",
    id: "4SdmnS",
    description: "Page title for the work stream edit page",
  });

  const communityOptions: OptGroupOrOption[] =
    workStreamData?.communities.filter(notEmpty).map(({ id, name }) => ({
      value: id,
      label: getLocalizedName(name, intl),
    })) ?? [];
  return (
    <>
      <SEO title={pageTitle} />
      <Hero title={pageTitle} crumbs={navigationCrumbs} overlap centered>
        <div data-h2-margin-bottom="base(x3)">
          <Pending fetching={fetching} error={error}>
            {workStreamData?.workStream ? (
              <UpdateWorkStreamForm
                query={workStreamData.workStream}
                communityOptions={communityOptions}
                handleWorkStreamUpdate={handleWorkStreamUpdate}
              />
            ) : (
              <NotFound
                headingMessage={intl.formatMessage(commonMessages.notFound)}
              >
                <p>
                  {intl.formatMessage(
                    {
                      defaultMessage: "Work stream {workStreamId} not found.",
                      id: "PzQ0E1",
                      description:
                        "Message displayed for work stream not found.",
                    },
                    { workStreamId },
                  )}
                </p>
              </NotFound>
            )}
          </Pending>
        </div>
      </Hero>
    </>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.PlatformAdmin]}>
    <UpdateWorkStreamPage />
  </RequireAuth>
);

Component.displayName = "AdminUpdateWorkStreamPage";

export default UpdateWorkStreamPage;
