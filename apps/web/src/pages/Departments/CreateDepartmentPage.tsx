import * as React from "react";
import { useNavigate } from "react-router-dom";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useIntl } from "react-intl";

import { toast } from "@gc-digital-talent/toast";
import { Input, Submit } from "@gc-digital-talent/forms";
import { errorMessages } from "@gc-digital-talent/i18n";
import { Heading } from "@gc-digital-talent/ui";

import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import {
  CreateDepartmentInput,
  CreateDepartmentMutation,
  useCreateDepartmentMutation,
} from "~/api/generated";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";

type FormValues = CreateDepartmentInput;

interface CreateDepartmentProps {
  handleCreateDepartment: (
    data: FormValues,
  ) => Promise<CreateDepartmentMutation["createDepartment"]>;
}

export const CreateDepartmentForm: React.FunctionComponent<
  CreateDepartmentProps
> = ({ handleCreateDepartment }) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const paths = useRoutes();
  const methods = useForm<FormValues>();
  const { handleSubmit } = methods;

  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    return handleCreateDepartment({
      departmentNumber: Number(data.departmentNumber),
      name: data.name,
    })
      .then(() => {
        navigate(paths.departmentTable());
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
    <section data-h2-container="base(left, s)">
      <Heading level="h1" size="h2">
        {intl.formatMessage({
          defaultMessage: "Create Department",
          id: "XBY4Fq",
          description: "Title displayed on the create a department form.",
        })}
      </Heading>
      <div>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              id="departmentNumber"
              name="departmentNumber"
              label={intl.formatMessage({
                defaultMessage: "Department #",
                id: "/YiBdv",
                description:
                  "Label displayed on the create a department form department number field.",
              })}
              type="number"
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
            <Input
              id="name_en"
              name="name.en"
              label={intl.formatMessage({
                defaultMessage: "Name (English)",
                id: "4boO/6",
                description:
                  "Label displayed on the create a department form name (English) field.",
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
                id: "c0n+2j",
                description:
                  "Label displayed on the create a department form name (French) field.",
              })}
              type="text"
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
            <Submit />
          </form>
        </FormProvider>
      </div>
    </section>
  );
};

const CreateDepartmentPage: React.FunctionComponent = () => {
  const intl = useIntl();
  const routes = useRoutes();
  const [, executeMutation] = useCreateDepartmentMutation();
  const handleCreateDepartment = (data: CreateDepartmentInput) =>
    executeMutation({ department: data }).then((result) => {
      if (result.data?.createDepartment) {
        return result.data?.createDepartment;
      }
      return Promise.reject(result.error);
    });

  const navigationCrumbs = [
    {
      label: intl.formatMessage({
        defaultMessage: "Home",
        id: "EBmWyo",
        description: "Link text for the home link in breadcrumbs.",
      }),
      url: routes.adminDashboard(),
    },
    {
      label: intl.formatMessage({
        defaultMessage: "Departments",
        id: "Ig9HmP",
        description: "Breadcrumb title for the departments page link.",
      }),
      url: routes.departmentTable(),
    },
    {
      label: intl.formatMessage({
        defaultMessage: "Create",
        id: "erC5vH",
        description: "Breadcrumb title for the create department page link.",
      }),
      url: routes.departmentCreate(),
    },
  ];

  return (
    <AdminContentWrapper crumbs={navigationCrumbs}>
      <SEO
        title={intl.formatMessage({
          defaultMessage: "Create department",
          id: "PRrRRN",
          description: "Page title for the department creation page",
        })}
      />
      <CreateDepartmentForm handleCreateDepartment={handleCreateDepartment} />
    </AdminContentWrapper>
  );
};

export default CreateDepartmentPage;
