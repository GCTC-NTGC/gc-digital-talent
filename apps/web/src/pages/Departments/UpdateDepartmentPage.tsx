import { useNavigate } from "react-router";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { useMutation, useQuery } from "urql";
import IdentificationIcon from "@heroicons/react/24/outline/IdentificationIcon";

import { toast } from "@gc-digital-talent/toast";
import { Submit } from "@gc-digital-talent/forms";
import {
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
  Card,
} from "@gc-digital-talent/ui";
import {
  DepartmentSize,
  FragmentType,
  LocalizedStringInput,
  Maybe,
  Scalars,
  UpdateDepartmentInput,
  getFragment,
  graphql,
} from "@gc-digital-talent/graphql";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import useRequiredParams from "~/hooks/useRequiredParams";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import pageTitles from "~/messages/pageTitles";
import Hero from "~/components/Hero";

import FormFields, { DepartmentFormOptions_Fragment } from "./FormFields";
import { DepartmentType, departmentTypeToInput } from "./utils";

interface FormValues {
  name?: LocalizedStringInput;
  departmentNumber: Maybe<number>;
  orgIdentifier: Maybe<number>;
  size: Maybe<DepartmentSize>;
  departmentType: DepartmentType[] | boolean;
}

export function formValuesToUpdateInput({
  departmentType,
  size,
  name,
  departmentNumber,
  orgIdentifier,
}: FormValues): UpdateDepartmentInput {
  return {
    name: {
      en: name?.en,
      fr: name?.fr,
    },
    size: size ?? undefined,
    departmentNumber: departmentNumber ? Number(departmentNumber) : undefined,
    orgIdentifier: orgIdentifier ? Number(orgIdentifier) : undefined,
    ...departmentTypeToInput(departmentType),
  };
}

export const DepartmentForm_Fragment = graphql(/* GraphQL */ `
  fragment DepartmentForm on Department {
    id
    departmentNumber
    name {
      en
      fr
    }
    orgIdentifier
    size {
      value
      label {
        localized
      }
    }
    isCorePublicAdministration
    isCentralAgency
    isScience
    isRegulatory
  }
`);

interface UpdateDepartmentProps {
  query: FragmentType<typeof DepartmentForm_Fragment>;
  optionsQuery: FragmentType<typeof DepartmentFormOptions_Fragment>;
  handleUpdateDepartment: (
    id: string,
    data: UpdateDepartmentInput,
  ) => Promise<FragmentType<typeof DepartmentForm_Fragment>>;
}

export const UpdateDepartmentForm = ({
  query,
  optionsQuery,
  handleUpdateDepartment,
}: UpdateDepartmentProps) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const paths = useRoutes();
  const department = getFragment(DepartmentForm_Fragment, query);
  const methods = useForm<FormValues>({
    defaultValues: {
      departmentNumber: department.departmentNumber,
      name: department.name,
      orgIdentifier: department.orgIdentifier,
      size: department.size?.value,
      departmentType: [
        ...(department.isCorePublicAdministration
          ? (["isCorePublicAdministration"] satisfies DepartmentType[])
          : []),
        ...(department.isCentralAgency
          ? (["isCentralAgency"] satisfies DepartmentType[])
          : []),
        ...(department.isScience
          ? (["isScience"] satisfies DepartmentType[])
          : []),
        ...(department.isRegulatory
          ? (["isRegulatory"] satisfies DepartmentType[])
          : []),
      ],
    },
  });
  const { handleSubmit } = methods;

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    return handleUpdateDepartment(department.id, formValuesToUpdateInput(data))
      .then(async () => {
        await navigate(paths.departmentView(department.id));
        toast.success(
          intl.formatMessage({
            defaultMessage: "Department updated successfully!",
            id: "GTR9Pt",
            description:
              "Message displayed to user after department is updated successfully.",
          }),
        );
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: updating department failed",
            id: "nXRLAX",
            description:
              "Message displayed to user after department fails to get updated.",
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
          <FormFields optionsQuery={optionsQuery} />
          <CardSeparator />
          <div className="flex flex-col items-center gap-6 xs:flex-row">
            <Submit text={intl.formatMessage(formMessages.saveChanges)} />
            <Link
              color="warning"
              mode="inline"
              href={paths.departmentView(department.id)}
            >
              {intl.formatMessage(commonMessages.cancel)}
            </Link>
          </div>
        </Card>
      </form>
    </FormProvider>
  );
};

interface RouteParams extends Record<string, string> {
  departmentId: Scalars["ID"]["output"];
}

const Department_Query = graphql(/* GraphQL */ `
  query Department($id: UUID!) {
    department(id: $id) {
      name {
        en
        fr
      }
      ...DepartmentForm
    }
    ...DepartmentFormOptions
  }
`);

const UpdateDepartment_Mutation = graphql(/* GraphQL */ `
  mutation UpdateDepartment($id: ID!, $department: UpdateDepartmentInput!) {
    updateDepartment(id: $id, department: $department) {
      ...DepartmentForm
    }
  }
`);

const UpdateDepartmentPage = () => {
  const intl = useIntl();
  const routes = useRoutes();
  const { departmentId } = useRequiredParams<RouteParams>("departmentId");
  const [{ data, fetching, error }] = useQuery({
    query: Department_Query,
    variables: { id: departmentId },
  });
  const [, executeMutation] = useMutation(UpdateDepartment_Mutation);
  const handleUpdateDepartment = (
    id: string,
    department: UpdateDepartmentInput,
  ) =>
    executeMutation({
      id,
      department,
    }).then((result) => {
      if (result.data?.updateDepartment) {
        return result.data?.updateDepartment;
      }
      return Promise.reject(new Error(result.error?.toString()));
    });

  const departmentName = getLocalizedName(data?.department?.name, intl);

  const navigationCrumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(pageTitles.departments),
        url: routes.departmentTable(),
      },
      {
        label: departmentName,
        url: routes.departmentView(departmentId),
      },
      ...(departmentId
        ? [
            {
              label: intl.formatMessage({
                defaultMessage: "Edit<hidden> department</hidden>",
                id: "FYIbdJ",
                description:
                  "Breadcrumb title for the edit department page link.",
              }),
              url: routes.departmentUpdate(departmentId),
            },
          ]
        : []),
    ],
  });

  const pageTitle = intl.formatMessage({
    defaultMessage: "Edit a department",
    id: "y+R3x+",
    description: "Page title for the department edit page",
  });

  return (
    <>
      <SEO title={pageTitle} />
      <Hero title={pageTitle} crumbs={navigationCrumbs} overlap centered>
        <div className="mb-18">
          <Pending fetching={fetching} error={error}>
            {data?.department ? (
              <UpdateDepartmentForm
                query={data.department}
                optionsQuery={data}
                handleUpdateDepartment={handleUpdateDepartment}
              />
            ) : (
              <NotFound
                headingMessage={intl.formatMessage(commonMessages.notFound)}
              >
                <p>
                  {intl.formatMessage(
                    {
                      defaultMessage: "Department {departmentId} not found.",
                      id: "8Otaw9",
                      description:
                        "Message displayed for department not found.",
                    },
                    { departmentId },
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
    <UpdateDepartmentPage />
  </RequireAuth>
);

Component.displayName = "AdminUpdateDepartmentPage";

export default Component;
