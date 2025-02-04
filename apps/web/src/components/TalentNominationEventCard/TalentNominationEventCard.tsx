import { useIntl } from "react-intl";

import { Heading, CardBasic, Link } from "@gc-digital-talent/ui";
import { formatDate } from "@gc-digital-talent/date-helpers";
import { commonMessages } from "@gc-digital-talent/i18n";

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
      <CardBasic data-h2-padding="base(x1.5)" data-h2-position="base(relative)">
        <div
          data-h2-background="base(primary.lightest) base:dark(primary.lightest)"
          data-h2-border-color="base(inherit) base:selectors[::before](primary.lightest transparent transparent transparent) base:selectors[::after](transparent transparent transparent primary.lightest) base:dark:selectors[::before](primary.lightest transparent transparent transparent) base:dark:selectors[::after](transparent transparent transparent primary.lightest)"
          data-h2-border-radius="base(rounded 0 0 rounded)"
          data-h2-border-style="base(inherit) base:selectors[::before](solid) base:selectors[::after](solid)"
          data-h2-border-width="base(inherit) base:selectors[::before](x.613 x.613 0 0) base:selectors[::after](x.613 0 0 x.613)"
          data-h2-bottom="base(inherit) base:selectors[::after](0)"
          data-h2-box-shadow="base(small)"
          data-h2-color="base(black) base:dark(primary.darkest)"
          data-h2-content="base:selectors[::before](' ') base:selectors[::after](' ')"
          data-h2-display="base(inline-block) base:selectors[::before](block) base:selectors[::after](block)"
          data-h2-font-size="base(caption)"
          data-h2-font-weight="base(700)"
          data-h2-height="base(inherit) base:selectors[::before](0) base:selectors[::after](0)"
          data-h2-line-height="base(x.175)"
          data-h2-margin="base(0 0 0 -x1.75)"
          data-h2-padding="base(x.175 x.5 x.175 x1.75)"
          data-h2-position="base(relative) base:selectors[::before](absolute) base:selectors[::after](absolute)"
          data-h2-right="base(inherit) base:selectors[::before](0) base:selectors[::after](0)"
          data-h2-top="base(inherit) base:selectors[::before](0) base:selectors[::after](0)"
          data-h2-transform="base(inherit) base:selectors[::before](rotate(0deg) translate(100%, 0)) base:selectors[::after](rotate(0deg) translate(100%, 100%))"
          data-h2-width="base(inherit) base:selectors[::before](0) base:selectors[::after](0)"
        >
          {communityName}
        </div>
        <div>
          <Heading size="h6" data-h2-font-weight="base(700)">
            {title}
          </Heading>
          <p
            data-h2-margin-bottom="base(x.5)"
            data-h2-color="base(black.light)"
          >
            {intl.formatMessage({
              defaultMessage: "Accepting nominations",
              id: "rh/aqf",
              description:
                "Text before date range values for Accepting nominations",
            })}
            {intl.formatMessage(commonMessages.dividingColon)}
            {intl.formatMessage(
              {
                defaultMessage: "{openDate} to {closeDate}",
                id: "8jTgsz",
                description: "Text date range values for Accepting nominations",
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
          <div data-h2-text-align="base(center) p-tablet(inherit)">
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
                data-h2-margin-top="base(x1) p-tablet(none)"
                data-h2-margin-left="base(0) p-tablet(x1)"
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
