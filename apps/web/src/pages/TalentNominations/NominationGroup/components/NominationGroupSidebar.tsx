import { useState } from "react";
import { useIntl } from "react-intl";

import {
  Accordion,
  CardBasic,
  Heading,
  Separator,
} from "@gc-digital-talent/ui";
import {
  FragmentType,
  getFragment,
  graphql,
  TalentNominationGroupStatus,
} from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import { getFullNameLabel } from "~/utils/nameUtils";
import { getClassificationName } from "~/utils/poolUtils";
import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";
import adminMessages from "~/messages/adminMessages";

import NominatedForList from "./NominatedForList";
import NominatorList from "./NominatorList";
import NominationNavigation from "./NominationNavigation/NominationNavigation";
import CommentsForm from "./CommentsForm";
import NominationGroupEvaluationDialog from "./NominationGroupEvaluationDialog";

type AccordionStates = "nominee-contact-information" | "comments" | "";

export const NominationGroupSidebar_Fragment = graphql(/* GraphQL */ `
  fragment NominationGroupSidebar on TalentNominationGroup {
    id
    ...NominationGroupSidebarForList
    status {
      value
      label {
        localized
      }
    }
    nominee {
      id
      workEmail
      firstName
      lastName
      role
      preferredLang {
        label {
          localized
        }
      }
      classification {
        id
        group
        level
      }
      department {
        name {
          localized
        }
      }
    }
    nominations {
      id
      ...NominatorList
      nominator {
        id
        firstName
        lastName
      }
    }
    ...CommentsForm
  }
`);

export interface NominationGroupSidebarProps {
  talentNominationGroupQuery: FragmentType<
    typeof NominationGroupSidebar_Fragment
  >;
}

const NominationGroupSidebar = ({
  talentNominationGroupQuery,
}: NominationGroupSidebarProps) => {
  const intl = useIntl();

  const [accordionState, setAccordionState] = useState<AccordionStates>("");

  const talentNominationGroup = getFragment(
    NominationGroupSidebar_Fragment,
    talentNominationGroupQuery,
  );

  // set the styling colours of the status bar and button
  let statusTextboxColours;
  let statusButtonColours;
  const approvedStatusTextboxColours = {
    "data-h2-background-color":
      "base(success.lightest) base:dark(success.lightest)",
    "data-h2-border-color": "base(success.darker) base:dark(success.darker)",
    "data-h2-color": "base(success.darker) base:dark(success.darker)",
  };
  const approvedStatusButtonColours = {
    "data-h2-background-color":
      "base(success.darkest) base:dark(success.darkest)",
    "data-h2-color": "base(success.lightest) base:dark(success.lightest)",
  };

  const inProgressStatusTextboxColours = {
    "data-h2-background-color":
      "base(secondary.lightest) base:dark(secondary.lightest)",
    "data-h2-border-color": "base(secondary.dark) base:dark(secondary.dark)",
    "data-h2-color": "base(secondary.darkest) base:dark(secondary.darkest)",
  };
  const inProgressStatusButtonColours = {
    "data-h2-background-color":
      "base(secondary.darkest) base:dark(secondary.darkest)",
    "data-h2-color": "base(secondary.lightest) base:dark(secondary.lightest)",
  };

  const rejectedStatusTextboxColours = {
    "data-h2-background-color":
      "base(error.lightest) base:dark(error.lightest)",
    "data-h2-border-color": "base(error.darker) base:dark(error.darker)",
    "data-h2-color": "base(error.darker) base:dark(error.darker)",
  };
  const rejectedStatusButtonColours = {
    "data-h2-background-color": "base(error.darkest) base:dark(error.darkest)",
    "data-h2-color": "base(error.lightest) base:dark(error.lightest)",
  };

  statusTextboxColours = approvedStatusTextboxColours;
  statusButtonColours = approvedStatusButtonColours;
  if (
    talentNominationGroup.status?.value ===
    TalentNominationGroupStatus.InProgress
  ) {
    statusTextboxColours = inProgressStatusTextboxColours;
    statusButtonColours = inProgressStatusButtonColours;
  } else if (
    talentNominationGroup.status?.value === TalentNominationGroupStatus.Rejected
  ) {
    statusTextboxColours = rejectedStatusTextboxColours;
    statusButtonColours = rejectedStatusButtonColours;
  }

  return (
    <div
      data-h2-display="base(flex)"
      data-h2-flex-direction="base(column)"
      data-h2-padding="base(0)"
      data-h2-gap="base(x.5)"
    >
      <CardBasic
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column)"
        data-h2-justify-content="base(center)"
        data-h2-padding="base(0)"
      >
        <div
          data-h2-padding="base(x1.25 x1.25 0 x1.25)"
          data-h2-display="base(flex)"
          data-h2-flex-direction="base(column)"
        >
          <p
            data-h2-padding-bottom="base(x.25)"
            data-h2-color="base(black.light)"
          >
            {!!talentNominationGroup.nominee?.classification?.group &&
            !!talentNominationGroup.nominee.classification.level
              ? getClassificationName(
                  {
                    group: talentNominationGroup.nominee.classification.group,
                    level: talentNominationGroup.nominee.classification.level,
                  },
                  intl,
                )
              : intl.formatMessage(commonMessages.notProvided)}
          </p>
          <Heading
            size="h6"
            data-h2-margin="base(0)"
            data-h2-padding-bottom="base(x.5)"
          >
            {getFullNameLabel(
              talentNominationGroup.nominee?.firstName,
              talentNominationGroup.nominee?.lastName,
              intl,
            )}
          </Heading>
          <p data-h2-padding-bottom="base(x1)">
            {talentNominationGroup.nominee?.department?.name?.localized ??
              intl.formatMessage(commonMessages.notProvided)}
          </p>
          <div data-h2-display="base(flex)">
            <div
              data-h2-padding="base(x.5 x4 x.5 x.5) p-tablet(x.5 x7 x.5 x.5) l-tablet(x.5 x1 x.5 x.5) desktop(x.5 x2 x.5 x.5)"
              data-h2-width="base(50%) l-tablet(75%)"
              data-h2-radius="base(x.375 0 0 x.375)"
              data-h2-background-color={
                statusTextboxColours["data-h2-background-color"]
              }
              data-h2-border="base(1px solid)"
              data-h2-border-color={
                statusTextboxColours["data-h2-border-color"]
              }
            >
              <span
                data-h2-margin-top="base(x.1)"
                data-h2-font-weight="base(700)"
                data-h2-vertical-align="base(middle)"
                data-h2-color={statusTextboxColours["data-h2-color"]}
              >
                {talentNominationGroup.status?.label.localized ??
                  intl.formatMessage(commonMessages.notAvailable)}
              </span>
            </div>
            <div
              data-h2-padding="base(x.375 x.375 x.375 x.375)"
              data-h2-radius="base(0 x.375 x.375 0)"
              data-h2-background-color={
                statusButtonColours["data-h2-background-color"]
              }
            >
              <NominationGroupEvaluationDialog
                triggerButtonColor={statusButtonColours["data-h2-color"]}
              />
            </div>
          </div>
        </div>
        <Separator data-h2-margin="base(x1 0)" decorative space="none" />
        <div data-h2-padding="base(0 x1.25 x1 x1.25)">
          <p data-h2-font-weight="base(700)">
            {intl.formatMessage({
              defaultMessage: "Nominated by",
              id: "ULsL3v",
              description: "Nominated by header",
            })}
          </p>
          <NominatorList
            query={unpackMaybes(talentNominationGroup.nominations)}
          />
          <p
            data-h2-font-weight="base(700)"
            data-h2-padding-top="base(x1)"
            data-h2-padding-bottom="base(x.25)"
          >
            {intl.formatMessage({
              defaultMessage: "Nominated for",
              id: "OODa6h",
              description: "Nominated for header",
            })}
          </p>
          <NominatedForList
            nominationGroupSidebarForListQuery={talentNominationGroup}
          />
        </div>
        <Accordion.Root
          type="single"
          size="sm"
          value={accordionState}
          onValueChange={(value: AccordionStates) => setAccordionState(value)}
          collapsible
        >
          <Separator decorative space="none" />
          <Accordion.Item
            value="nominee-contact-information"
            data-h2-padding="base(x.5 x1.25 x.5 x1.25)"
          >
            <Accordion.Trigger as="h3">
              {intl.formatMessage({
                defaultMessage: "Nominee contact information",
                id: "W9HNlU",
                description: "Expandable to see nominee information",
              })}
            </Accordion.Trigger>
            <Accordion.Content>
              <div
                data-h2-display="base(grid)"
                data-h2-grid-template-columns="base(repeat(1, 1fr)) p-tablet(repeat(2, 1fr)) l-tablet(repeat(1, 1fr))"
                data-h2-gap="base(x1)"
                data-h2-overflow-wrap="base(anywhere)"
              >
                <FieldDisplay
                  label={intl.formatMessage(commonMessages.workEmail)}
                >
                  {talentNominationGroup.nominee?.workEmail
                    ? talentNominationGroup.nominee.workEmail
                    : intl.formatMessage(commonMessages.notProvided)}
                </FieldDisplay>
                <FieldDisplay
                  label={intl.formatMessage(
                    commonMessages.preferredCommunicationLanguage,
                  )}
                >
                  {talentNominationGroup.nominee?.preferredLang?.label
                    ?.localized
                    ? talentNominationGroup.nominee.preferredLang.label
                        .localized
                    : intl.formatMessage(commonMessages.notProvided)}
                </FieldDisplay>
              </div>
            </Accordion.Content>
          </Accordion.Item>
          <Separator decorative space="none" />
          <Accordion.Item
            value="comments"
            data-h2-padding="base(x.5 x1.25 x.5 x1.25)"
          >
            <Accordion.Trigger as="h3">
              {intl.formatMessage(adminMessages.comments)}
            </Accordion.Trigger>
            <Accordion.Content>
              <CommentsForm nominationGroup={talentNominationGroup} />
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      </CardBasic>
      <NominationNavigation />
    </div>
  );
};

export default NominationGroupSidebar;
