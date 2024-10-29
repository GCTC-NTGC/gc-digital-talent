import { useNavigate } from "react-router-dom";
import pick from "lodash/pick";
import upperCase from "lodash/upperCase";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { useMutation, useQuery } from "urql";

import { Pending, NotFound } from "@gc-digital-talent/ui";
import { toast } from "@gc-digital-talent/toast";
import { Input, Select, Submit } from "@gc-digital-talent/forms";
import {
  errorMessages,
  commonMessages,
  uiMessages,
} from "@gc-digital-talent/i18n";
import {
  graphql,
  Scalars,
  UpdateClassificationInput,
  FragmentType,
  getFragment,
} from "@gc-digital-talent/graphql";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import useRequiredParams from "~/hooks/useRequiredParams";
import AdminHero from "~/components/HeroDeprecated/AdminHero";
import adminMessages from "~/messages/adminMessages";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import pageTitles from "~/messages/pageTitles";
import useReturnPath from "~/hooks/useReturnPath";

export const ClassificationForm_Fragment = graphql(/* GraphQL */ `
  fragment ClassificationForm on Classification {
    id
    name {
      en
      fr
    }
    group
    level
    minSalary
    maxSalary
  }
`);

type FormValues = UpdateClassificationInput;
interface UpdateClassificationFormProps {
  query: FragmentType<typeof ClassificationForm_Fragment>;
  onUpdateClassification: (id: string, data: FormValues) => Promise<FormValues>;
}

export const UpdateClassificationForm = ({
  query,
  onUpdateClassification,
}: UpdateClassificationFormProps) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const paths = useRoutes();
  const initialClassification = getFragment(ClassificationForm_Fragment, query);
  const methods = useForm<FormValues>({
    defaultValues: initialClassification,
  });
  const { handleSubmit, watch } = methods;
  const watchMinSalary = watch("minSalary");

  const navigateTo = useReturnPath(paths.classificationTable());

  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    const classification: FormValues = {
      name: {
        en: data.name?.en,
        fr: data.name?.fr,
      },
      group: upperCase(data.group ?? ""),
      minSalary: Number(data.minSalary),
      maxSalary: Number(data.maxSalary),
    };
    return onUpdateClassification(initialClassification.id, classification)
      .then(() => {
        navigate(navigateTo);
        toast.success(
          intl.formatMessage({
            defaultMessage: "Classification updated successfully!",
            id: "jJCDGc",
            description:
              "Message displayed to user after classification is updated successfully.",
          }),
        );
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: updating classification failed",
            id: "LEVK8x",
            description:
              "Message displayed to user after classification fails to get updated.",
          }),
        );
      });
  };
  return (
    <section data-h2-wrapper="base(left, s)">
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          data-h2-display="base(flex)"
          data-h2-flex-direction="base(column)"
          data-h2-gap="base(x.5 0)"
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
            id="group"
            name="group"
            label={intl.formatMessage({
              defaultMessage: "Group",
              id: "hgxH8y",
              description:
                "Label displayed for the classification form group field.",
            })}
            type="text"
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
          />
          <Select
            id="level"
            name="level"
            label={intl.formatMessage({
              defaultMessage: "Level",
              id: "bVRixs",
              description:
                "Label displayed on the classification form level field.",
            })}
            nullSelection={intl.formatMessage(
              uiMessages.nullSelectionOptionLevel,
            )}
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
            options={[
              { value: 1, label: "1" },
              { value: 2, label: "2" },
              { value: 3, label: "3" },
              { value: 4, label: "4" },
              { value: 5, label: "5" },
              { value: 6, label: "6" },
              { value: 7, label: "7" },
              { value: 8, label: "8" },
              { value: 9, label: "9" },
            ]}
            disabled
          />
          <Input
            id="minSalary"
            name="minSalary"
            label={intl.formatMessage({
              defaultMessage: "Minimum Salary",
              id: "3b6cy/",
              description:
                "Label displayed for the classification form min salary field.",
            })}
            type="number"
            rules={{
              required: intl.formatMessage(errorMessages.required),
              min: {
                value: 0,
                message: intl.formatMessage(errorMessages.mustBeGreater, {
                  value: 0,
                }),
              },
            }}
          />
          <Input
            id="maxSalary"
            name="maxSalary"
            label={intl.formatMessage({
              defaultMessage: "Maximum Salary",
              id: "gpKGjq",
              description:
                "Label displayed for the classification form max salary field.",
            })}
            type="number"
            rules={{
              required: intl.formatMessage(errorMessages.required),
              min: {
                value: watchMinSalary ?? 0,
                message: intl.formatMessage(errorMessages.mustBeGreater, {
                  value: watchMinSalary ?? 0,
                }),
              },
            }}
          />
          <div data-h2-align-self="base(flex-start)">
            <Submit />
          </div>
        </form>
      </FormProvider>
    </section>
  );
};

interface RouteParams extends Record<string, string> {
  classificationId: Scalars["ID"]["output"];
}

const Classification_Query = graphql(/* GraphQL */ `
  query Classification($id: UUID!) {
    classification(id: $id) {
      ...ClassificationForm
    }
  }
`);

const UpdateClassification_Mutation = graphql(/* GraphQL */ `
  mutation UpdateClassification(
    $id: ID!
    $classification: UpdateClassificationInput!
  ) {
    updateClassification(id: $id, classification: $classification) {
      id
      level
      group
    }
  }
`);

const UpdateClassification = () => {
  const intl = useIntl();
  const routes = useRoutes();
  const { classificationId } =
    useRequiredParams<RouteParams>("classificationId");
  const [{ data: classificationData, fetching, error }] = useQuery({
    query: Classification_Query,
    variables: { id: classificationId },
  });

  const [, executeMutation] = useMutation(UpdateClassification_Mutation);
  const handleUpdateClassification = (
    id: string,
    data: UpdateClassificationInput,
  ) =>
    /* We must pick only the fields belonging to UpdateClassificationInput, because its possible
       the data object contains other props at runtime, and this will cause the
       graphql operation to fail. */
    executeMutation({
      id,
      classification: pick(data, ["name", "group", "minSalary", "maxSalary"]),
    }).then((result) => {
      if (result.data?.updateClassification) {
        return Promise.resolve(result.data?.updateClassification);
      }
      return Promise.reject(new Error(result.error?.toString()));
    });

  const navigationCrumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(pageTitles.classifications),
        url: routes.classificationTable(),
      },
      ...(classificationId
        ? [
            {
              label: intl.formatMessage({
                defaultMessage: "Edit<hidden> classification</hidden>",
                id: "ow4z7W",
                description:
                  "Breadcrumb title for the edit classification page link.",
              }),
              url: routes.classificationUpdate(classificationId),
            },
          ]
        : []),
    ],
    isAdmin: true,
  });

  const pageTitle = intl.formatMessage(pageTitles.classifications);

  return (
    <>
      <SEO title={pageTitle} />
      <AdminHero
        title={pageTitle}
        nav={{ mode: "crumbs", items: navigationCrumbs }}
      />
      <AdminContentWrapper>
        <Pending fetching={fetching} error={error}>
          {classificationData?.classification ? (
            <UpdateClassificationForm
              query={classificationData?.classification}
              onUpdateClassification={handleUpdateClassification}
            />
          ) : (
            <NotFound
              headingMessage={intl.formatMessage(commonMessages.notFound)}
            >
              <p>
                {intl.formatMessage(
                  {
                    defaultMessage:
                      "Classification {classificationId} not found.",
                    id: "b3VnhM",
                    description:
                      "Message displayed for classification not found.",
                  },
                  { classificationId },
                )}
              </p>
            </NotFound>
          )}
        </Pending>
      </AdminContentWrapper>
    </>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.PlatformAdmin]}>
    <UpdateClassification />
  </RequireAuth>
);

Component.displayName = "AdminUpdateClassificationPage";

export default UpdateClassification;
