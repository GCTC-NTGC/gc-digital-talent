import { defineMessage, useIntl } from "react-intl";
import { useMutation } from "urql";

import { graphql, CreateCommunityInput } from "@gc-digital-talent/graphql";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import pageTitles from "~/messages/pageTitles";
import Hero from "~/components/Hero";

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
      if (result.data?.createCommunity?.id) {
        return Promise.resolve(result.data.createCommunity.id);
      }
      return Promise.reject(new Error(result.error?.toString()));
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
  });

  return (
    <>
      <SEO title={formattedPageTitle} />
      <Hero
        title={formattedPageTitle}
        crumbs={navigationCrumbs}
        overlap
        centered
      >
        <div className="mb-18">
          <CreateCommunityForm onSubmit={handleSubmit} />
        </div>
      </Hero>
    </>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.PlatformAdmin]}>
    <CreateCommunityPage />
  </RequireAuth>
);

Component.displayName = "AdminCreateCommunityPage";

export default Component;
