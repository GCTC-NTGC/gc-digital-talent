import { useState } from "react";
import { useIntl } from "react-intl";
import { tv, VariantProps } from "tailwind-variants";

import { Accordion, Card, CardSeparator, Heading } from "@gc-digital-talent/ui";
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
import NominationGroupEvaluationDialog, {
  NominationGroupEvaluationDialogProps,
} from "../../NominationGroupEvaluationDialog/NominationGroupEvaluationDialog";

const statusBox = tv({
  slots: {
    base: "flex max-w-fit items-center justify-between gap-x-3 overflow-hidden rounded-md p-3",
    btnWrapper: "-m-3 ml-0 flex items-center justify-center p-3 text-center",
    btn: "",
  },
  variants: {
    status: {
      approved: {
        base: "bg-success-100 text-success-600",
        btnWrapper: "bg-success-700",
        btn: "text-success-100 dark:text-success-100",
      },
      inProgress: {
        base: "bg-primary-100 text-primary-700",
        btnWrapper: "bg-primary-700",
        btn: "text-primary-100 dark:text-primary-100",
      },
      rejected: {
        base: "bg-error-100 text-error-600",
        btnWrapper: "bg-error-700",
        btn: "text-error-100 dark:text-error-100",
      },
    },
  },
});

type StatusBoxVariants = VariantProps<typeof statusBox>;

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

  let status: StatusBoxVariants["status"] = "approved";
  let triggerColor: NominationGroupEvaluationDialogProps["triggerColor"] =
    "success";
  if (
    talentNominationGroup.status?.value ===
    TalentNominationGroupStatus.InProgress
  ) {
    status = "inProgress";
    triggerColor = "primary";
  } else if (
    talentNominationGroup.status?.value === TalentNominationGroupStatus.Rejected
  ) {
    status = "rejected";
    triggerColor = "error";
  }

  const {
    base: statusBase,
    btn: statusBtn,
    btnWrapper: statusWrap,
  } = statusBox({ status });

  return (
    <>
      <Card className="mb-3 flex flex-col justify-center pb-3">
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
        <div className="self-start">
          <div className={statusBase()}>
            <span className="block grow font-bold">
              {talentNominationGroup.status?.label.localized ??
                intl.formatMessage(commonMessages.notAvailable)}
            </span>
            <div className={statusWrap()}>
              <NominationGroupEvaluationDialog
                triggerColor={triggerColor}
                triggerClassName={statusBtn()}
                talentNominationGroupId={talentNominationGroup.id}
              />
            </div>
          </div>
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
