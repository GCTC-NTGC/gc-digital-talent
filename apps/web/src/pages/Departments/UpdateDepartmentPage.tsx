import { useLocation, useNavigate } from "react-router-dom";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import pick from "lodash/pick";
import { useMutation, useQuery } from "urql";

import { toast } from "@gc-digital-talent/toast";
import { Input, Submit } from "@gc-digital-talent/forms";
import { errorMessages, commonMessages } from "@gc-digital-talent/i18n";
import { Pending, NotFound } from "@gc-digital-talent/ui";
import {
  FragmentType,
  Scalars,
  UpdateDepartmentInput,
  getFragment,
  graphql,
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

export const DepartmentForm_Fragment = graphql(/* GraphQL */ `
  fragment DepartmentForm on Department {
    id
    departmentNumber
    name {
      en
      fr
    }
  }
`);

type FormValues = UpdateDepartmentInput;

interface UpdateDepartmentProps {
  query: FragmentType<typeof DepartmentForm_Fragment>;
  handleUpdateDepartment: (
    id: string,
    data: FormValues,
  ) => Promise<FragmentType<typeof DepartmentForm_Fragment>>;
}

export const UpdateDepartmentForm = ({
  query,
  handleUpdateDepartment,
}: UpdateDepartmentProps) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const paths = useRoutes();
  const initialDepartment = getFragment(DepartmentForm_Fragment, query);
  const methods = useForm<FormValues>({
    defaultValues: {
      departmentNumber: initialDepartment.departmentNumber,
      name: initialDepartment.name,
    },
  });
  const { handleSubmit } = methods;

  const { state } = useLocation();
  const navigateTo = state?.from ?? paths.departmentTable();

  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    return handleUpdateDepartment(initialDepartment.id, {
      departmentNumber: Number(data.departmentNumber),
      name: data.name,
    })
      .then(() => {
        navigate(navigateTo);
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
    <section data-h2-wrapper="base(left, s)">
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          data-h2-display="base(flex)"
          data-h2-flex-direction="base(column)"
          data-h2-gap="base(x.5 0)"
        >
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
            min="0"
          />
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
          <div data-h2-align-self="base(flex-start)">
            <Submit />
          </div>
        </form>
      </FormProvider>
    </section>
  );
};

interface RouteParams extends Record<string, string> {
  departmentId: Scalars["ID"]["output"];
}

const Department_Query = graphql(/* GraphQL */ `
  query Department($id: UUID!) {
    department(id: $id) {
      ...DepartmentForm
    }
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
  const [{ data: departmentData, fetching, error }] = useQuery({
    query: Department_Query,
    variables: { id: departmentId },
  });
  const [, executeMutation] = useMutation(UpdateDepartment_Mutation);
  const handleUpdateDepartment = (id: string, data: UpdateDepartmentInput) =>
    executeMutation({
      id,
      department: pick(data, [
        "departmentName",
        "name.en",
        "name.fr",
        "departmentNumber",
      ]),
    }).then((result) => {
      if (result.data?.updateDepartment) {
        return result.data?.updateDepartment;
      }
      return Promise.reject(result.error);
    });

  const navigationCrumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(pageTitles.departments),
        url: routes.departmentTable(),
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
    isAdmin: true,
  });

  const pageTitle = intl.formatMessage({
    defaultMessage: "Edit department",
    id: "GKo3Df",
    description: "Page title for the department edit page",
  });

  return (
    <>
      <SEO title={pageTitle} />
      <AdminHero
        title={pageTitle}
        nav={{ mode: "crumbs", items: navigationCrumbs }}
      />
      <AdminContentWrapper>
        <Pending fetching={fetching} error={error}>
          {departmentData?.department ? (
            <UpdateDepartmentForm
              query={departmentData.department}
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
                    description: "Message displayed for department not found.",
                  },
                  { departmentId },
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
    <UpdateDepartmentPage />
  </RequireAuth>
);

Component.displayName = "AdminUpdateDepartmentPage";

export default UpdateDepartmentPage;
