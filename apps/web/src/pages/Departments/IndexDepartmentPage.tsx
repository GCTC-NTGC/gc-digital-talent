import React from "react";
import { MessageDescriptor, defineMessage, useIntl } from "react-intl";
import BuildingOffice2OutlineIcon from "@heroicons/react/24/outline/BuildingOffice2Icon";
import BuildingOffice2SolidIcon from "@heroicons/react/24/solid/BuildingOffice2Icon";

import { IconType } from "@gc-digital-talent/ui";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import SEO from "~/components/SEO/SEO";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import useRoutes from "~/hooks/useRoutes";
import AdminHero from "~/components/Hero/AdminHero";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import RequireAuth from "~/components/RequireAuth/RequireAuth";

import DepartmentTableApi from "./components/DepartmentTable";

export const pageTitle: MessageDescriptor = defineMessage({
  defaultMessage: "Departments",
  id: "+d/NdU",
  description: "Title for departments",
});
export const pageOutlineIcon: IconType = BuildingOffice2OutlineIcon;
export const pageSolidIcon: IconType = BuildingOffice2SolidIcon;

export const DepartmentPage = () => {
  const intl = useIntl();
  const routes = useRoutes();
  const formattedPageTitle = intl.formatMessage(pageTitle);

  const navigationCrumbs = useBreadcrumbs({
    crumbs: [
      {
        label: formattedPageTitle,
        url: routes.departmentTable(),
      },
    ],
    isAdmin: true,
  });

  return (
    <>
      <SEO title={formattedPageTitle} />
      <AdminHero
        title={formattedPageTitle}
        nav={{ mode: "crumbs", items: navigationCrumbs }}
      />
      <AdminContentWrapper>
        <DepartmentTableApi title={formattedPageTitle} />
      </AdminContentWrapper>
    </>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.PlatformAdmin]}>
    <DepartmentPage />
  </RequireAuth>
);

Component.displayName = "AdminIndexDepartmentPage";

export default DepartmentPage;
