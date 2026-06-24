import FolderIcon from "@heroicons/react/24/outline/FolderIcon";
import { useIntl } from "react-intl";
import { useQuery } from "urql";

import { Card, Heading, Pending, ThrowNotFound } from "@gc-digital-talent/ui";
import {
  getFragment,
  graphql,
  type FragmentType,
} from "@gc-digital-talent/graphql";

import RequireAuth from "~/components/RequireAuth/RequireAuth";
import permissionConstants from "~/constants/permissionConstants";
import useRequiredParams from "~/hooks/useRequiredParams";

import NominationDetailsDialog from "./components/NominationDetailsDialog/NominationDetailsDialog";

const TalentNominationGroupHistory_Fragment = graphql(/* GraphQL */ `
  fragment TalentNominationGroupHistory on TalentNominationGroup {
    id
    nominations {
      id
      ...TalentNominationDetailsDialog
    }
  }
`);

interface TalentNominationGroupHistoryProps {
  query: FragmentType<typeof TalentNominationGroupHistory_Fragment>;
}

const TalentNominationGroupHistory = ({
  query,
}: TalentNominationGroupHistoryProps) => {
  const intl = useIntl();
  const talentNominationGroup = getFragment(
    TalentNominationGroupHistory_Fragment,
    query,
  );
  return (
    <>
      <Card space="lg">
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

        {talentNominationGroup.nominations?.map((nomination) => (
          <NominationDetailsDialog query={nomination} key={nomination.id} />
        ))}
      </Card>
    </>
  );
};

const TalentNominationHistoryPage_Query = graphql(/* GraphQL */ `
  query TalentNominationHistoryPage($talentNominationGroupId: UUID!) {
    talentNominationGroup(id: $talentNominationGroupId) {
      ...TalentNominationGroupHistory
    }
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
        <TalentNominationGroupHistory query={data.talentNominationGroup} />
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
