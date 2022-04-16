import React from "react";
import { useIntl } from "react-intl";
import { Routes } from "universal-router";
import { RouterResult } from "@common/helpers/router";
import Toast from "@common/components/Toast";
import ClientProvider from "./ClientProvider";
import PageContainer, { MenuLink } from "./PageContainer";
import {
  useIndigenousApprenticeshipRoutes,
  IndigenousApprenticeshipRoutes,
} from "../indigenousApprenticeshipRoutes";
import HelloWorld from "./HelloWorld/HelloWorld";

const routes = (
  indigenousApprenticeshipPaths: IndigenousApprenticeshipRoutes,
): Routes<RouterResult> => [
  {
    path: indigenousApprenticeshipPaths.helloWorld(),
    action: () => ({
      component: <HelloWorld />,
    }),
  },
];

export const Router: React.FC = () => {
  const intl = useIntl();
  const indigenousApprenticeshipPaths = useIndigenousApprenticeshipRoutes();

  const menuItems = [
    <MenuLink
      key="search"
      href={indigenousApprenticeshipPaths.helloWorld()}
      text={intl.formatMessage({
        defaultMessage: "Hello World",
        description: "Label displayed on the Hello World menu item.",
      })}
    />,
  ];

  return (
    <ClientProvider>
      <PageContainer
        menuItems={menuItems}
        contentRoutes={routes(indigenousApprenticeshipPaths)}
      />
      <Toast />
    </ClientProvider>
  );
};

export default Router;
