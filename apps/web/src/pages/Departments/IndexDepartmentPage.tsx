import { useIntl } from "react-intl";

import { ROLE_NAME } from "@gc-digital-talent/auth";

import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import pageTitles from "~/messages/pageTitles";
import Hero from "~/components/Hero";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import { requireUser } from "~/routing/auth";

import type { Route } from "./+types/IndexDepartmentPage";
import DepartmentTableApi from "./components/DepartmentTable";

export const clientMiddleware: Route.ClientMiddlewareFunction[] = [
  async ({ context, request }, next) => {
    requireUser(context, request, {
      roles: [
        { name: ROLE_NAME.PlatformAdmin },
        { name: ROLE_NAME.DepartmentAdmin },
        { name: ROLE_NAME.DepartmentHRAdvisor },
      ],
    });
    return await next();
  },
];

const Component = () => {
  const intl = useIntl();
  const routes = useRoutes();
  const formattedPageTitle = intl.formatMessage(pageTitles.departments);

  const navigationCrumbs = useBreadcrumbs({
    crumbs: [
      {
        label: formattedPageTitle,
        url: routes.departmentTable(),
      },
    ],
  });

  return (
    <>
      <SEO title={formattedPageTitle} />
      <Hero title={formattedPageTitle} crumbs={navigationCrumbs} />
      <AdminContentWrapper table>
        <DepartmentTableApi title={formattedPageTitle} />
      </AdminContentWrapper>
    </>
  );
};

Component.displayName = "AdminIndexDepartmentPage";

export default Component;
