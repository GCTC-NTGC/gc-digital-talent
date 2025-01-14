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
import { unpackMaybes } from "@gc-digital-talent/helpers";

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
}

export const UpdateWorkStreamForm = ({
  query,
  communityOptions,
}: UpdateWorkStreamProps) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const paths = useRoutes();
  const [, executeMutation] = useMutation(UpdateWorkStream_Mutation);
  const workStream = getFragment(WorkStreamForm_Fragment, query);

  const methods = useForm<FormValues>({
    defaultValues: {
      name: workStream.name,
      plainLanguageName: workStream.plainLanguageName,
      community: workStream.community?.id,
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

  const workStreamName = getLocalizedName(workStream.name, intl);

  const navigationCrumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(pageTitles.workStreams),
        url: paths.workStreamTable(),
      },
      {
        label: workStreamName,
        url: paths.workStreamView(workStream.id),
      },
      ...(workStream.id
        ? [
            {
              label: intl.formatMessage({
                defaultMessage: "Edit<hidden> work stream</hidden>",
                id: "da/TLc",
                description:
                  "Breadcrumb title for the edit work stream page link.",
              }),
              url: paths.workStreamUpdate(workStream.id),
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

  return (
    <>
      <SEO title={pageTitle} />
      <Hero title={pageTitle} crumbs={navigationCrumbs} overlap centered>
        <CardBasic data-h2-margin-bottom="base(x3)">
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
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
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
                  href={paths.workStreamView(workStream.id)}
                >
                  {intl.formatMessage(commonMessages.cancel)}
                </Link>
              </div>
            </form>
          </FormProvider>
        </CardBasic>
      </Hero>
    </>
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

const UpdateWorkStreamPage = () => {
  const intl = useIntl();
  const { workStreamId } = useRequiredParams<RouteParams>("workStreamId");
  const [{ data: workStreamData, fetching, error }] = useQuery<WorkStreamQuery>(
    {
      query: WorkStream_Query,
      variables: { id: workStreamId },
    },
  );

  const communityOptions: OptGroupOrOption[] =
    unpackMaybes(workStreamData?.communities).map(({ id, name }) => ({
      value: id,
      label: getLocalizedName(name, intl),
    })) ?? [];

  return (
    <Pending fetching={fetching} error={error}>
      {workStreamData?.workStream ? (
        <UpdateWorkStreamForm
          query={workStreamData.workStream}
          communityOptions={communityOptions}
        />
      ) : (
        <NotFound headingMessage={intl.formatMessage(commonMessages.notFound)}>
          <p>
            {intl.formatMessage(
              {
                defaultMessage: "Work stream {workStreamId} not found.",
                id: "PzQ0E1",
                description: "Message displayed for work stream not found.",
              },
              { workStreamId },
            )}
          </p>
        </NotFound>
      )}
    </Pending>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.PlatformAdmin]}>
    <UpdateWorkStreamPage />
  </RequireAuth>
);

Component.displayName = "AdminUpdateWorkStreamPage";

export default UpdateWorkStreamPage;
