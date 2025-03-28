import { useQuery } from "urql";
import { useIntl } from "react-intl";
import ClipboardDocumentListIcon from "@heroicons/react/24/outline/ClipboardDocumentListIcon";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import {
  Accordion,
  Button,
  CardForm,
  CardFormSeparator,
  Heading,
  Pending,
  ThrowNotFound,
} from "@gc-digital-talent/ui";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import RequireAuth from "~/components/RequireAuth/RequireAuth";
import useRequiredParams from "~/hooks/useRequiredParams";

import { RouteParams } from "./types";
import { detailTabMessages } from "./messages";
import TalentNominationAccordionItem from "./components/TalentNominationAccordionItem";

const TalentNominationGroupDetails_Fragment = graphql(/* GraphQL */ `
  fragment TalentNominationGroupDetails on TalentNominationGroup {
    id
    nominations {
      id
      ...TalentNominationAccordionItem
    }
  }
`);

interface TalentNominationGroupDetailsProps {
  query: FragmentType<typeof TalentNominationGroupDetails_Fragment>;
}

const TalentNominationGroupDetails = ({
  query,
}: TalentNominationGroupDetailsProps) => {
  const talentNominationGroup = getFragment(
    TalentNominationGroupDetails_Fragment,
    query,
  );
  const intl = useIntl();

  // if there's only one then open it, otherwise start closed
  const openAccordions =
    talentNominationGroup.nominations?.length === 1
      ? [talentNominationGroup.nominations[0].id]
      : [];

  return (
    <CardForm>
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
              Icon={ClipboardDocumentListIcon}
              color="primary"
              data-h2-font-weight="base(400)"
              data-h2-margin="base(0)"
            >
              {intl.formatMessage(detailTabMessages.nominationDetailsPageTitle)}
            </Heading>
          </div>
          <div>
            <Button type="button" mode="inline" color="secondary">
              {intl.formatMessage(detailTabMessages.expandNominations)}
            </Button>
          </div>
        </div>
        <CardFormSeparator />
        <Accordion.Root mode="simple" type="multiple" value={openAccordions}>
          {talentNominationGroup.nominations?.map((nomination) => (
            <TalentNominationAccordionItem
              key={nomination.id}
              query={nomination}
            />
          ))}
        </Accordion.Root>
      </div>
    </CardForm>
  );
};

const TalentNominationGroupDetails_Query = graphql(/* GraphQL */ `
  query TalentNominationGroupDetails($talentNominationGroupId: UUID!) {
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
        <TalentNominationGroupDetails query={data.talentNominationGroup} />
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
