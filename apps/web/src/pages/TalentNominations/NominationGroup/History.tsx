import FolderIcon from "@heroicons/react/24/outline/FolderIcon";
import { useIntl } from "react-intl";
import { useQuery } from "urql";
import { useState } from "react";

import {
  Accordion,
  Card,
  Heading,
  Pending,
  ThrowNotFound,
  Button,
  Notice,
} from "@gc-digital-talent/ui";
import {
  getFragment,
  graphql,
  type FragmentType,
} from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import RequireAuth from "~/components/RequireAuth/RequireAuth";
import permissionConstants from "~/constants/permissionConstants";
import useRequiredParams from "~/hooks/useRequiredParams";

import NominationEventAccordionItem from "./components/NominationEventAccordionItem";
import { detailTabMessages } from "./messages";

const TalentNominationGroupHistoryNominationGroup_Fragment = graphql(
  /* GraphQL */ `
    fragment TalentNominationGroupHistoryNominationGroup on TalentNominationGroup {
      id
      nominations {
        id
      }
      ...NominationEventAccordionItem
    }
  `,
);

const TalentNominationGroupHistoryOptions_Fragment = graphql(/* GraphQL */ `
  fragment TalentNominationGroupHistoryOptions on Query {
    ...TalentNominationDetailsDialogOptions
  }
`);

interface TalentNominationGroupHistoryProps {
  nominationGroupQuery: FragmentType<
    typeof TalentNominationGroupHistoryNominationGroup_Fragment
  >;
  optionsQuery: FragmentType<
    typeof TalentNominationGroupHistoryOptions_Fragment
  >;
}

const TalentNominationGroupHistory = ({
  nominationGroupQuery,
  optionsQuery,
}: TalentNominationGroupHistoryProps) => {
  const intl = useIntl();
  const talentNominationGroup = getFragment(
    TalentNominationGroupHistoryNominationGroup_Fragment,
    nominationGroupQuery,
  );
  const options = getFragment(
    TalentNominationGroupHistoryOptions_Fragment,
    optionsQuery,
  );

  const nominationGroups = [talentNominationGroup];

  //get total number of nominations across all nomination groups
  const nominationCount = nominationGroups.reduce(
    (total: number, group) => total + unpackMaybes(group.nominations).length,
    0,
  );

  const eventKeys = nominationGroups.map((group) => group.id);

  const [expandedValues, setExpandedValues] = useState<string[]>([]);
  const hasOpenSections = expandedValues.length > 0;

  const toggleSections = () => {
    setExpandedValues((currentOpen) => {
      return currentOpen.length > 0 ? [] : eventKeys;
    });
  };

  return (
    <>
      <Card
        className={
          nominationCount > 0 ? "rounded-b-none pb-0 sm:pb-0" : undefined
        }
        space="lg"
      >
        <div className="flex flex-col items-center justify-between gap-y-6 xs:flex-row xs:gap-x-3 xs:gap-y-0">
          <Heading
            icon={FolderIcon}
            level="h2"
            size="h4"
            color="secondary"
            className="mt-0 font-normal"
          >
            {intl.formatMessage({
              defaultMessage: "Nomination history",
              id: "85Y9eS",
              description: "Heading for the nomination history page",
            })}
          </Heading>
          {nominationCount > 0 && (
            <Button mode="inline" color="primary" onClick={toggleSections}>
              {intl.formatMessage(
                hasOpenSections
                  ? detailTabMessages.collapseNominations
                  : detailTabMessages.expandNominations,
              )}
            </Button>
          )}
        </div>
        <p>
          {intl.formatMessage({
            defaultMessage:
              "This tab allows you to review the nominee's nomination history by event. Current nominations appear first and you can expand each event to see available nominations as needed.",
            id: "qo3/Sp",
            description: "Description for the nomination history page",
          })}
        </p>
        <Card.Separator className="mt-9" />

        {nominationCount === 0 && (
          <Notice.Root className="mt-9">
            <Notice.Content>
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "This user hasn't been nominated for any talent management events.",
                  id: "UgHwZb",
                  description:
                    "Message displayed when a nominee has no nominations to show in their history",
                })}
              </p>
            </Notice.Content>
          </Notice.Root>
        )}
      </Card>

      {nominationCount > 0 && (
        <Accordion.Root
          type="multiple"
          mode="card"
          size="sm"
          value={expandedValues}
          onValueChange={setExpandedValues}
          className="mt-0 rounded-t-none"
        >
          {nominationGroups.map((nominationGroup) => (
            <NominationEventAccordionItem
              key={nominationGroup.id}
              nominationGroupQuery={nominationGroup}
              optionsQuery={options}
            />
          ))}
        </Accordion.Root>
      )}
    </>
  );
};

const TalentNominationHistoryPage_Query = graphql(/* GraphQL */ `
  query TalentNominationHistoryPage($talentNominationGroupId: UUID!) {
    talentNominationGroup(id: $talentNominationGroupId) {
      ...TalentNominationGroupHistoryNominationGroup
    }
    ...TalentNominationGroupHistoryOptions
  }
`);

interface RouteParams extends Record<string, string> {
  talentNominationGroupId: string;
}

const TalentNominationGroupHistoryPage = () => {
  const { talentNominationGroupId } = useRequiredParams<RouteParams>(
    "talentNominationGroupId",
  );
  const [{ data, fetching, error }] = useQuery({
    query: TalentNominationHistoryPage_Query,
    variables: { talentNominationGroupId },
  });

  return (
    <Pending fetching={fetching} error={error}>
      {data?.talentNominationGroup ? (
        <TalentNominationGroupHistory
          nominationGroupQuery={data.talentNominationGroup}
          optionsQuery={data}
        />
      ) : (
        <ThrowNotFound />
      )}
    </Pending>
  );
};

export const Component = () => (
  <RequireAuth roles={permissionConstants.viewCommunityTalentNominations}>
    <TalentNominationGroupHistoryPage />
  </RequireAuth>
);

Component.displayName = "TalentNominationGroupHistoryPage";

export default Component;
