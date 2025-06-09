import { useIntl } from "react-intl";
import { useQuery } from "urql";
import IdentificationIcon from "@heroicons/react/24/outline/IdentificationIcon";

import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";
import {
  Pending,
  NotFound,
  Heading,
  Link,
  Card,
  CardSeparator,
  Ul,
} from "@gc-digital-talent/ui";
import {
  FragmentType,
  Scalars,
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
import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";
import adminMessages from "~/messages/adminMessages";
import BoolCheckIcon from "~/components/BoolCheckIcon/BoolCheckIcon";

import labels from "./labels";

export const DepartmentView_Fragment = graphql(/* GraphQL */ `
  fragment DepartmentView on Department {
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

interface ViewDepartmentProps {
  query: FragmentType<typeof DepartmentView_Fragment>;
}

export const ViewDepartmentForm = ({ query }: ViewDepartmentProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const department = getFragment(DepartmentView_Fragment, query);
  const notProvided = intl.formatMessage(commonMessages.notProvided);

  return (
    <>
      <div
        data-h2-display="base(flex)"
        data-h2-justify-content="base(center) p-tablet(flex-start)"
      >
        <Heading
          level="h2"
          color="secondary"
          icon={IdentificationIcon}
          data-h2-margin="base(0, 0, x1.5, 0)"
          data-h2-font-weight="base(400)"
        >
          {intl.formatMessage({
            defaultMessage: "Department information",
            id: "eNTKLK",
            description: "Heading for the 'create a department' form",
          })}
        </Heading>
      </div>
      <Card>
        <div
          data-h2-display="base(grid)"
          data-h2-grid-template-columns="p-tablet(repeat(2, 1fr)) "
          data-h2-gap="base(x1)"
        >
          <FieldDisplay label={intl.formatMessage(adminMessages.nameEn)}>
            {department.name.en}
          </FieldDisplay>
          <FieldDisplay label={intl.formatMessage(adminMessages.nameFr)}>
            {department.name.fr}
          </FieldDisplay>
          <FieldDisplay label={intl.formatMessage(labels.departmentNumber)}>
            {department.departmentNumber}
          </FieldDisplay>
          <FieldDisplay label={intl.formatMessage(labels.orgIdentifier)}>
            {department.orgIdentifier ?? notProvided}
          </FieldDisplay>
          <FieldDisplay label={intl.formatMessage(labels.departmentType)}>
            <Ul unStyled space="md">
              <li>
                <BoolCheckIcon value={department.isCorePublicAdministration}>
                  {intl.formatMessage(labels.corePublicAdmin)}
                </BoolCheckIcon>
              </li>
              <li>
                <BoolCheckIcon value={department.isCentralAgency}>
                  {intl.formatMessage(labels.centralAgency)}
                </BoolCheckIcon>
              </li>
              <li>
                <BoolCheckIcon value={department.isScience}>
                  {intl.formatMessage(labels.science)}
                </BoolCheckIcon>
              </li>
              <li>
                <BoolCheckIcon value={department.isRegulatory}>
                  {intl.formatMessage(labels.regulatory)}
                </BoolCheckIcon>
              </li>
            </Ul>
          </FieldDisplay>
          <FieldDisplay label={intl.formatMessage(labels.departmentSize)}>
            {department.size?.label.localized ?? notProvided}
          </FieldDisplay>
        </div>
        <CardSeparator />
        <div
          data-h2-display="base(flex)"
          data-h2-justify-content="base(center) p-tablet(flex-start)"
        >
          <Link
            href={paths.departmentUpdate(department.id)}
            data-h2-font-weight="base(bold)"
          >
            {intl.formatMessage({
              defaultMessage: "Edit department information",
              id: "os2TYf",
              description: "Link to edit the currently viewed department",
            })}
          </Link>
        </div>
      </Card>
    </>
  );
};

interface RouteParams extends Record<string, string> {
  departmentId: Scalars["ID"]["output"];
}

const Department_Query = graphql(/* GraphQL */ `
  query ViewDepartmentPage($id: UUID!) {
    department(id: $id) {
      name {
        en
        fr
      }
      ...DepartmentView
    }
  }
`);

const ViewDepartmentPage = () => {
  const intl = useIntl();
  const routes = useRoutes();
  const { departmentId } = useRequiredParams<RouteParams>("departmentId");
  const [{ data: departmentData, fetching, error }] = useQuery({
    query: Department_Query,
    variables: { id: departmentId },
  });

  const departmentName = getLocalizedName(
    departmentData?.department?.name,
    intl,
  );

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
    ],
  });

  const navTabs = [
    {
      url: routes.departmentView(departmentId),
      label: intl.formatMessage({
        defaultMessage: "Department information",
        id: "sp9OKU",
        description: "Nav tab label for department information",
      }),
    },
  ];

  return (
    <>
      <SEO title={departmentName} />
      <Hero
        title={
          fetching ? intl.formatMessage(commonMessages.loading) : departmentName
        }
        crumbs={navigationCrumbs}
        navTabs={navTabs}
      />
      <div data-h2-wrapper="base(center, large, x1) p-tablet(center, large, x2)">
        <div data-h2-padding="base(x3, 0)">
          <Pending fetching={fetching} error={error}>
            {departmentData?.department ? (
              <ViewDepartmentForm query={departmentData?.department} />
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
      </div>
    </>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.PlatformAdmin]}>
    <ViewDepartmentPage />
  </RequireAuth>
);

Component.displayName = "AdminUpdateDepartmentPage";

export default ViewDepartmentPage;
