/* eslint-disable import/no-duplicates */
import React from "react";
import { useIntl } from "react-intl";
import isAfter from "date-fns/isAfter";
import isBefore from "date-fns/isBefore";
import isEqual from "date-fns/isEqual";
import { useQuery } from "urql";

import { graphql } from "@gc-digital-talent/graphql";
import { formatDate, parseDateTimeUtc } from "@gc-digital-talent/date-helpers";
import { getRuntimeVariable } from "@gc-digital-talent/env";
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
      <div data-h2-background-color="base:all(warning.lightest)">
        <div data-h2-container="base(center, large, x1)">
          <Alert.Root
            type="warning"
            live
            banner
            data-h2-shadow="base(none)"
            data-h2-margin="base(0, -x1, 0, -x1)"
          >
            <Alert.Title>{title}</Alert.Title>
            <RichTextRenderer node={htmlToRichTextJSON(message)} />
          </Alert.Root>
        </div>
      </div>
    )
  );
};

export default SitewideBanner;
