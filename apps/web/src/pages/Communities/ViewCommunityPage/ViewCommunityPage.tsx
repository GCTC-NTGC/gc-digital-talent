import { useIntl } from "react-intl";
import { useQuery } from "urql";
import QueueListIcon from "@heroicons/react/24/outline/QueueListIcon";
import { useOutletContext } from "react-router";

import { commonMessages } from "@gc-digital-talent/i18n";
import {
  Pending,
  NotFound,
  Heading,
  Card,
  CardSeparator,
  Link,
  Container,
} from "@gc-digital-talent/ui";
import type {
  FragmentType,
  ViewCommunityQuery,
} from "@gc-digital-talent/graphql";
import { getFragment, graphql } from "@gc-digital-talent/graphql";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import SEO from "~/components/SEO/SEO";
import useRequiredParams from "~/hooks/useRequiredParams";
import useRoutes from "~/hooks/useRoutes";
import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";
import adminMessages from "~/messages/adminMessages";
import Hero from "~/components/Hero";
import { requireUser } from "~/routing/auth";

import type { Route } from "./+types/ViewCommunityPage";
import type { ContextType } from "../CommunityMembersPage/components/types";

interface RouteParams extends Record<string, string> {
  communityId: string;
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
    informationUrl {
      en
      fr
    }
    contactEmail
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
  const { canAdminManageAccessAndEditCommunity } =
    useOutletContext<ContextType>();

  const notProvided = intl.formatMessage(commonMessages.notProvided);
  return (
    <>
      <Card space="lg">
        <Heading
          level="h2"
          color="primary"
          icon={QueueListIcon}
          center
          className="mt-1 mb-6 font-normal xs:justify-start xs:text-left"
          size="h3"
        >
          {intl.formatMessage(adminMessages.communityDetails)}
        </Heading>
        <p className="mb-9">
          {intl.formatMessage({
            defaultMessage:
              "The following information will be used to identify the community and offer insight into the domains it supports.",
            id: "f1vqns",
            description: "Description for community form",
          })}
        </p>
        <div className="grid gap-6 xs:grid-cols-2">
          <div>
            <p className="mb-1 font-bold">
              {community.name?.en ?? notProvided}
            </p>
            <>
              {community.informationUrl?.en && (
                <Link
                  mode="text"
                  external
                  newTab
                  href={community.informationUrl.en}
                  className="-mt-3 break-all"
                >
                  {community.informationUrl.en}
                </Link>
              )}
            </>
            <p className="my-3">{community.description?.en ?? notProvided}</p>
            <FieldDisplay
              label={intl.formatMessage({
                defaultMessage: "Mandated by",
                id: "eJekyY",
                description:
                  "Label displayed on the community form mandated by authority field",
              })}
            >
              {community.mandateAuthority?.en ??
                intl.formatMessage(commonMessages.notProvided)}
            </FieldDisplay>
            <CardSeparator className="xs:hidden" />
          </div>
          <div className="-mt-6 xs:mt-0">
            <p className="mb-1 font-bold">
              {community.name?.fr ?? notProvided}
            </p>
            <>
              {community.informationUrl?.fr && (
                <Link
                  mode="text"
                  external
                  newTab
                  href={community.informationUrl.fr}
                  className="-mt-3 break-all"
                >
                  {community.informationUrl.fr}
                </Link>
              )}
            </>
            <p className="my-3">{community.description?.fr ?? notProvided}</p>
            <FieldDisplay
              label={intl.formatMessage({
                defaultMessage: "Mandated by",
                id: "eJekyY",
                description:
                  "Label displayed on the community form mandated by authority field",
              })}
            >
              {community.mandateAuthority?.fr ??
                intl.formatMessage(commonMessages.notProvided)}
            </FieldDisplay>
          </div>
        </div>
        <CardSeparator />
        <div className="xs:col-span-2">
          <FieldDisplay
            label={intl.formatMessage({
              defaultMessage: "Generic contact email",
              id: "iVe7JX",
              description:
                "Label displayed on the community form contact email field",
            })}
          >
            {community.contactEmail ??
              intl.formatMessage(commonMessages.notProvided)}
          </FieldDisplay>
        </div>
        <CardSeparator />
        <div className="col-span-2 flex flex-col items-center justify-center xs:flex-row xs:justify-between">
          {canAdminManageAccessAndEditCommunity ? (
            <Link
              href={paths.communityUpdate(community.id)}
              className="mb-6 font-bold xs:mb-0"
            >
              {intl.formatMessage({
                defaultMessage: "Edit community details",
                id: "UieDSb",
                description: "Link to edit the currently viewed community",
              })}
            </Link>
          ) : (
            <div></div>
          )}
          <span className="text-sm text-gray-500 dark:text-gray-200">
            {community.key}
          </span>
        </div>
      </Card>
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
    id: "+OOFwz",
    description: "Title for community form",
  });

  const { communityName, navigationCrumbs, navTabs } =
    useOutletContext<ContextType>();

  const subtitleMessage = intl.formatMessage(
    {
      defaultMessage: "View and edit details about the {communityName}",
      id: "vpnzr+",
      description: "Subtitle for the details view page of a community",
    },
    { communityName: communityName },
  );

  return (
    <>
      <SEO title={pageTitle} />
      <Hero
        title={communityName}
        subtitle={subtitleMessage}
        crumbs={navigationCrumbs}
        navTabs={navTabs}
      />
      <Container className="my-18">
        <ViewCommunityForm query={community} />
      </Container>
    </>
  );
};

export const clientMiddleware: Route.ClientMiddlewareFunction[] = [
  async ({ context, request }, next) => {
    requireUser(context, request, {
      roles: [
        { name: ROLE_NAME.PlatformAdmin },
        { name: ROLE_NAME.CommunityAdmin },
        { name: ROLE_NAME.CommunityRecruiter },
        { name: ROLE_NAME.CommunityTalentCoordinator },
      ],
    });
    return await next();
  },
];

// Since the SEO and Hero need API-loaded data, we wrap the entire page in a Pending
const Component = () => {
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

Component.displayName = "AdminViewCommunityPage";

export default Component;
