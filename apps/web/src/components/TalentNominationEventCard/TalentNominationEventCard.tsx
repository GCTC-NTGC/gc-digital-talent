import { useIntl } from "react-intl";

import { Heading, Card, Link } from "@gc-digital-talent/ui";
import { formatDate, parseDateTimeUtc } from "@gc-digital-talent/date-helpers";
import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";

import useRoutes from "~/hooks/useRoutes";

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
  const paths = useRoutes();
  const talentNominationEvent = getFragment(
    TalentNominationEventCard_Fragment,
    talentNominationEventQuery,
  );
  const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <>
      <Card className="relative flex flex-col p-7.5 pt-6">
        <Heading level="h6" className="order-2 font-bold">
          {talentNominationEvent.name.localized}
        </Heading>
        <div className="order-1 drop-shadow-(--ribbon-shadow)">
          <div
            className="relative -ml-10.5 inline-block rounded-l-md bg-secondary-100 py-1 pr-9 pl-10.5 text-sm/normal font-bold text-black dark:text-secondary-700"
            style={{
              clipPath:
                "polygon(0% 0%, 100% 0%, calc(100% - 1rem) 50%, 100% 100%, 0% 100%)",
            }}
          >
            {talentNominationEvent.community?.name?.localized}
          </div>
        </div>
        <div className="order-3">
          <p className="mb-3 text-gray-600 dark:text-gray-200">
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
          <p className="mb-6">{talentNominationEvent.description?.localized}</p>
          <div className="flex flex-col items-center gap-6 xs:flex-row">
            <Link
              mode="solid"
              color="primary"
              href={paths.createTalentNomination(talentNominationEvent.id)}
            >
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
                color="primary"
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
      </Card>
    </>
  );
};

export default TalentNominationEventCard;
