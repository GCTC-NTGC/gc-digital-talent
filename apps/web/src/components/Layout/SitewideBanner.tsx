/* eslint-disable import/no-duplicates */
import React from "react";
import { isAfter } from "date-fns/isAfter";
import { isBefore } from "date-fns/isBefore";
import { useQuery } from "urql";

import { graphql } from "@gc-digital-talent/graphql";
import { parseDateTimeUtc } from "@gc-digital-talent/date-helpers";
import { Alert } from "@gc-digital-talent/ui";
import { useLocale } from "@gc-digital-talent/i18n";
import { RichTextRenderer, htmlToRichTextJSON } from "@gc-digital-talent/forms";

const SitewideBanner_Query = graphql(/* GraphQL */ `
  query SitewideBanner {
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

const SitewideBanner = () => {
  const { locale } = useLocale();

  const [{ data }] = useQuery({
    query: SitewideBanner_Query,
  });

  // Outage time range, date, starttime
  const announcementIsEnabled = !!data?.sitewideAnnouncement?.isEnabled;
  const announcementPublishDate = data?.sitewideAnnouncement?.publishDate
    ? parseDateTimeUtc(data.sitewideAnnouncement.publishDate)
    : null;
  const announcementPublishDateIsValid =
    announcementPublishDate && !Number.isNaN(announcementPublishDate.getTime());

  const announcementExpiryDate = data?.sitewideAnnouncement?.expiryDate
    ? parseDateTimeUtc(data.sitewideAnnouncement.expiryDate)
    : null;
  const announcementExpiryDateIsValid =
    announcementExpiryDate && !Number.isNaN(announcementExpiryDate.getTime());

  const showMaintenanceBanner =
    announcementIsEnabled &&
    announcementPublishDateIsValid &&
    isAfter(Date.now(), announcementPublishDate) &&
    announcementExpiryDateIsValid &&
    isBefore(Date.now(), announcementExpiryDate);

  const title = data?.sitewideAnnouncement?.title[locale];
  const message = data?.sitewideAnnouncement?.message[locale];

  if (!title || !message) {
    return null;
  }

  return (
    showMaintenanceBanner && (
      <div
        data-h2-background-color="base(foreground) base:dark(white)"
        className="py-6"
      >
        <div data-h2-container="base(center, large, x1)">
          <Alert.Root type="warning" live className="shadow-none -mx-6">
            <Alert.Title>{title}</Alert.Title>
            <RichTextRenderer node={htmlToRichTextJSON(message)} />
          </Alert.Root>
        </div>
      </div>
    )
  );
};

export default SitewideBanner;
