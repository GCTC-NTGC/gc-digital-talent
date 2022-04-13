import React from "react";
import { useIntl } from "react-intl";
import { Routes } from "universal-router";
import { RouterResult } from "@common/helpers/router";
import Toast from "@common/components/Toast";
import ClientProvider from "./ClientProvider";
import PageContainer, { MenuLink } from "./PageContainer";
import SearchPage from "./search/SearchPage";
import {
  useTalentSearchRoutes,
  TalentSearchRoutes,
} from "../talentSearchRoutes";
import {
  ApplicantProfileRoutes,
  useApplicantProfileRoutes,
} from "../applicantProfileRoutes";
import RequestPage from "./request/RequestPage";
import { ProfilePage } from "./profile/ProfilePage/ProfilePage";
import LanguageInformationFormContainer from "./languageInformationForm/LanguageInformationForm";

const routes = (
  talentPaths: TalentSearchRoutes,
  profilePaths: ApplicantProfileRoutes,
): Routes<RouterResult> => [
  {
    path: talentPaths.home(),
    action: () => ({
      component: <div />,
      redirect: talentPaths.search(),
    }),
  },
  {
    path: talentPaths.search(),
    action: () => ({
      component: <SearchPage />,
    }),
  },
  {
    path: talentPaths.request(),
    action: () => ({
      component: <RequestPage />,
    }),
  },
  {
    path: profilePaths.home(),
    action: () => ({
      component: <ProfilePage />,
    }),
  },
  {
    path: profilePaths.languageInformation(),
    action: () => ({
      component: <LanguageInformationFormContainer />,
    }),
  },
];

export const Router: React.FC = () => {
  const intl = useIntl();
  const talentPaths = useTalentSearchRoutes();
  const profilePaths = useApplicantProfileRoutes();

  const menuItems = [
    <MenuLink
      key="search"
      href={talentPaths.search()}
      text={intl.formatMessage({
        defaultMessage: "Search",
        description: "Label displayed on the Search menu item.",
      })}
    />,
    <MenuLink
      key="request"
      href={talentPaths.request()}
      text={intl.formatMessage({
        defaultMessage: "Request",
        description: "Label displayed on the Request menu item.",
      })}
    />,
  ];

  return (
    <ClientProvider>
      <PageContainer
        menuItems={menuItems}
        contentRoutes={routes(talentPaths, profilePaths)}
      />
      <Toast />
    </ClientProvider>
  );
};

export default Router;
