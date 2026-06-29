import { isAfter } from "date-fns/isAfter";
import { isBefore } from "date-fns/isBefore";
import { useQuery } from "urql";
import { useIntl } from "react-intl";
import { lazy, Suspense } from "react";

import { graphql } from "@gc-digital-talent/graphql";
import { parseDateTimeUtc } from "@gc-digital-talent/date-helpers";
import { Loading } from "@gc-digital-talent/ui";
import { getLocale } from "@gc-digital-talent/i18n";
import { useLocalStorage } from "@gc-digital-talent/storage";

import { useStableDate } from "~/hooks/useStableDate";

const BannerContent = lazy(() => import("./BannerContent"));

const SitewideBanner_Query = graphql(/* GraphQL */ `
  query SitewideBanner {
    sitewideAnnouncement {
      isEnabled
      isDismissible
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
      updatedAt
    }
  }
`);

// local storage key
const AnnouncementDismissedAtKey = "sitewide_announcement_dismissed_at";

const SitewideBanner = () => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const now = useStableDate();

  const [{ data }] = useQuery({
    query: SitewideBanner_Query,
  });

  const [announcementDismissedAt, setAnnouncementDismissedAt] =
    useLocalStorage<number>(AnnouncementDismissedAtKey, 0);

  // Outage time range, date, starttime
  const announcementIsEnabled = !!data?.sitewideAnnouncement?.isEnabled;
  const announcementIsDismissible = !!data?.sitewideAnnouncement?.isDismissible;

  // publish date
  const announcementPublishDate = data?.sitewideAnnouncement?.publishDate
    ? parseDateTimeUtc(data.sitewideAnnouncement.publishDate)
    : null;
  const announcementPublishDateIsValid =
    announcementPublishDate && !Number.isNaN(announcementPublishDate.getTime());
  const nowIsAfterValidPublishDate =
    announcementPublishDateIsValid && isAfter(now, announcementPublishDate);

  // expiry date
  const announcementExpiryDate = data?.sitewideAnnouncement?.expiryDate
    ? parseDateTimeUtc(data.sitewideAnnouncement.expiryDate)
    : null;
  const announcementExpiryDateIsValid =
    announcementExpiryDate && !Number.isNaN(announcementExpiryDate.getTime());
  const nowIsBeforeValidExpiryDate =
    announcementExpiryDateIsValid && isBefore(now, announcementExpiryDate);

  // dismissed
  const announcementUpdatedAt = data?.sitewideAnnouncement?.updatedAt
    ? parseDateTimeUtc(data?.sitewideAnnouncement?.updatedAt).valueOf()
    : 0;
  const announcementIsDismissed =
    announcementIsDismissible &&
    announcementDismissedAt >= announcementUpdatedAt;

  const showMaintenanceBanner =
    announcementIsEnabled &&
    nowIsAfterValidPublishDate &&
    nowIsBeforeValidExpiryDate &&
    !announcementIsDismissed;

  const title = data?.sitewideAnnouncement?.title[locale];
  const message = data?.sitewideAnnouncement?.message[locale];

  const handleDismiss = () => {
    setAnnouncementDismissedAt(announcementUpdatedAt);
  };

  if (!title || !message) {
    return null;
  }

  return (
    showMaintenanceBanner && (
      <Suspense fallback={<Loading inline />}>
        <BannerContent
          title={title}
          message={message}
          onDismiss={announcementIsDismissible ? handleDismiss : undefined}
        />
      </Suspense>
    )
  );
};

export default SitewideBanner;
