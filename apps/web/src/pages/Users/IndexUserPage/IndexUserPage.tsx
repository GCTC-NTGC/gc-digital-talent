import { defineMessage, useIntl } from "react-intl";
import { FormProvider, useForm } from "react-hook-form";

import { ROLE_NAME } from "@gc-digital-talent/auth";
import { Checkbox } from "@gc-digital-talent/forms";

import SEO from "~/components/SEO/SEO";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import useRoutes from "~/hooks/useRoutes";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import pageTitles from "~/messages/pageTitles";
import Hero from "~/components/Hero";

import UserTable from "./components/UserTable";

export const subTitle = defineMessage({
  defaultMessage:
    "The following is a list of active users along with some of their details.",
  id: "UvKDXK",
  description: "Descriptive text about the list of users in the admin portal.",
});

export const IndexUserPage = () => {
  const intl = useIntl();
  const routes = useRoutes();
  const methods = useForm<{ newSearch: boolean }>();
  const isNewSearchChecked = methods.watch("newSearch");

  const formattedPageTitle = intl.formatMessage(pageTitles.users);
  const formattedSubTitle = intl.formatMessage(subTitle);

  const navigationCrumbs = useBreadcrumbs({
    crumbs: [
      {
        label: formattedPageTitle,
        url: routes.userTable(),
      },
    ],
  });

  return (
    <>
      <SEO title={formattedPageTitle} description={formattedSubTitle} />
      <Hero
        title={formattedPageTitle}
        subtitle={formattedSubTitle}
        crumbs={navigationCrumbs}
      />
      <AdminContentWrapper table>
        <FormProvider {...methods}>
          <form className="mb-6">
            <Checkbox
              id="newSearch"
              label={intl.formatMessage({
                defaultMessage: "New search",
                id: "yRtJNi",
                description: "Try the new search",
              })}
              name={"newSearch"}
            />
          </form>
        </FormProvider>
        <UserTable title={formattedPageTitle} newSearch={isNewSearchChecked} />
      </AdminContentWrapper>
    </>
  );
};

export const Component = () => (
  <RequireAuth
    roles={[
      ROLE_NAME.CommunityAdmin,
      ROLE_NAME.CommunityRecruiter,
      ROLE_NAME.ProcessOperator,
      ROLE_NAME.PlatformAdmin,
    ]}
  >
    <IndexUserPage />
  </RequireAuth>
);

Component.displayName = "AdminIndexUserPage";

export default IndexUserPage;
