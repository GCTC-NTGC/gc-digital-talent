import { useIntl } from "react-intl";

import { Heading, CardBasic, Link } from "@gc-digital-talent/ui";
import { formatDate, parseDateTimeUtc } from "@gc-digital-talent/date-helpers";
import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";

interface TalentNominationEventCardProps {
  talentNominationEventQuery: FragmentType<
    typeof TalentNominationEventCard_Fragment
  >;
}

export const TalentNominationEventCard_Fragment = graphql(/* GraphQL */ `
  fragment TalentNominationEventCard on TalentNominationEvent {
    id
    name {
      localized
    }
    description {
      localized
    }
    openDate
    closeDate
    learnMoreUrl {
      localized
    }
    community {
      name {
        localized
      }
    }
  }
`);

const TalentNominationEventCard = ({
  talentNominationEventQuery,
}: TalentNominationEventCardProps) => {
  const intl = useIntl();
  const talentNominationEvent = getFragment(
    TalentNominationEventCard_Fragment,
    talentNominationEventQuery,
  );
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
          {talentNominationEvent.name.localized}
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
            {talentNominationEvent.community?.name?.localized}
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
                  date: parseDateTimeUtc(talentNominationEvent.openDate),
                  formatString: "MMMM d, yyyy",
                  intl,
                  timeZone: localTimeZone,
                }),
                closeDate: formatDate({
                  date: parseDateTimeUtc(talentNominationEvent.closeDate),
                  formatString: "MMMM d, yyyy",
                  intl,
                  timeZone: localTimeZone,
                }),
              },
            )}
          </p>
          <p data-h2-margin-bottom="base(x1)">
            {talentNominationEvent.description?.localized}
          </p>
          <div
            data-h2-align-items="base(center)"
            data-h2-display="base(flex)"
            data-h2-gap="base(x1)"
            data-h2-flex-direction="base(column) p-tablet(row)"
          >
            <Link color="secondary" mode="solid" href="#">
              {intl.formatMessage(
                {
                  defaultMessage:
                    "Start a nomination<hidden> for {title}</hidden>",
                  id: "ZqGZ2s",
                  description: "Button label to start a nomination for event",
                },
                { title: talentNominationEvent.name.localized },
              )}
            </Link>
            {talentNominationEvent.learnMoreUrl?.localized && (
              <Link
                color="secondary"
                mode="inline"
                href={talentNominationEvent.learnMoreUrl.localized}
                external
                newTab
              >
                {intl.formatMessage(
                  {
                    defaultMessage: "Learn more<hidden> about {title}</hidden>",
                    id: "5dSChw",
                    description: "Button label to Learn more about event",
                  },
                  { title: talentNominationEvent.name.localized },
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
