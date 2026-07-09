import { useIntl } from "react-intl";
import ArrowDownTrayIcon from "@heroicons/react/16/solid/ArrowDownTrayIcon";
import CheckCircleIcon from "@heroicons/react/20/solid/CheckCircleIcon";
import XCircleIcon from "@heroicons/react/20/solid/XCircleIcon";
import QuestionMarkCircleIcon from "@heroicons/react/20/solid/QuestionMarkCircleIcon";
import type React from "react";

import {
  getFragment,
  graphql,
  TalentNominationGroupDecision,
  type FragmentType,
} from "@gc-digital-talent/graphql";
import {
  Accordion,
  Button,
  Chip,
  wrapParens,
  UNICODE_CHAR,
  type ChipProps,
  type IconType,
  PreviewList,
} from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import talentNominationMessages from "~/messages/talentNominationMessages";
import useNominationDownloads from "~/hooks/useNominationDownloads";
import SpinnerIcon from "~/components/SpinnerIcon/SpinnerIcon";

import NominationHistoryListItem from "./NominationHistoryListItem";

const NominationEventAccordionItem_Fragment = graphql(/* GraphQL */ `
  fragment NominationEventAccordionItem on TalentNominationGroup {
    id
    talentNominationEvent {
      id
      name {
        localized
      }
    }
    advancementNominationCount
    advancementDecision {
      value
    }
    lateralMovementNominationCount
    lateralMovementDecision {
      value
    }
    developmentProgramsNominationCount
    developmentProgramsDecision {
      value
    }
    nominations {
      id
      submittedAt
      nominator {
        firstName
        lastName
      }
      ...NominationHistoryListItem
    }
  }
`);

// Maps a decision to the chip colour and icon
const decisionAppearance = (
  decision: TalentNominationGroupDecision | null | undefined,
): { color: ChipProps["color"]; icon: IconType } => {
  switch (decision) {
    case TalentNominationGroupDecision.Approved:
      return { color: "success", icon: CheckCircleIcon };
    case TalentNominationGroupDecision.Rejected:
      return { color: "error", icon: XCircleIcon };
    default:
      return { color: "primary", icon: QuestionMarkCircleIcon };
  }
};

interface NominationEventAccordionItemProps {
  nominationGroupQuery: FragmentType<
    typeof NominationEventAccordionItem_Fragment
  >;
  optionsQuery: React.ComponentProps<
    typeof NominationHistoryListItem
  >["optionsQuery"];
}

const NominationEventAccordionItem = ({
  nominationGroupQuery,
  optionsQuery,
}: NominationEventAccordionItemProps) => {
  const intl = useIntl();
  const { downloadDoc, downloadingDoc } = useNominationDownloads();

  const nominationGroup = getFragment(
    NominationEventAccordionItem_Fragment,
    nominationGroupQuery,
  );

  // Get decisions from the nomination group
  const advancementDecision = nominationGroup.advancementDecision?.value;
  const lateralMovementDecision =
    nominationGroup.lateralMovementDecision?.value;
  const developmentProgramsDecision =
    nominationGroup.developmentProgramsDecision?.value;

  // sort nominations
  const nominations = unpackMaybes(nominationGroup.nominations);
  nominations.sort(
    (a, b) =>
      (a.nominator?.lastName?.localeCompare(b.nominator?.lastName ?? "") ??
        0) ||
      (a.nominator?.firstName?.localeCompare(b.nominator?.firstName ?? "") ??
        0) ||
      (a.submittedAt?.localeCompare(b.submittedAt ?? "") ?? 0),
  );

  const decisionChips = [
    {
      key: "advancement",
      count: nominationGroup.advancementNominationCount ?? 0,
      decision: advancementDecision,
      label: talentNominationMessages.nominateForAdvancement,
    },
    {
      key: "lateral-movement",
      count: nominationGroup.lateralMovementNominationCount ?? 0,
      decision: lateralMovementDecision,
      label: talentNominationMessages.nominateForLateralMovement,
    },
    {
      key: "development",
      count: nominationGroup.developmentProgramsNominationCount ?? 0,
      decision: developmentProgramsDecision,
      label: talentNominationMessages.development,
    },
  ].filter((chip) => chip.count > 0);

  const eventName =
    nominationGroup.talentNominationEvent.name.localized ??
    intl.formatMessage(commonMessages.notFound);

  return (
    <Accordion.Item value={nominationGroup.id}>
      <div className="xxs:pl-1 sm:pl-4">
        <Accordion.Trigger
          as="h3"
          title={eventName}
          subtitle={
            decisionChips.length > 0 ? (
              <span className="mt-1.5 flex flex-wrap items-center gap-1.5">
                {decisionChips.map(({ key, decision, label }) => {
                  const { color, icon } = decisionAppearance(decision);
                  return (
                    <Chip key={key} color={color} icon={icon}>
                      <span className="font-normal">
                        {intl.formatMessage(label)}
                      </span>
                    </Chip>
                  );
                })}
                <span className="ml-2 text-gray-400">
                  {UNICODE_CHAR.BULLET}
                </span>
                <Button
                  type="button"
                  mode="inline"
                  icon={downloadingDoc ? SpinnerIcon : ArrowDownTrayIcon}
                  disabled={downloadingDoc}
                  onClick={(e) => {
                    e.stopPropagation();
                    downloadDoc({ id: nominationGroup.id });
                  }}
                  className="ml-1 font-normal text-black dark:text-white"
                >
                  {intl.formatMessage(commonMessages.download)}
                </Button>
              </span>
            ) : null
          }
        >
          <span>{eventName}</span>
          <span className="ml-1.5 font-normal text-gray-500 dark:text-gray-200">
            {wrapParens(nominations.length)}
          </span>
        </Accordion.Trigger>

        <Accordion.Content>
          <PreviewList.Root>
            {nominations.map((nomination) => (
              <NominationHistoryListItem
                key={nomination.id}
                nominationQuery={nomination}
                optionsQuery={optionsQuery}
                advancementDecision={advancementDecision}
                lateralMovementDecision={lateralMovementDecision}
                developmentProgramsDecision={developmentProgramsDecision}
              />
            ))}
          </PreviewList.Root>
        </Accordion.Content>
      </div>
    </Accordion.Item>
  );
};

export default NominationEventAccordionItem;
