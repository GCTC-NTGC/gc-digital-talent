/* eslint-disable import/no-duplicates */
import { isAfter } from "date-fns/isAfter";
import { isBefore } from "date-fns/isBefore";
import { useQuery } from "urql";
import { useIntl } from "react-intl";

import { graphql } from "@gc-digital-talent/graphql";
import { parseDateTimeUtc } from "@gc-digital-talent/date-helpers";
import { Alert } from "@gc-digital-talent/ui";
import { getLocale } from "@gc-digital-talent/i18n";
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
  const intl = useIntl();
  const locale = getLocale(intl);

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
        data-h2-padding="base(x1, 0)"
      >
        <div data-h2-wrapper="base(center, large, x1)">
          <Alert.Root
            type="warning"
            live
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
