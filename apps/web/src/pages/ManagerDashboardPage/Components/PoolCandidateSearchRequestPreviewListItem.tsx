import { IntlShape, useIntl } from "react-intl";
import uniq from "lodash/uniq";

import {
  FragmentType,
  getFragment,
  graphql,
  PoolCandidateSearchStatus,
  PreviewListItemFragment,
} from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";
import { ChipProps, PreviewList } from "@gc-digital-talent/ui";
import { assertUnreachable, notEmpty } from "@gc-digital-talent/helpers";
import { formatDate, parseDateTimeUtc } from "@gc-digital-talent/date-helpers";

import { formatClassificationString } from "~/utils/poolUtils";

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

function buildTitle(request: PreviewListItemFragment, intl: IntlShape): string {
  const classificationStrings =
    request.applicantFilter?.qualifiedClassifications
      ?.filter(notEmpty)
      ?.map((classification) => formatClassificationString(classification));

  const uniqueClassificationStrings = uniq(classificationStrings);

  const firstPart =
    uniqueClassificationStrings.length == 1
      ? uniqueClassificationStrings[0]
      : null;

  const secondPart =
    request.jobTitle ?? intl.formatMessage(commonMessages.notProvided);

  const completedTitle =
    typeof firstPart === "string"
      ? `${firstPart}${intl.formatMessage(commonMessages.dividingColon)}${secondPart}`
      : secondPart;

  return completedTitle;
}

function buildStatusChip(
  status: PoolCandidateSearchStatus,
  intl: IntlShape,
): { color: ChipProps["color"]; label: string } {
  switch (status) {
    case PoolCandidateSearchStatus.New:
      return {
        color: "secondary",
        label: intl.formatMessage({
          defaultMessage: "Submitted",
          id: "BNH3hk",
          description:
            "Label for pool candidate search requests that are submitted",
        }),
      };
    case PoolCandidateSearchStatus.InProgress:
      return {
        color: "secondary",
        label: intl.formatMessage({
          defaultMessage: "Under review",
          id: "YYmuJo",
          description:
            "Label for pool candidate search requests that are under review",
        }),
      };
    case PoolCandidateSearchStatus.Waiting:
      return {
        color: "warning",
        label: intl.formatMessage({
          defaultMessage: "Awaiting response",
          id: "MOKBPl",
          description:
            "Label for pool candidate search requests that are awaiting a response",
        }),
      };
    case PoolCandidateSearchStatus.Done:
    case PoolCandidateSearchStatus.DoneNoCandidates:
    case PoolCandidateSearchStatus.NotCompliant:
      return {
        color: "success",
        label: intl.formatMessage({
          defaultMessage: "Complete",
          id: "dwgG5b",
          description:
            "Label for pool candidate search requests that are complete",
        }),
      };
    default:
      return assertUnreachable(status);
  }
}

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

  const title = buildTitle(request, intl);

  type MetaDataProps = React.ComponentProps<
    typeof PreviewList.Item
  >["metaData"];
  type MetaDataPropItem = MetaDataProps[number];
  const metaDataProps: MetaDataPropItem[] = [];
  if (request.status?.value) {
    const statusChip = buildStatusChip(request.status?.value, intl);
    metaDataProps.push({
      key: "status-chip",
      type: "chip",
      color: statusChip.color,
      children: statusChip.label,
    });
  }
  if (true) {
    metaDataProps.push({
      key: "match-count",
      type: "text",
      children: intl.formatMessage(
        {
          defaultMessage: "{resultCount} estimated matches",
          id: "FivLgM",
          description:
            "Display of estimated matches to a pool candidate search request",
        },
        {
          resultCount: "X",
        },
      ),
    });
  }
  if (request.requestedDate) {
    const formattedDate = formatDate({
      date: parseDateTimeUtc(request.requestedDate),
      formatString: "PPP",
      intl,
    });
    metaDataProps.push({
      key: "open-date",
      type: "text",
      children: intl.formatMessage(
        {
          defaultMessage: "Opened on: {formattedDate}",
          id: "aYt7kT",
          description:
            "A formatted display of the date the pool candidate search request was opened",
        },
        {
          formattedDate: formattedDate,
        },
      ),
    });
  }

  return (
    <PreviewList.Item
      title={title}
      metaData={metaDataProps}
      action={<PreviewList.Button label={title} />}
    />
  );
};

export default PoolCandidateSearchRequestPreviewListItem;
