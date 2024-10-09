import { defineMessage, useIntl } from "react-intl";
import { useMutation } from "urql";

import { graphql, CreateCommunityInput } from "@gc-digital-talent/graphql";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import AdminHero from "~/components/HeroDeprecated/AdminHero";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import pageTitles from "~/messages/pageTitles";

import CreateCommunityForm from "./components/CreateCommunityForm";

const CreateCommunity_Mutation = graphql(/* GraphQL */ `
  mutation CreateCommunity($community: CreateCommunityInput!) {
    createCommunity(community: $community) {
      id
    }
  }
`);

const pageTitle = defineMessage({
  defaultMessage: "Create a community",
  id: "pPOT4g",
  description: "Page title for the create community page",
});

const CreateCommunityPage = () => {
  const intl = useIntl();
  const routes = useRoutes();

  const [, executeMutation] = useMutation(CreateCommunity_Mutation);

  const formattedPageTitle = intl.formatMessage(pageTitle);

  const handleSubmit = async (values: CreateCommunityInput) => {
    return executeMutation({
      community: values,
    }).then((result) => {
      if (result.data?.createCommunity) {
        return Promise.resolve(result.data?.createCommunity);
      }
      return Promise.reject(result.error);
    });
  };

  const navigationCrumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(pageTitles.communities),
        url: routes.communityTable(),
      },
      {
        label: intl.formatMessage({
          defaultMessage: "Create<hidden> community</hidden>",
          id: "r2K3M3",
          description: "Breadcrumb title for the create community page link.",
        }),
        url: routes.communityCreate(),
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
        <CreateCommunityForm onSubmit={handleSubmit} />
      </AdminContentWrapper>
    </>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.PlatformAdmin]}>
    <CreateCommunityPage />
  </RequireAuth>
);

Component.displayName = "AdminCreateCommunityPage";

export default CreateCommunityPage;
