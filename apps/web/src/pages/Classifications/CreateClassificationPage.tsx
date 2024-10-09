import { useNavigate } from "react-router-dom";
import upperCase from "lodash/upperCase";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { useMutation } from "urql";

import { Input, Select, Submit } from "@gc-digital-talent/forms";
import { toast } from "@gc-digital-talent/toast";
import { errorMessages, uiMessages } from "@gc-digital-talent/i18n";
import { graphql, CreateClassificationInput } from "@gc-digital-talent/graphql";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import AdminHero from "~/components/Hero/AdminHero";
import adminMessages from "~/messages/adminMessages";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import pageTitles from "~/messages/pageTitles";
import useReturnPath from "~/hooks/useReturnPath";

type FormValues = CreateClassificationInput;
interface CreateClassificationFormProps {
  handleCreateClassification: (data: FormValues) => Promise<FormValues>;
}

export const CreateClassificationForm = ({
  handleCreateClassification,
}: CreateClassificationFormProps) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const paths = useRoutes();
  const methods = useForm<FormValues>();
  const { handleSubmit, watch } = methods;
  const watchMinSalary = watch("minSalary");

  const navigateTo = useReturnPath(paths.classificationTable());

  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    const classification: FormValues = {
      ...data,
      group: upperCase(data.group),
      level: Number(data.level),
      minSalary: Number(data.minSalary),
      maxSalary: Number(data.maxSalary),
    };
    return handleCreateClassification(classification)
      .then(() => {
        navigate(navigateTo);
        toast.success(
          intl.formatMessage({
            defaultMessage: "Classification created successfully!",
            id: "3D/wxC",
            description:
              "Message displayed to user after classification is created successfully.",
          }),
        );
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: creating classification failed",
            id: "5jFkhf",
            description:
              "Message displayed to user after classification fails to get created.",
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

const CreateClassification_Mutation = graphql(/* GraphQL */ `
  mutation CreateClassification($classification: CreateClassificationInput!) {
    createClassification(classification: $classification) {
      name {
        en
        fr
      }
      group
      level
      minSalary
      maxSalary
    }
  }
`);

const CreateClassification = () => {
  const intl = useIntl();
  const routes = useRoutes();
  const [, executeMutation] = useMutation(CreateClassification_Mutation);
  const handleCreateClassification = (data: CreateClassificationInput) =>
    executeMutation({ classification: data }).then((result) => {
      if (result.data?.createClassification) {
        return result.data?.createClassification;
      }
      return Promise.reject(result.error);
    });

  const navigationCrumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(pageTitles.classifications),
        url: routes.classificationTable(),
      },
      {
        label: intl.formatMessage({
          defaultMessage: "Create<hidden> classification</hidden>",
          id: "E8BMJW",
          description:
            "Breadcrumb title for the create classification page link.",
        }),
        url: routes.classificationCreate(),
      },
    ],
    isAdmin: true,
  });

  const pageTitle = intl.formatMessage({
    defaultMessage: "Create classification",
    id: "fYyK2p",
    description: "Page title for the classification creation page",
  });

  return (
    <>
      <SEO title={pageTitle} />
      <AdminHero
        title={pageTitle}
        nav={{ mode: "crumbs", items: navigationCrumbs }}
      />
      <AdminContentWrapper>
        <CreateClassificationForm
          handleCreateClassification={handleCreateClassification}
        />
      </AdminContentWrapper>
    </>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.PlatformAdmin]}>
    <CreateClassification />
  </RequireAuth>
);

Component.displayName = "AdminCreateClassificationPage";

export default CreateClassification;
