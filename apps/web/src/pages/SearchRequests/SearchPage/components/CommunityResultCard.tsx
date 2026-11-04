import { useIntl } from "react-intl";
import { useFormContext } from "react-hook-form";

import { Button, Card } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";

interface CommunityResultCardProps {
  community: { id: string; name?: { localized?: string | null } | null };
  workStreamName?: string;
  qualifiedInPoolCount: number;
  atLevelCount: number;
  advancementCount: number;
  lateralMovementCount: number;
  count: number;
  showQualifiedInPool: boolean;
  showAtLevel: boolean;
  showAdvancement: boolean;
  showLateralMovement: boolean;
}

const CommunityResultCard = ({
  community,
  workStreamName,
  qualifiedInPoolCount,
  atLevelCount,
  advancementCount,
  lateralMovementCount,
  count,
  showQualifiedInPool,
  showAtLevel,
  showAdvancement,
  showLateralMovement,
}: CommunityResultCardProps) => {
  const intl = useIntl();
  const { register, setValue } = useFormContext();
  const communitySubmitProps = register("communityId");
  const communityName =
    community.name?.localized ??
    intl.formatMessage(commonMessages.notAvailable);

  return (
    <Card
      as="article"
      className="rounded-l-none border-l-12 border-l-secondary"
      aria-labelledby={`search_community_${community.id}`}
    >
      <p
        className="text-lg font-bold lg:text-xl"
        id={`search_community_${community.id}`}
      >
        {communityName}
      </p>
      {workStreamName ? (
        <p className="mt-1 mb-6">
          {intl.formatMessage(
            {
              defaultMessage: "Work stream: {workStreamName}",
              id: "wgMSoS",
              description: "Work stream of the community results card.",
            },
            { workStreamName },
          )}
        </p>
      ) : null}
      <p className="mb-1.5">
        {intl.formatMessage({
          defaultMessage: "Matching candidates found",
          id: "1Yz1O6",
          description: "Lead-in text for the community results breakdown.",
        }) + intl.formatMessage(commonMessages.dividingColon)}
      </p>
      <ul className="mb-6 ml-6 list-disc">
        {showQualifiedInPool ? (
          <li>
            {intl.formatMessage(
              {
                defaultMessage: `{count, plural,
                  one {<strong>#</strong> Pool candidate}
                  other {<strong>#</strong> Pool candidates}
                }`,
                id: "mfXS89",
                description:
                  "Count of candidates qualified in a pool, on the community results card.",
              },
              { count: qualifiedInPoolCount },
            )}
          </li>
        ) : null}
        {showAtLevel ? (
          <li>
            {intl.formatMessage(
              {
                defaultMessage: `{count, plural,
                  one {<strong>#</strong> Community GC employee that has self-identified for lateral movement.}
                  other {<strong>#</strong> Community GC employees that have self-identified for lateral movement.}
                }`,
                id: "GIFvZI",
                description:
                  "Count of candidates matched at level, on the community results card.",
              },
              { count: atLevelCount },
            )}
          </li>
        ) : null}
        {showAdvancement ? (
          <li>
            {intl.formatMessage(
              {
                defaultMessage: `{count, plural,
                  one {<strong>#</strong> Nominated for advancement}
                  other {<strong>#</strong> Nominated for advancement}
                }`,
                id: "5bjzAS",
                description:
                  "Count of candidates nominated for advancement, on the community results card.",
              },
              { count: advancementCount },
            )}
          </li>
        ) : null}
        {showLateralMovement ? (
          <li>
            {intl.formatMessage(
              {
                defaultMessage: `{count, plural,
                  one {<strong>#</strong> Nominated for lateral movement}
                  other {<strong>#</strong> Nominated for lateral movement}
                }`,
                id: "GkcCus",
                description:
                  "Count of candidates nominated for lateral movement, on the community results card.",
              },
              { count: lateralMovementCount },
            )}
          </li>
        ) : null}
      </ul>
      <Button
        color="secondary"
        type="submit"
        {...communitySubmitProps}
        onClick={() => {
          setValue("pool", "");
          setValue("communityId", community.id);
          setValue("count", count);
        }}
        counter={count}
      >
        {intl.formatMessage({
          defaultMessage: "Request all matching candidates",
          id: "lDZ4wQ",
          description:
            "Button text to request all matching candidates for a community.",
        })}
      </Button>
    </Card>
  );
};

export default CommunityResultCard;
