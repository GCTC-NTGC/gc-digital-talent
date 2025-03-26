import { useState } from "react";
import { useIntl } from "react-intl";

import {
  Accordion,
  CardBasic,
  Heading,
  Separator,
} from "@gc-digital-talent/ui";
import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";
import { insertBetween } from "@gc-digital-talent/helpers";

import { getFullNameLabel } from "~/utils/nameUtils";
import { getClassificationName } from "~/utils/poolUtils";

import NominatedForList from "./NominatedForList";

type AccordionStates = "nominee-contact-information" | "comments" | "";

export const NominationGroupSidebar_Fragment = graphql(/* GraphQL */ `
  fragment NominationGroupSidebar on TalentNominationGroup {
    id
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
    status {
      value
      label {
        localized
      }
    }
    nominee {
      id
      email
      workEmail
      firstName
      lastName
      role
      telephone
      preferredLang {
        label {
          localized
        }
      }
      currentClassification {
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
      nominator {
        id
        firstName
        lastName
      }
    }
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

  const nominations = talentNominationGroup.nominations ?? [];

  // dialog to go somewhere in span?
  const nominationsSortedByNominator = nominations.sort((a, b) => {
    return (
      (a.nominator?.lastName ?? "").localeCompare(
        b.nominator?.lastName ?? "",
      ) ||
      (a.nominator?.firstName ?? "").localeCompare(b.nominator?.firstName ?? "")
    );
  });
  const nominatorsList = nominationsSortedByNominator.map((nomination) => (
    <span key={nomination.id}>
      {getFullNameLabel(
        nomination.nominator?.firstName,
        nomination.nominator?.lastName,
        intl,
      )}
    </span>
  ));
  const nominatorListCommaSeparated = insertBetween(
    // eslint-disable-next-line formatjs/no-literal-string-in-jsx
    <span>, </span>,
    nominatorsList,
  );

  return (
    <div
      data-h2-display="base(flex)"
      data-h2-flex-direction="base(column)"
      data-h2-padding="base(0)"
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
            {!!talentNominationGroup.nominee?.currentClassification?.group &&
            !!talentNominationGroup.nominee.currentClassification.level
              ? getClassificationName(
                  {
                    group:
                      talentNominationGroup.nominee.currentClassification.group,
                    level:
                      talentNominationGroup.nominee.currentClassification.level,
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
          <p data-h2-padding-bottom="base(x.5)">
            {talentNominationGroup.nominee?.department?.name?.localized ??
              intl.formatMessage(commonMessages.notProvided)}
          </p>
          <p>{"abc"}</p>
        </div>
        <Separator data-h2-margin="base(x1 0)" decorative space="none" />
        <div data-h2-padding="base(0 x1.25 x1 x1.25)">
          <p data-h2-font-weight="base(700)">
            {intl.formatMessage({
              defaultMessage: "Nominated By",
              id: "bXlXXU",
              description: "abc",
            })}
          </p>
          {nominatorListCommaSeparated}
          <p
            data-h2-font-weight="base(700)"
            data-h2-padding-top="base(x1)"
            data-h2-padding-bottom="base(x.25)"
          >
            {intl.formatMessage({
              defaultMessage: "Nominated For",
              id: "NIxNTT",
              description: "abc",
            })}
          </p>
          <NominatedForList
            advancementCount={
              talentNominationGroup.advancementNominationCount ?? 0
            }
            advancementDecision={
              talentNominationGroup.advancementDecision?.value
            }
            lateralMovementCount={
              talentNominationGroup.lateralMovementNominationCount ?? 0
            }
            lateralMovementDecision={
              talentNominationGroup.lateralMovementDecision?.value
            }
            developmentProgramCount={
              talentNominationGroup.developmentProgramsNominationCount ?? 0
            }
            developmentProgramDecision={
              talentNominationGroup.developmentProgramsDecision?.value
            }
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
                id: "qJdJfD",
                description: "abc",
              })}
            </Accordion.Trigger>
            <Accordion.Content>
              <div
                data-h2-display="base(grid)"
                data-h2-grid-template-columns="base(repeat(1, 1fr)) p-tablet(repeat(2, 1fr)) l-tablet(repeat(1, 1fr))"
                data-h2-gap="base(x1)"
                data-h2-overflow-wrap="base(anywhere)"
              >
                <div>
                  <span
                    data-h2-display="base(block)"
                    data-h2-font-weight="base(700)"
                  >
                    {intl.formatMessage(commonMessages.email)}
                  </span>

                  {talentNominationGroup.nominee?.email
                    ? talentNominationGroup.nominee.email
                    : intl.formatMessage(commonMessages.notProvided)}
                </div>
                <div>
                  <span
                    data-h2-display="base(block)"
                    data-h2-font-weight="base(700)"
                  >
                    {intl.formatMessage(commonMessages.workEmail)}
                  </span>

                  {talentNominationGroup.nominee?.workEmail
                    ? talentNominationGroup.nominee.workEmail
                    : intl.formatMessage(commonMessages.notProvided)}
                </div>
                <div>
                  <span
                    data-h2-display="base(block)"
                    data-h2-font-weight="base(700)"
                  >
                    {intl.formatMessage(commonMessages.telephone)}
                  </span>

                  {talentNominationGroup.nominee?.telephone
                    ? talentNominationGroup.nominee.telephone
                    : intl.formatMessage(commonMessages.notProvided)}
                </div>
                <div>
                  <span
                    data-h2-display="base(block)"
                    data-h2-font-weight="base(700)"
                  >
                    {intl.formatMessage(
                      commonMessages.preferredCommunicationLanguage,
                    )}
                  </span>

                  {talentNominationGroup.nominee?.preferredLang?.label
                    ?.localized
                    ? talentNominationGroup.nominee.preferredLang.label
                        .localized
                    : intl.formatMessage(commonMessages.notProvided)}
                </div>
              </div>
            </Accordion.Content>
          </Accordion.Item>
          <Separator decorative space="none" />
          <Accordion.Item
            value="comments"
            data-h2-padding="base(x.5 x1.25 x.5 x1.25)"
          >
            <Accordion.Trigger as="h3">
              {intl.formatMessage({
                defaultMessage: "Comments",
                id: "g+AUq0",
                description: "abc",
              })}
            </Accordion.Trigger>
            <Accordion.Content>
              {/* to fill in later once added to backend */}
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      </CardBasic>
    </div>
  );
};

export default NominationGroupSidebar;
