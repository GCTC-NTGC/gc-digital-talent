import { useIntl } from "react-intl";

import { Heading, CardBasic, Link } from "@gc-digital-talent/ui";
import { formatDate } from "@gc-digital-talent/date-helpers";

interface TalentNominationEventCardProps {
  mode: "Current"; // more modes coming soon.
  communityName: string;
  title: string;
  openDate: Date;
  closeDate: Date;
  description: string;
  startUrl: string;
  learnMoreUrl?: string;
}

const TalentNominationEventCard = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  mode, // not used.
  communityName,
  title,
  openDate,
  closeDate,
  description,
  startUrl,
  learnMoreUrl,
}: TalentNominationEventCardProps) => {
  const intl = useIntl();
  const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <>
      <CardBasic
        data-h2-padding="base(x1 x1.5 x1.5 x1.5)"
        data-h2-position="base(relative)"
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column)"
      >
        <Heading
          level="h6"
          data-h2-font-weight="base(700)"
          data-h2-order="base(2)"
        >
          {title}
        </Heading>
        <div
          data-h2-order="base(1)"
          data-h2-filter="base(drop-shadow(0 2px 2px rgba(0, 0, 0, .2))) base:dark(drop-shadow(0 2px 2px rgba(0, 0, 0, .5)))"
        >
          <div
            data-h2-background="base(primary.lightest) base:dark(primary.lightest)"
            data-h2-border-radius="base(rounded 0 0 rounded)"
            data-h2-clip-path="base(polygon(0% 0%, 100% 0%, calc(100% - 1rem) 50%, 100% 100%, 0% 100%))"
            data-h2-color="base(black) base:dark(primary.darkest)"
            data-h2-display="base(inline-block)"
            data-h2-font-size="base(caption)"
            data-h2-font-weight="base(700)"
            data-h2-line-height="base(x.175)"
            data-h2-margin="base(0 0 0 -x1.75)"
            data-h2-padding="base(x.175 x1.5 x.175 x1.75)"
            data-h2-position="base(relative)"
          >
            {communityName}
          </div>
        </div>
        <div data-h2-order="base(3)">
          <p
            data-h2-margin-bottom="base(x.5)"
            data-h2-color="base(black.light)"
          >
            {intl.formatMessage(
              {
                defaultMessage:
                  "Accepting nominations from {openDate} to {closeDate}.",
                id: "8UrSRQ",
                description:
                  "Text for date range values for Accepting nominations",
              },
              {
                openDate: formatDate({
                  date: openDate,
                  formatString: "MMMM d, yyyy",
                  intl,
                  timeZone: localTimeZone,
                }),
                closeDate: formatDate({
                  date: closeDate,
                  formatString: "MMMM d, yyyy",
                  intl,
                  timeZone: localTimeZone,
                }),
              },
            )}
          </p>
          <p data-h2-margin-bottom="base(x1)">{description}</p>
          <div
            data-h2-align-items="base(center)"
            data-h2-display="base(flex)"
            data-h2-gap="base(x1)"
            data-h2-flex-direction="base(column) p-tablet(row)"
          >
            <Link color="secondary" mode="solid" href={startUrl}>
              {intl.formatMessage(
                {
                  defaultMessage:
                    "Start a nomination<hidden> for {title}</hidden>",
                  id: "ZqGZ2s",
                  description: "Button label to start a nomination for event",
                },
                { title },
              )}
            </Link>
            {learnMoreUrl && (
              <Link
                color="secondary"
                mode="inline"
                href={learnMoreUrl}
                external
                newTab
              >
                {intl.formatMessage(
                  {
                    defaultMessage: "Learn more<hidden> about {title}</hidden>",
                    id: "5dSChw",
                    description: "Button label to Learn more about event",
                  },
                  { title },
                )}
              </Link>
            )}
          </div>
        </div>
      </CardBasic>
    </>
  );
};

export default TalentNominationEventCard;
