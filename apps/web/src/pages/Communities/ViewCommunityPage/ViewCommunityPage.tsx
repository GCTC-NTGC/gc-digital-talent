import { useIntl } from "react-intl";
import { useQuery } from "urql";
import IdentificationIcon from "@heroicons/react/24/outline/IdentificationIcon";
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
import {
  FragmentType,
  Scalars,
  ViewCommunityQuery,
  getFragment,
  graphql,
} from "@gc-digital-talent/graphql";
import { ROLE_NAME } from "@gc-digital-talent/auth";
import { htmlToRichTextJSON, RichTextRenderer } from "@gc-digital-talent/forms";

import SEO from "~/components/SEO/SEO";
import useRequiredParams from "~/hooks/useRequiredParams";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import useRoutes from "~/hooks/useRoutes";
import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";
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
      <Heading
        level="h2"
        color="secondary"
        icon={IdentificationIcon}
        center
        className="mt-0 mb-9 font-normal xs:justify-start xs:text-left"
      >
        {intl.formatMessage({
          defaultMessage: "Community information",
          id: "9b+Xtt",
          description:
            "Heading for the community information section of a form",
        })}
      </Heading>
      <Card>
        <div className="grid gap-6 xs:grid-cols-2">
          <FieldDisplay
            hasError={!community.name?.en}
            label={intl.formatMessage(commonMessages.name)}
            appendLanguageToLabel={"en"}
          >
            {community.name?.en ??
              intl.formatMessage(commonMessages.notProvided)}
          </FieldDisplay>
          <FieldDisplay
            hasError={!community.name?.fr}
            label={intl.formatMessage(commonMessages.name)}
            appendLanguageToLabel={"fr"}
          >
            {community.name?.fr ??
              intl.formatMessage(commonMessages.notProvided)}
          </FieldDisplay>
          <FieldDisplay
            hasError={!community.description?.en}
            label={intl.formatMessage(commonMessages.description)}
            appendLanguageToLabel={"en"}
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
            label={intl.formatMessage(commonMessages.description)}
            appendLanguageToLabel={"en"}
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
              defaultMessage: "Mandate authority",
              id: "83aYHF",
              description:
                "Label displayed on the community form mandate authority field",
            })}
            appendLanguageToLabel={"en"}
          >
            {community.mandateAuthority?.en ??
              intl.formatMessage(commonMessages.notProvided)}
          </FieldDisplay>
          <FieldDisplay
            label={intl.formatMessage({
              defaultMessage: "Mandate authority",
              id: "83aYHF",
              description:
                "Label displayed on the community form mandate authority field",
            })}
            appendLanguageToLabel={"fr"}
          >
            {community.mandateAuthority?.fr ??
              intl.formatMessage(commonMessages.notProvided)}
          </FieldDisplay>
          <div className="xs:col-span-2">
            <FieldDisplay label={intl.formatMessage(adminMessages.key)}>
              {community.key}
            </FieldDisplay>
          </div>
        </div>
        <CardSeparator />
        <div className="flex justify-center xs:justify-start">
          <Link
            href={paths.communityUpdate(community.id)}
            className="font-bold"
          >
            {intl.formatMessage({
              defaultMessage: "Edit community information",
              id: "phS+TP",
              description: "Link to edit the currently viewed community",
            })}
          </Link>
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
    id: "W0Bh1G",
    description: "Title for community information",
  });

  const { communityName, navigationCrumbs, navTabs } =
    useOutletContext<ContextType>();

  return (
    <>
      <SEO title={pageTitle} />
      <Hero title={communityName} crumbs={navigationCrumbs} navTabs={navTabs} />
      <Container className="my-12">
        <ViewCommunityForm query={community} />
      </Container>
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
  <RequireAuth
    roles={[
      ROLE_NAME.CommunityAdmin,
      ROLE_NAME.CommunityRecruiter,
      ROLE_NAME.CommunityTalentCoordinator,
      ROLE_NAME.PlatformAdmin,
    ]}
  >
    <ViewCommunityPageApiWrapper />
  </RequireAuth>
);

Component.displayName = "AdminViewCommunityPage";

export default Component;
