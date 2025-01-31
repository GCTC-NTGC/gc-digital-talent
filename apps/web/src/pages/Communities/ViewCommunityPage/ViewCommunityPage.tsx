import { useIntl } from "react-intl";
import { useQuery } from "urql";
import IdentificationIcon from "@heroicons/react/24/outline/IdentificationIcon";
import { useOutletContext } from "react-router";

import { commonMessages } from "@gc-digital-talent/i18n";
import {
  Pending,
  NotFound,
  Heading,
  CardBasic,
  CardSeparator,
  Link,
} from "@gc-digital-talent/ui";
import {
  FragmentType,
  Scalars,
  ViewCommunityQuery,
  getFragment,
  graphql,
} from "@gc-digital-talent/graphql";
import { htmlToRichTextJSON, RichTextRenderer } from "@gc-digital-talent/forms";

import SEO from "~/components/SEO/SEO";
import useRequiredParams from "~/hooks/useRequiredParams";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import permissionConstants from "~/constants/permissionConstants";
import useRoutes from "~/hooks/useRoutes";
import FieldDisplay from "~/components/ToggleForm/FieldDisplay";
import adminMessages from "~/messages/adminMessages";
import Hero from "~/components/Hero";

import { ContextType } from "../CommunityMembersPage/components/types";

interface RouteParams extends Record<string, string> {
  communityId: Scalars["ID"]["output"];
}

const ViewCommunityPage_CommunityFragment = graphql(/* GraphQL */ `
  fragment ViewCommunityPage_Community on Community {
    id
    key
    name {
      en
      fr
    }
    description {
      en
      fr
    }
    mandateAuthority {
      en
      fr
    }
  }
`);

interface ViewCommunityProps {
  query: FragmentType<typeof ViewCommunityPage_CommunityFragment>;
}

export const ViewCommunityForm = ({ query }: ViewCommunityProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const community = getFragment(ViewCommunityPage_CommunityFragment, query);

  const notProvided = intl.formatMessage(commonMessages.notProvided);
  return (
    <>
      <div
        data-h2-display="base(flex)"
        data-h2-justify-content="base(center) p-tablet(flex-start)"
      >
        <Heading
          level="h2"
          color="primary"
          Icon={IdentificationIcon}
          data-h2-margin="base(0, 0, x1.5, 0)"
          data-h2-font-weight="base(400)"
        >
          {intl.formatMessage({
            defaultMessage: "Community information",
            id: "9b+Xtt",
            description:
              "Heading for the community information section of a form",
          })}
        </Heading>
      </div>
      <CardBasic>
        <div
          data-h2-display="base(grid)"
          data-h2-grid-template-columns="p-tablet(repeat(2, 1fr)) "
          data-h2-gap="base(x1)"
        >
          <FieldDisplay
            hasError={!community.name?.en}
            label={intl.formatMessage(adminMessages.nameEn)}
          >
            {community.name?.en
              ? community.name.en
              : intl.formatMessage(commonMessages.notProvided)}
          </FieldDisplay>
          <FieldDisplay
            hasError={!community.name?.fr}
            label={intl.formatMessage(adminMessages.nameFr)}
          >
            {community.name?.fr
              ? community.name.fr
              : intl.formatMessage(commonMessages.notProvided)}
          </FieldDisplay>
          <FieldDisplay
            hasError={!community.description?.en}
            label={intl.formatMessage(adminMessages.descriptionEn)}
          >
            {community.description?.en ? (
              <RichTextRenderer
                node={htmlToRichTextJSON(community.description.en)}
              />
            ) : (
              notProvided
            )}
          </FieldDisplay>
          <FieldDisplay
            hasError={!community.description?.fr}
            label={intl.formatMessage(adminMessages.descriptionFr)}
          >
            {community.description?.fr ? (
              <RichTextRenderer
                node={htmlToRichTextJSON(community.description.fr)}
              />
            ) : (
              notProvided
            )}
          </FieldDisplay>
          <FieldDisplay
            label={intl.formatMessage({
              defaultMessage: "Mandate authority (English)",
              id: "T9alkU",
              description:
                "Label displayed on the community form mandate authority field in English.",
            })}
          >
            {community.mandateAuthority?.en
              ? community.mandateAuthority.en
              : intl.formatMessage(commonMessages.notProvided)}
          </FieldDisplay>
          <FieldDisplay
            label={intl.formatMessage({
              defaultMessage: "Mandate authority (French)",
              id: "oWPn6I",
              description:
                "Label displayed on the community form mandate authority field in French.",
            })}
          >
            {community.mandateAuthority?.fr
              ? community.mandateAuthority.fr
              : intl.formatMessage(commonMessages.notProvided)}
          </FieldDisplay>
          <div data-h2-grid-column="p-tablet(span 2)">
            <FieldDisplay label={intl.formatMessage(adminMessages.key)}>
              {community.key}
            </FieldDisplay>
          </div>
        </div>
        <CardSeparator />
        <div
          data-h2-display="base(flex)"
          data-h2-justify-content="base(center) p-tablet(flex-start)"
        >
          <Link
            href={paths.communityUpdate(community.id)}
            data-h2-font-weight="base(bold)"
          >
            {intl.formatMessage({
              defaultMessage: "Edit community information",
              id: "phS+TP",
              description: "Link to edit the currently viewed community",
            })}
          </Link>
        </div>
      </CardBasic>
    </>
  );
};

const ViewCommunity_Query = graphql(/* GraphQL */ `
  query ViewCommunity($id: UUID!) {
    community(id: $id) {
      ...ViewCommunityPage_Community
    }
  }
`);

interface ViewCommunityPageProps {
  community: NonNullable<ViewCommunityQuery["community"]>;
}

const ViewCommunityPage = ({ community }: ViewCommunityPageProps) => {
  const intl = useIntl();
  const pageTitle = intl.formatMessage({
    defaultMessage: "Community information",
    id: "W0Bh1G",
    description: "Title for community information",
  });

  const { communityName, navigationCrumbs, navTabs } =
    useOutletContext<ContextType>();

  return (
    <>
      <SEO title={pageTitle} />
      <Hero title={communityName} crumbs={navigationCrumbs} navTabs={navTabs} />
      <div data-h2-wrapper="base(center, large, x1) p-tablet(center, large, x2)">
        <div data-h2-padding="base(x2, 0)">
          <ViewCommunityForm query={community} />
        </div>
      </div>
    </>
  );
};

// Since the SEO and Hero need API-loaded data, we wrap the entire page in a Pending
const ViewCommunityPageApiWrapper = () => {
  const intl = useIntl();
  const { communityId } = useRequiredParams<RouteParams>("communityId");
  const [{ data, fetching, error }] = useQuery({
    query: ViewCommunity_Query,
    variables: { id: communityId },
  });
  return (
    <Pending fetching={fetching} error={error}>
      {data?.community ? (
        <ViewCommunityPage community={data.community} />
      ) : (
        <NotFound headingMessage={intl.formatMessage(commonMessages.notFound)}>
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
  );
};

export const Component = () => (
  <RequireAuth roles={permissionConstants.viewCommunities}>
    <ViewCommunityPageApiWrapper />
  </RequireAuth>
);

Component.displayName = "AdminViewCommunityPage";

export default ViewCommunityPage;
