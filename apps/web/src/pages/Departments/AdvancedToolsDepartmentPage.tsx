import { useIntl } from "react-intl";
import Cog8ToothIcon from "@heroicons/react/24/outline/Cog8ToothIcon";
import { useOutletContext } from "react-router";

import { Heading } from "@gc-digital-talent/ui";
import { graphql } from "@gc-digital-talent/graphql";
import { ROLE_NAME } from "@gc-digital-talent/auth";
import { NotFoundError } from "@gc-digital-talent/helpers";

import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import Hero from "~/components/Hero";
import adminMessages from "~/messages/adminMessages";
import { requireUser } from "~/routing/auth";
import { graphqlClientContext, intlContext } from "~/routing/context";

import { ArchiveDepartment } from "./components/ArchiveDepartment";
import { RestoreDepartment } from "./components/RestoreDepartment";
import { ContextType } from "./ManageAccessPage/components/types";
import type { Route } from "./+types/AdvancedToolsDepartmentPage";
import messages from "./messages";

const AdvancedToolsDepartment_Query = graphql(/* GraphQL */ `
  query AdvancedToolsDepartmentPage($id: UUID!) {
    department(id: $id) {
      name {
        localized
      }
      id
      archivedAt
      name {
        localized
      }
    }
  }
`);

export const clientMiddleware: Route.ClientMiddlewareFunction[] = [
  async ({ context, request }, next) => {
    requireUser(context, request, [{ name: ROLE_NAME.PlatformAdmin }]);
    return await next();
  },
];

export async function clientLoader({
  context,
  params,
}: Route.ClientLoaderArgs) {
  const intl = context.get(intlContext);
  const client = context.get(graphqlClientContext);
  const res = await client
    .query(AdvancedToolsDepartment_Query, { id: params.departmentId })
    .toPromise();

  if (!res.data?.department) {
    throw new NotFoundError(
      intl.formatMessage(messages.departmentNotFound, {
        departmentId: params.departmentId,
      }),
    );
  }

  return {
    department: res.data.department,
  };
}

const Component = ({
  loaderData: { department },
  params: { departmentId },
}: Route.ComponentProps) => {
  const intl = useIntl();
  const routes = useRoutes();

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
      <Hero title={departmentName} crumbs={crumbs} navTabs={navTabs} />
      <div className="mw-full mx-auto max-w-6xl px-6">
        <div className="py-16"></div>
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
      </div>
    </>
  );
};

Component.displayName = "AdminAdvancedToolsDepartmentPage";

export default Component;
