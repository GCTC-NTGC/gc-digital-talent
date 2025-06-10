import { useQuery } from "urql";
import { useIntl } from "react-intl";
import ClipboardDocumentListIcon from "@heroicons/react/24/outline/ClipboardDocumentListIcon";
import { useState } from "react";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import {
  Accordion,
  Button,
  Card,
  Heading,
  Pending,
  ThrowNotFound,
} from "@gc-digital-talent/ui";
import { ROLE_NAME } from "@gc-digital-talent/auth";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import RequireAuth from "~/components/RequireAuth/RequireAuth";
import useRequiredParams from "~/hooks/useRequiredParams";

import { RouteParams } from "./types";
import { detailTabMessages } from "./messages";
import TalentNominationAccordionItem from "./components/TalentNominationAccordionItem";

const TalentNominationGroupDetailsOptions_Fragment = graphql(/* GraphQL */ `
  fragment TalentNominationGroupDetailsOptions on Query {
    ...TalentNominationAccordionItemOptions
  }
`);

const TalentNominationGroupDetails_Fragment = graphql(/* GraphQL */ `
  fragment TalentNominationGroupDetails on TalentNominationGroup {
    id
    nominations {
      id
      nominator {
        firstName
        lastName
      }
      submittedAt
      ...TalentNominationAccordionItem
    }
  }
`);

interface TalentNominationGroupDetailsProps {
  query: FragmentType<typeof TalentNominationGroupDetails_Fragment>;
  optionsQuery: FragmentType<
    typeof TalentNominationGroupDetailsOptions_Fragment
  >;
}

const TalentNominationGroupDetails = ({
  query,
  optionsQuery,
}: TalentNominationGroupDetailsProps) => {
  const talentNominationGroup = getFragment(
    TalentNominationGroupDetails_Fragment,
    query,
  );
  const options = getFragment(
    TalentNominationGroupDetailsOptions_Fragment,
    optionsQuery,
  );

  // sort nominations by last name, first name, submitted date
  const talentNominations = unpackMaybes(talentNominationGroup.nominations);
  talentNominations.sort(
    (a, b) =>
      (a.nominator?.lastName?.localeCompare(b.nominator?.lastName ?? "") ??
        0) ||
      (a.nominator?.firstName?.localeCompare(b.nominator?.firstName ?? "") ??
        0) ||
      (a.submittedAt?.localeCompare(b.submittedAt ?? "") ?? 0),
  );

  // if there's only one then open it, otherwise start closed
  const defaultExpandedNominations =
    talentNominationGroup.nominations?.length === 1
      ? [talentNominationGroup.nominations[0].id]
      : [];

  const intl = useIntl();
  const [expandedNominationsValue, setExpandedNominationsValue] = useState<
    string[]
  >(defaultExpandedNominations);

  const toggleExpandedNominationsValue = () => {
    if (expandedNominationsValue.length > 0) {
      setExpandedNominationsValue([]);
    } else {
      const keys =
        talentNominationGroup.nominations?.map((nomination) => nomination.id) ??
        [];

      setExpandedNominationsValue(keys);
    }
  };

  return (
    <Card space="lg">
      <div
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column)"
        data-h2-gap="base(x1) l-tablet(x1.5)"
      >
        {/* heading section */}
        <div
          data-h2-display="base(flex)"
          data-h2-align-items="base(center)"
          data-h2-justify-content="base(space-between)"
        >
          <div>
            <Heading
              level="h2"
              icon={ClipboardDocumentListIcon}
              color="secondary"
              data-h2-font-weight="base(400)"
              data-h2-margin="base(0)"
            >
              {intl.formatMessage(detailTabMessages.nominationDetailsPageTitle)}
            </Heading>
          </div>
          <div>
            <Button
              type="button"
              mode="inline"
              color="primary"
              onClick={toggleExpandedNominationsValue}
            >
              {intl.formatMessage(
                expandedNominationsValue.length > 0
                  ? detailTabMessages.collapseNominations
                  : detailTabMessages.expandNominations,
              )}
            </Button>
          </div>
        </div>
        <Card.Separator />
        <Accordion.Root
          mode="simple"
          type="multiple"
          value={expandedNominationsValue}
          onValueChange={setExpandedNominationsValue}
        >
          {talentNominationGroup.nominations?.map((nomination) => (
            <TalentNominationAccordionItem
              key={nomination.id}
              query={nomination}
              optionsQuery={options}
            />
          ))}
        </Accordion.Root>
      </div>
    </Card>
  );
};

const TalentNominationGroupDetails_Query = graphql(/* GraphQL */ `
  query TalentNominationGroupDetails($talentNominationGroupId: UUID!) {
    ...TalentNominationGroupDetailsOptions
    talentNominationGroup(id: $talentNominationGroupId) {
      ...TalentNominationGroupDetails
    }
  }
`);

const TalentNominationGroupDetailsPage = () => {
  const { talentNominationGroupId } = useRequiredParams<RouteParams>(
    "talentNominationGroupId",
  );
  const [{ data, fetching, error }] = useQuery({
    query: TalentNominationGroupDetails_Query,
    variables: { talentNominationGroupId },
  });

  return (
    <Pending fetching={fetching} error={error}>
      {data?.talentNominationGroup ? (
        <TalentNominationGroupDetails
          query={data.talentNominationGroup}
          optionsQuery={data}
        />
      ) : (
        <ThrowNotFound />
      )}
    </Pending>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.CommunityTalentCoordinator]}>
    <TalentNominationGroupDetailsPage />
  </RequireAuth>
);

Component.displayName = "TalentNominationGroupDetailsPage";
