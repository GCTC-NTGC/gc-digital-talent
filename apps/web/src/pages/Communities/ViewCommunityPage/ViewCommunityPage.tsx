import { useIntl } from "react-intl";
import { useMutation, useQuery } from "urql";

import { commonMessages } from "@gc-digital-talent/i18n";
import { Pending, NotFound, Link, Separator } from "@gc-digital-talent/ui";
import {
  Scalars,
  UpdateCommunityInput,
  graphql,
} from "@gc-digital-talent/graphql";
import { ROLE_NAME } from "@gc-digital-talent/auth";
import { toast } from "@gc-digital-talent/toast";

import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import useRequiredParams from "~/hooks/useRequiredParams";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import useReturnPath from "~/hooks/useReturnPath";

import CommunitySection from "./components/CommunitySection";

interface RouteParams extends Record<string, string> {
  communityId: Scalars["ID"]["output"];
}

const ViewCommunity_Query = graphql(/* GraphQL */ `
  query ViewCommunity($id: UUID!) {
    community(id: $id) {
      ...ViewCommunityPage_Community
    }
  }
`);

const UpdateCommunity_Mutation = graphql(/* GraphQL */ `
  mutation UpdateCommunity($id: UUID!, $community: UpdateCommunityInput!) {
    updateCommunity(id: $id, community: $community) {
      id
    }
  }
`);

const ViewCommunityPage = () => {
  const intl = useIntl();
  const routes = useRoutes();

  const { communityId } = useRequiredParams<RouteParams>("communityId");
  const [{ data, fetching, error }] = useQuery({
    query: ViewCommunity_Query,
    variables: { id: communityId },
  });

  const [{ fetching: isSubmitting }, executeMutation] = useMutation(
    UpdateCommunity_Mutation,
  );

  const handleSave = async (input: UpdateCommunityInput) => {
    return executeMutation({ id: communityId, community: input }).then(
      (result) => {
        if (result.data?.updateCommunity) {
          toast.success(
            intl.formatMessage({
              defaultMessage: "Community updated successfully!",
              id: "8oFk6S",
              description: "Message displayed after a community is updated",
            }),
          );
          return;
        }
        throw new Error("Failed to save community");
      },
    );
  };

  const navigateTo = useReturnPath(routes.communityTable());

  const pageTitle = intl.formatMessage({
    defaultMessage: "Community information",
    id: "W0Bh1G",
    description: "Title for community information",
  });

  return (
    <AdminContentWrapper>
      <SEO title={pageTitle} />
      <Pending fetching={fetching} error={error}>
        {data?.community ? (
          <CommunitySection
            initialData={data.community}
            onUpdate={handleSave}
            isSubmitting={isSubmitting}
          />
        ) : (
          <NotFound
            headingMessage={intl.formatMessage(commonMessages.notFound)}
          >
            <p>
              {intl.formatMessage(
                {
                  defaultMessage: "Community {communityId} not found.",
                  id: "TfbBB7",
                  description: "Message displayed for community not found.",
                },
                { communityId },
              )}
            </p>
          </NotFound>
        )}
      </Pending>
      <Separator data-h2-margin="base(x2, 0, 0, 0)" />
      <p data-h2-margin="base(x2, 0, 0, 0)">
        <Link mode="solid" color="secondary" href={navigateTo}>
          {intl.formatMessage({
            defaultMessage: "Back to communities",
            id: "3kmwRC",
            description:
              "Button text to return to the table of communities page",
          })}
        </Link>
      </p>
    </AdminContentWrapper>
  );
};

export const Component = () => (
  <RequireAuth
    roles={[
      ROLE_NAME.CommunityAdmin,
      ROLE_NAME.CommunityRecruiter,
      ROLE_NAME.CommunityManager,
      ROLE_NAME.PlatformAdmin,
    ]}
  >
    <ViewCommunityPage />
  </RequireAuth>
);

Component.displayName = "AdminViewCommunityPage";

export default ViewCommunityPage;
