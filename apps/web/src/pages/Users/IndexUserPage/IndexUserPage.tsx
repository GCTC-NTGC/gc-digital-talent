import { defineMessage, useIntl } from "react-intl";
import { FormProvider, useForm } from "react-hook-form";
import BeakerIcon from "@heroicons/react/16/solid/BeakerIcon";

import { ROLE_NAME } from "@gc-digital-talent/auth";
import { Checkbox } from "@gc-digital-talent/forms";
import { Notice } from "@gc-digital-talent/ui";

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
  const methods = useForm<{ oldSearch: boolean }>();
  const isOldSearchChecked = methods.watch("oldSearch");

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
        <UserTable title={formattedPageTitle} newSearch={!isOldSearchChecked} />
        <FormProvider {...methods}>
          <form>
            <Notice.Root className="mt-18">
              <Notice.Title icon={BeakerIcon} as="h2">
                {intl.formatMessage({
                  defaultMessage: "Testing a new table search",
                  id: "wqzCx3",
                  description: "Title for a note around testing new search",
                })}
              </Notice.Title>
              <Notice.Content>
                <p className="mb-4.5">
                  {intl.formatMessage({
                    defaultMessage:
                      "This table has changed. We are testing a new algorithm to find and display better results. Let us know if you encounter any problems with this table.",
                    id: "/GsyBb",
                    description: "Body of a note around testing new search",
                  })}
                </p>
                <Checkbox
                  id="oldSearch"
                  label={intl.formatMessage({
                    defaultMessage: "Use the old table search",
                    id: "DDnn7i",
                    description: "Check box to toggle new search",
                  })}
                  name={"oldSearch"}
                />
              </Notice.Content>
            </Notice.Root>
          </form>
        </FormProvider>
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

export default Component;
