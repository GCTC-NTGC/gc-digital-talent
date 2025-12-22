import { useIntl } from "react-intl";
import { useQuery, useMutation } from "urql";

import { SitewideAnnouncementInput, graphql } from "@gc-digital-talent/graphql";
import { Container, Pending } from "@gc-digital-talent/ui";
import { toast } from "@gc-digital-talent/toast";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import pageTitles from "~/messages/pageTitles";
import Hero from "~/components/Hero";

import SitewideAnnouncementSection from "./SitewideAnnouncementSection";

const AnnouncementPage_Query = graphql(/* GraphQL */ `
  query AnnouncementPage {
    sitewideAnnouncement {
      isEnabled
      publishDate
      expiryDate
      title {
        en
        fr
      }
      message {
        en
        fr
      }
    }
  }
`);

const UpdateSitewideAnnouncement_Mutation = graphql(/* GraphQL */ `
  mutation UpdateSitewideAnnouncement(
    $sitewideAnnouncementInput: SitewideAnnouncementInput!
  ) {
    updateSitewideAnnouncement(
      sitewideAnnouncementInput: $sitewideAnnouncementInput
    ) {
      isEnabled
      publishDate
      expiryDate
      title {
        en
        fr
      }
      message {
        en
        fr
      }
    }
  }
`);

// To help the URQL cache work
// Keep the reference stable.
const context = { additionalTypenames: ["SitewideAnnouncement"] };

const AnnouncementsPage = () => {
  const intl = useIntl();
  const routes = useRoutes();
  const formattedPageTitle = intl.formatMessage(pageTitles.announcements);

  const [{ data: initialData, fetching: queryFetching, error: queryError }] =
    useQuery({
      query: AnnouncementPage_Query,
      context,
    });

  const [{ fetching: isSubmitting }, executeMutation] = useMutation(
    UpdateSitewideAnnouncement_Mutation,
  );

  const handleSave = async (input: SitewideAnnouncementInput) => {
    return executeMutation({ sitewideAnnouncementInput: input }, context).then(
      (result) => {
        if (result.data?.updateSitewideAnnouncement) {
          toast.success(
            intl.formatMessage({
              defaultMessage: "Sitewide announcement updated successfully!",
              id: "kY05h1",
              description:
                "Message displayed when a user successfully updates sitewide announcement information",
            }),
          );
          return;
        }
        throw new Error("Failed to save announcement");
      },
    );
  };

  const navigationCrumbs = useBreadcrumbs({
    crumbs: [
      {
        label: formattedPageTitle,
        url: routes.announcements(),
      },
    ],
  });

  return (
    <>
      <SEO title={formattedPageTitle} />
      <Hero title={formattedPageTitle} crumbs={navigationCrumbs} />
      <Container className="my-18">
        <Pending fetching={queryFetching} error={queryError}>
          <SitewideAnnouncementSection
            initialData={initialData?.sitewideAnnouncement}
            onUpdate={handleSave}
            isSubmitting={isSubmitting}
          />
        </Pending>
      </Container>
    </>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.PlatformAdmin]}>
    <AnnouncementsPage />
  </RequireAuth>
);

Component.displayName = "AdminAnnouncementsPage";

export default Component;
