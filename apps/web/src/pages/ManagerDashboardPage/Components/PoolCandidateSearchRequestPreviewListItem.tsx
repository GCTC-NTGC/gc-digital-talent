import { useIntl } from "react-intl";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";
import { PreviewList } from "@gc-digital-talent/ui";

const PreviewListItemPoolCandidateSearchRequest_Fragment = graphql(
  /* GraphQL */ `
    fragment PreviewListItem on PoolCandidateSearchRequest {
      jobTitle
      status {
        value
      }
      requestedDate
      applicantFilter {
        qualifiedClassifications {
          group
          level
        }
      }
    }
  `,
);

interface PoolCandidateSearchRequestPreviewListItemProps {
  poolCandidateSearchRequestQuery: FragmentType<
    typeof PreviewListItemPoolCandidateSearchRequest_Fragment
  >;
}

const PoolCandidateSearchRequestPreviewListItem = ({
  poolCandidateSearchRequestQuery,
}: PoolCandidateSearchRequestPreviewListItemProps) => {
  const intl = useIntl();
  const request = getFragment(
    PreviewListItemPoolCandidateSearchRequest_Fragment,
    poolCandidateSearchRequestQuery,
  );
  return (
    <PreviewList.Item
      title={request.jobTitle ?? intl.formatMessage(commonMessages.notProvided)}
      metaData={[
        {
          key: "status-chip",
          type: "chip",
          color: "secondary",
          children: request.status?.value,
        },
        {
          key: "match-count",
          type: "text",
          children: "X potential matches",
        },
        {
          key: "open-date",
          type: "text",
          children: request.requestedDate,
        },
      ]}
      action={<PreviewList.Button label="IT01: Junior application developer" />}
    />
  );
};

export default PoolCandidateSearchRequestPreviewListItem;
