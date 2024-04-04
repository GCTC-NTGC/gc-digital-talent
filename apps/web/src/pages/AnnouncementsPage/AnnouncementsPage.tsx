import * as React from "react";
import { MessageDescriptor, defineMessage, useIntl } from "react-intl";
import MegaphoneOutlineIcon from "@heroicons/react/24/outline/MegaphoneIcon";
import MegaphoneSolidIcon from "@heroicons/react/24/solid/MegaphoneIcon";
import { useQuery, useMutation } from "urql";

import { SitewideAnnouncementInput, graphql } from "@gc-digital-talent/graphql";
import { Pending, IconType } from "@gc-digital-talent/ui";
import { toast } from "@gc-digital-talent/toast";
import { commonMessages } from "@gc-digital-talent/i18n";

import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import AdminHero from "~/components/Hero/AdminHero";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";

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

export const pageTitle: MessageDescriptor = defineMessage({
  defaultMessage: "Announcements",
  id: "ll9u08",
  description: "Page title for the announcements page",
});
export const pageOutlineIcon: IconType = MegaphoneOutlineIcon;
export const pageSolidIcon: IconType = MegaphoneSolidIcon;

// To help the URQL cache work
// Keep the reference stable.
const context = { additionalTypenames: ["SitewideAnnouncement"] };

const AnnouncementsPage = () => {
  const intl = useIntl();
  const routes = useRoutes();
  const formattedPageTitle = intl.formatMessage(pageTitle);

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
          toast.success(intl.formatMessage(commonMessages.success));
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
        <Pending fetching={queryFetching} error={queryError}>
          <SitewideAnnouncementSection
            initialData={initialData?.sitewideAnnouncement}
            onUpdate={handleSave}
            isSubmitting={isSubmitting}
          />
        </Pending>
      </AdminContentWrapper>
    </>
  );
};

export default AnnouncementsPage;
