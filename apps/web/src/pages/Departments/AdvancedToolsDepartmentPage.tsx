import { useIntl } from "react-intl";
import { useQuery } from "urql";
import Cog8ToothIcon from "@heroicons/react/24/outline/Cog8ToothIcon";
import { useOutletContext } from "react-router";

import { commonMessages } from "@gc-digital-talent/i18n";
import { Pending, NotFound, Heading } from "@gc-digital-talent/ui";
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
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import Hero from "~/components/Hero";
import adminMessages from "~/messages/adminMessages";

import { ArchiveDepartment } from "./components/ArchiveDepartment";
import { RestoreDepartment } from "./components/RestoreDepartment";
import { ContextType } from "./ManageAccessPage/components/types";

export const DepartmentAdvancedTools_Fragment = graphql(/* GraphQL */ `
  fragment DepartmentAdvancedTools on Department {
    id
    archivedAt
    name {
      localized
    }
  }
`);

interface AdvancedToolsDepartmentProps {
  query: FragmentType<typeof DepartmentAdvancedTools_Fragment>;
}

export const AdvancedToolsDepartment = ({
  query,
}: AdvancedToolsDepartmentProps) => {
  const intl = useIntl();
  const department = getFragment(DepartmentAdvancedTools_Fragment, query);

  return (
    <>
      <div className="flex justify-center sm:justify-start">
        <Heading
          level="h2"
          color="secondary"
          icon={Cog8ToothIcon}
          className="mt-0 mb-7 font-normal"
        >
          {intl.formatMessage(adminMessages.advancedTools)}
        </Heading>
      </div>
      <p className="mb-12">
        {intl.formatMessage({
          defaultMessage:
            "Warning! These are sensitive actions that will affect the entire platform, please use extreme caution when changing these settings.",
          id: "GkX/KN",
          description:
            "Warning that you are making changes of possibly very high impact",
        })}
      </p>

      {department.archivedAt ? (
        <RestoreDepartment
          departmentId={department.id}
          departmentNameLocalized={department.name.localized}
          archivedAt={department.archivedAt}
        />
      ) : (
        <ArchiveDepartment
          departmentId={department.id}
          departmentNameLocalized={department.name.localized}
        />
      )}
    </>
  );
};

interface RouteParams extends Record<string, string> {
  departmentId: Scalars["ID"]["output"];
}

const AdvancedToolsDepartment_Query = graphql(/* GraphQL */ `
  query AdvancedToolsDepartmentPage($id: UUID!) {
    department(id: $id) {
      name {
        localized
      }
      ...DepartmentAdvancedTools
    }
  }
`);

const AdvancedToolsDepartmentPage = () => {
  const intl = useIntl();
  const routes = useRoutes();
  const { departmentId } = useRequiredParams<RouteParams>("departmentId");
  const [{ data: departmentData, fetching, error }] = useQuery({
    query: AdvancedToolsDepartment_Query,
    variables: { id: departmentId },
  });

  const {
    departmentName,
    navigationCrumbs: baseCrumbs,
    navTabs,
  } = useOutletContext<ContextType>();

  const crumbs = [
    ...(baseCrumbs ?? []),
    {
      label: intl.formatMessage(adminMessages.advancedTools),
      url: routes.departmentAdvancedTools(departmentId),
    },
  ];

  return (
    <>
      <SEO title={departmentName} />
      <Hero
        title={
          fetching ? intl.formatMessage(commonMessages.loading) : departmentName
        }
        crumbs={crumbs}
        navTabs={navTabs}
      />
      <div className="mw-full mx-auto max-w-6xl px-6">
        <div className="py-16">
          <Pending fetching={fetching} error={error}>
            {departmentData?.department ? (
              <AdvancedToolsDepartment query={departmentData?.department} />
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
    <AdvancedToolsDepartmentPage />
  </RequireAuth>
);

Component.displayName = "AdminAdvancedToolsDepartmentPage";

export default Component;
