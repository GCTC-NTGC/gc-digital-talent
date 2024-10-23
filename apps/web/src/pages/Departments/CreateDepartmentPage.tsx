import { useNavigate } from "react-router-dom";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { useMutation } from "urql";
import IdentificationIcon from "@heroicons/react/24/outline/IdentificationIcon";

import { toast } from "@gc-digital-talent/toast";
import { Input, Submit } from "@gc-digital-talent/forms";
import { errorMessages } from "@gc-digital-talent/i18n";
import { graphql, CreateDepartmentInput } from "@gc-digital-talent/graphql";
import { ROLE_NAME } from "@gc-digital-talent/auth";
import { Heading, Link, Separator } from "@gc-digital-talent/ui";

import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import pageTitles from "~/messages/pageTitles";
import useReturnPath from "~/hooks/useReturnPath";
import Hero from "~/components/Hero";

import { labels } from "./messages";

type FormValues = CreateDepartmentInput;

interface CreateDepartmentProps {
  handleCreateDepartment: (data: FormValues) => Promise<CreateDepartmentInput>;
}

export const CreateDepartmentForm = ({
  handleCreateDepartment,
}: CreateDepartmentProps) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const paths = useRoutes();
  const methods = useForm<FormValues>();
  const { handleSubmit } = methods;

  const navigateTo = useReturnPath(paths.departmentTable());

  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    return handleCreateDepartment({
      departmentNumber: Number(data.departmentNumber),
      name: data.name,
    })
      .then(() => {
        navigate(navigateTo);
        toast.success(
          intl.formatMessage({
            defaultMessage: "Department created successfully!",
            id: "yGlG9e",
            description:
              "Message displayed to user after department is created successfully.",
          }),
        );
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: creating department failed",
            id: "VaVo2t",
            description:
              "Message displayed to user after department fails to get created.",
          }),
        );
      });
  };

  return (
    <>
      <div
        data-h2-display="base(flex)"
        data-h2-justify-content="base(center) p-tablet(flex-start)"
      >
        <Heading
          level="h2"
          color="primary"
          Icon={IdentificationIcon}
          data-h2-margin="base(0, 0, x1.5, 0)"
        >
          {intl.formatMessage({
            defaultMessage: "Department information",
            id: "eNTKLK",
            description: "Heading for the 'create a department' form",
          })}
        </Heading>
      </div>

      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          data-h2-display="base(flex)"
          data-h2-flex-direction="base(column)"
          data-h2-gap="base(x1.5)"
        >
          <div
            data-h2-display="base(grid)"
            data-h2-grid-template-columns="p-tablet(repeat(2, 1fr))"
            data-h2-gap="base(x1)"
          >
            <Input
              id="name_en"
              name="name.en"
              label={intl.formatMessage(labels.nameEn)}
              type="text"
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
            <Input
              id="name_fr"
              name="name.fr"
              label={intl.formatMessage(labels.nameFr)}
              type="text"
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
            <div data-h2-grid-column="p-tablet(span 2)">
              <Input
                id="departmentNumber"
                name="departmentNumber"
                label={intl.formatMessage(labels.departmentNumber)}
                type="number"
                rules={{
                  required: intl.formatMessage(errorMessages.required),
                }}
                min="0"
              />
            </div>
          </div>
          <Separator
            decorative
            data-h2-margin="base(0)"
            data-h2-color="base(gray.light)"
          />
          <div
            data-h2-display="base(flex)"
            data-h2-flex-direction="base(column) p-tablet(row)"
            data-h2-gap="base(x1)"
            data-h2-align-items="base(center)"
          >
            <Submit
              text={intl.formatMessage({
                defaultMessage: "Create department",
                id: "j/qPu0",
                description: "Button label to create a new department",
              })}
            />
            <Link color="warning" mode="inline" href={paths.departmentTable()}>
              {intl.formatMessage({
                defaultMessage: "Cancel and go back to departments",
                id: "uqI3Vf",
                description: "Button label to return to the departments table",
              })}
            </Link>
          </div>
        </form>
      </FormProvider>
    </>
  );
};

const CreateDepartment_Mutation = graphql(/* GraphQL */ `
  mutation CreateDepartment($department: CreateDepartmentInput!) {
    createDepartment(department: $department) {
      id
      departmentNumber
      name {
        en
        fr
      }
    }
  }
`);

const CreateDepartmentPage = () => {
  const intl = useIntl();
  const routes = useRoutes();
  const [, executeMutation] = useMutation(CreateDepartment_Mutation);
  const handleCreateDepartment = (data: CreateDepartmentInput) =>
    executeMutation({ department: data }).then((result) => {
      if (result.data?.createDepartment) {
        return result.data?.createDepartment;
      }
      return Promise.reject(new Error(result.error?.toString()));
    });

  const navigationCrumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(pageTitles.departments),
        url: routes.departmentTable(),
      },
      {
        label: intl.formatMessage({
          defaultMessage: "Create<hidden> department</hidden>",
          id: "1XaX86",
          description: "Breadcrumb title for the create department page link.",
        }),
        url: routes.departmentCreate(),
      },
    ],
    isAdmin: true,
  });

  const pageTitle = intl.formatMessage({
    defaultMessage: "Create a department",
    id: "ZpYj8o",
    description: "Page title for the department creation page",
  });

  return (
    <>
      <SEO title={pageTitle} />
      <Hero title={pageTitle} crumbs={navigationCrumbs} overlap centered>
        <div
          data-h2-wrapper="base(center, large, x1) p-tablet(center, large, x2)"
          data-h2-radius="base(rounded)"
          data-h2-background-color="base(foreground)"
          data-h2-padding="base(x2, x1)"
          data-h2-shadow="base(s)"
        >
          <CreateDepartmentForm
            handleCreateDepartment={handleCreateDepartment}
          />
        </div>
      </Hero>
    </>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.PlatformAdmin]}>
    <CreateDepartmentPage />
  </RequireAuth>
);

Component.displayName = "AdminCreateDepartmentPage";

export default CreateDepartmentPage;
