import { isAfter } from "date-fns/isAfter";
import { isBefore } from "date-fns/isBefore";
import { useQuery } from "urql";
import { useIntl } from "react-intl";
import { lazy, Suspense } from "react";

import { graphql } from "@gc-digital-talent/graphql";
import { parseDateTimeUtc } from "@gc-digital-talent/date-helpers";
import { Loading } from "@gc-digital-talent/ui";
import { getLocale } from "@gc-digital-talent/i18n";

const BannerContent = lazy(() => import("./BannerContent"));

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
      <Suspense fallback={<Loading inline />}>
        <BannerContent title={title} message={message} />
      </Suspense>
    )
  );
};

export default SitewideBanner;
