import { useIntl } from "react-intl";
import { useQuery } from "urql";
import IdentificationIcon from "@heroicons/react/24/outline/IdentificationIcon";
import { useOutletContext } from "react-router-dom";

import { commonMessages } from "@gc-digital-talent/i18n";
import {
  Pending,
  NotFound,
  Heading,
  CardSectioned,
  Link,
} from "@gc-digital-talent/ui";
import {
  FragmentType,
  Scalars,
  getFragment,
  graphql,
} from "@gc-digital-talent/graphql";
import { ROLE_NAME } from "@gc-digital-talent/auth";
import { htmlToRichTextJSON, RichTextRenderer } from "@gc-digital-talent/forms";

import SEO from "~/components/SEO/SEO";
import useRequiredParams from "~/hooks/useRequiredParams";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
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
            defaultMessage: "Basic information",
            id: "Zffatu",
            description: "Heading for the basic information section of a form",
          })}
        </Heading>
      </div>
      <CardSectioned.Root>
        <CardSectioned.Item
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
        </CardSectioned.Item>

        <CardSectioned.Item
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
        </CardSectioned.Item>
      </CardSectioned.Root>
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

const ViewCommunityPage = () => {
  const intl = useIntl();

  const { communityId } = useRequiredParams<RouteParams>("communityId");
  const [{ data, fetching, error }] = useQuery({
    query: ViewCommunity_Query,
    variables: { id: communityId },
  });

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
      <Hero
        title={
          fetching ? intl.formatMessage(commonMessages.loading) : communityName
        }
        crumbs={navigationCrumbs}
        navTabs={navTabs}
      />
      <div data-h2-wrapper="base(center, large, x1) p-tablet(center, large, x2)">
        <div data-h2-padding="base(x2, 0)">
          <Pending fetching={fetching} error={error}>
            {data?.community ? (
              <ViewCommunityForm query={data.community} />
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
        </div>
      </div>
    </>
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
