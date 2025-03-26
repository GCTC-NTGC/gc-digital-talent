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

import { getFullNameLabel } from "~/utils/nameUtils";
import { getClassificationName } from "~/utils/poolUtils";

type AccordionStates = "nominee-contact-information" | "comments" | "";

const NominationGroupSidebar_Fragment = graphql(/* GraphQL */ `
  fragment NominationGroupSidebar on TalentNominationGroup {
    id
    nominee {
      id
      firstName
      lastName
      role
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
  const def = "abc" + "-123";

  return (
    <div
      data-h2-display="base(flex)"
      data-h2-flex-direction="base(column)"
      data-h2-padding="base(x1 x1.5 0 x1.5) l-tablet(x1 x1 0 0)"
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
          <p data-h2-padding-bottom="base(x.25)">
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
          <p>{def}</p>
        </div>
        <Separator data-h2-margin="base(x.5 0)" decorative space="none" />
        <div data-h2-padding="base(0 x1.25 x.5 x1.25)">
          <p>
            {intl.formatMessage({
              defaultMessage: "Nominated By",
              id: "bXlXXU",
              description: "abc",
            })}
          </p>
          <p>
            {intl.formatMessage({
              defaultMessage: "Nominated For",
              id: "NIxNTT",
              description: "abc",
            })}
          </p>
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
              <p>
                {intl.formatMessage({
                  defaultMessage: "Nominated By",
                  id: "bXlXXU",
                  description: "abc",
                })}
              </p>
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
              <p>
                {intl.formatMessage({
                  defaultMessage: "Nominated By",
                  id: "bXlXXU",
                  description: "abc",
                })}
              </p>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      </CardBasic>
    </div>
  );
};

export default NominationGroupSidebar;
