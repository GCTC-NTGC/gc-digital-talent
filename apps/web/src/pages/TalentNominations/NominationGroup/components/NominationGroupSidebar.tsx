import { useState } from "react";
import { useIntl } from "react-intl";

import { Accordion, Card, CardSeparator, Heading } from "@gc-digital-talent/ui";
import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import { getFullNameLabel } from "~/utils/nameUtils";
import { getClassificationName } from "~/utils/poolUtils";
import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";
import adminMessages from "~/messages/adminMessages";
import DownloadNominationDocxButton from "~/components/DownloadButton/DownloadNominationDocxButton";

import NominatedForList from "./NominatedForList";
import NominatorList from "./NominatorList";
import NominationNavigation from "./NominationNavigation/NominationNavigation";
import CommentsForm from "./CommentsForm";
import NominationGroupEvaluationDialog from "../../NominationGroupEvaluationDialog/NominationGroupEvaluationDialog";

type AccordionStates = "nominee-contact-information" | "comments" | "";

export const NominationGroupSidebar_Fragment = graphql(/* GraphQL */ `
  fragment NominationGroupSidebar on TalentNominationGroup {
    id
    ...NominationGroupSidebarForList
    ...NominationGroupEvaluationDialog
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
    consentToShareProfile
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

  return (
    <>
      <Card className="mb-3 flex flex-col justify-center pb-3">
        <div className="flex justify-between">
          <p className="mb-1.5 text-sm text-gray-600 dark:text-gray-200">
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
          <DownloadNominationDocxButton
            id={talentNominationGroup.id}
            userId={talentNominationGroup.nominee?.id}
            consentToShareProfile={talentNominationGroup.consentToShareProfile}
          />
        </div>
        <Heading size="h6" className="mt-0 mb-3">
          {getFullNameLabel(
            talentNominationGroup.nominee?.firstName,
            talentNominationGroup.nominee?.lastName,
            intl,
          )}
        </Heading>
        <p className="mb-6">
          {talentNominationGroup.nominee?.department?.name?.localized ??
            intl.formatMessage(commonMessages.notProvided)}
        </p>
        <div className="w-full self-start">
          <NominationGroupEvaluationDialog query={talentNominationGroup} />
        </div>
        <CardSeparator decorative space="sm" />
        <p className="font-bold">
          {intl.formatMessage({
            defaultMessage: "Nominated by",
            id: "ULsL3v",
            description: "Nominated by header",
          })}
        </p>
        <div className="self-start">
          <NominatorList
            query={unpackMaybes(talentNominationGroup.nominations)}
          />
        </div>
        <p className="mt-6 mb-1.5 font-bold">
          {intl.formatMessage({
            defaultMessage: "Nominated for",
            id: "OODa6h",
            description: "Nominated for header",
          })}
        </p>
        <NominatedForList
          nominationGroupSidebarForListQuery={talentNominationGroup}
        />
        <Accordion.Root
          type="single"
          size="sm"
          value={accordionState}
          onValueChange={(value: AccordionStates) => setAccordionState(value)}
          collapsible
        >
          <CardSeparator decorative space="xs" />
          <Accordion.Item value="nominee-contact-information">
            <Accordion.Trigger as="h3">
              {intl.formatMessage({
                defaultMessage: "Nominee contact information",
                id: "W9HNlU",
                description: "Expandable to see nominee information",
              })}
            </Accordion.Trigger>
            <Accordion.Content>
              <div className="grid gap-6 wrap-anywhere xs:grid-cols-2 sm:grid-cols-1">
                <FieldDisplay
                  label={intl.formatMessage(commonMessages.workEmail)}
                >
                  {talentNominationGroup.nominee?.workEmail ??
                    intl.formatMessage(commonMessages.notProvided)}
                </FieldDisplay>
                <FieldDisplay
                  label={intl.formatMessage(
                    commonMessages.preferredCommunicationLanguage,
                  )}
                >
                  {talentNominationGroup.nominee?.preferredLang?.label
                    ?.localized ??
                    intl.formatMessage(commonMessages.notProvided)}
                </FieldDisplay>
              </div>
            </Accordion.Content>
          </Accordion.Item>
          <CardSeparator decorative space="xs" />
          <Accordion.Item value="comments">
            <Accordion.Trigger as="h3" className="pb-0">
              {intl.formatMessage(adminMessages.comments)}
            </Accordion.Trigger>
            <Accordion.Content className="pt-3">
              <CommentsForm nominationGroup={talentNominationGroup} />
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      </Card>
      <NominationNavigation />
    </>
  );
};

export default NominationGroupSidebar;
