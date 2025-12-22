import { useNavigate } from "react-router";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { useMutation, useQuery } from "urql";
import IdentificationIcon from "@heroicons/react/24/outline/IdentificationIcon";

import { toast } from "@gc-digital-talent/toast";
import { Submit } from "@gc-digital-talent/forms";
import {
  graphql,
  CreateDepartmentInput,
  Scalars,
  LocalizedStringInput,
  DepartmentSize,
} from "@gc-digital-talent/graphql";
import { ROLE_NAME } from "@gc-digital-talent/auth";
import {
  Heading,
  Link,
  CardSeparator,
  Card,
  Pending,
} from "@gc-digital-talent/ui";

import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import pageTitles from "~/messages/pageTitles";
import Hero from "~/components/Hero";

import FormFields from "./FormFields";
import { DepartmentType, departmentTypeToInput } from "./utils";

interface FormValues {
  name?: LocalizedStringInput;
  departmentNumber: number;
  orgIdentifier: number;
  size: DepartmentSize;
  departmentType?: DepartmentType[] | boolean;
}

export function formValuesToCreateInput({
  departmentType,
  size,
  name,
  departmentNumber,
  orgIdentifier,
}: FormValues): CreateDepartmentInput {
  return {
    name,
    size,
    departmentNumber: Number(departmentNumber),
    orgIdentifier: Number(orgIdentifier),
    ...departmentTypeToInput(departmentType),
  };
}

const CreateDepartmentOptions_Query = graphql(/* GraphQL */ `
  query CreateDepartmentOptions {
    ...DepartmentFormOptions
  }
`);

interface CreateDepartmentProps {
  handleCreateDepartment: (
    data: CreateDepartmentInput,
  ) => Promise<Scalars["UUID"]["output"]>;
}

export const CreateDepartmentForm = ({
  handleCreateDepartment,
}: CreateDepartmentProps) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const paths = useRoutes();
  const [{ data, fetching, error }] = useQuery({
    query: CreateDepartmentOptions_Query,
  });
  const methods = useForm<FormValues>();
  const { handleSubmit } = methods;

  const onSubmit: SubmitHandler<FormValues> = async (values: FormValues) => {
    return handleCreateDepartment(formValuesToCreateInput(values))
      .then(async (id) => {
        await navigate(paths.departmentView(id));
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
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <Heading
            level="h2"
            color="secondary"
            icon={IdentificationIcon}
            center
            className="mt-0 mb-9 font-normal xs:justify-start xs:text-left"
          >
            {intl.formatMessage({
              defaultMessage: "Department information",
              id: "eNTKLK",
              description: "Heading for the 'create a department' form",
            })}
          </Heading>
          <Pending fetching={fetching} error={error}>
            <FormFields optionsQuery={data} />
          </Pending>
          <CardSeparator />
          <div className="flex flex-col items-center gap-6 xs:flex-row">
            <Submit
              text={intl.formatMessage({
                defaultMessage: "Create department",
                id: "ZqjOM/",
                description: "Button label to create a department",
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
        </Card>
      </form>
    </FormProvider>
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
      if (result.data?.createDepartment?.id) {
        return result.data.createDepartment.id;
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
        <div className="mb-18">
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

export default Component;
