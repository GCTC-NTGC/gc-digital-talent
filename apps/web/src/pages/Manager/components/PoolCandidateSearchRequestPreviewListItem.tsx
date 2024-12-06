import { IntlShape, useIntl } from "react-intl";

import {
  FragmentType,
  getFragment,
  graphql,
  PreviewListItemFragment,
} from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";
import { HeadingLevel, PreviewList } from "@gc-digital-talent/ui";
import { formatDate, parseDateTimeUtc } from "@gc-digital-talent/date-helpers";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import { formatClassificationString } from "~/utils/poolUtils";

import ReviewTalentRequestDialog from "./ReviewTalentRequestDialog";
import { deriveChipSettings } from "../utils";

const PreviewListItemPoolCandidateSearchRequest_Fragment = graphql(
  /* GraphQL */ `
    fragment PreviewListItem on PoolCandidateSearchRequest {
      id
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
      initialResultCount
    }
  `,
);

function buildTitle(request: PreviewListItemFragment, intl: IntlShape): string {
  const classifications = unpackMaybes(
    request.applicantFilter?.qualifiedClassifications,
  );
  const classificationString =
    classifications.length == 1
      ? formatClassificationString(classifications[0])
      : null;

  const jobTitleString =
    request.jobTitle ?? intl.formatMessage(commonMessages.notProvided);

  const completedTitle =
    typeof classificationString === "string"
      ? `${classificationString}${intl.formatMessage(commonMessages.dividingColon)}${jobTitleString}`
      : jobTitleString;

  return completedTitle;
}

interface PoolCandidateSearchRequestPreviewListItemProps {
  headingAs?: HeadingLevel;
  poolCandidateSearchRequestQuery: FragmentType<
    typeof PreviewListItemPoolCandidateSearchRequest_Fragment
  >;
}

const PoolCandidateSearchRequestPreviewListItem = ({
  headingAs,
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
    const chipSettings = deriveChipSettings(request.status.value, intl);
    metaDataProps.push({
      key: "status-chip",
      type: "chip",
      color: chipSettings.color,
      children: chipSettings.label,
    });
  }
  if (typeof request.initialResultCount === "number") {
    metaDataProps.push({
      key: "match-count",
      type: "text",
      children: intl.formatMessage(
        {
          defaultMessage:
            "{resultCount, plural, one {{resultCount} estimated match} other {{resultCount} estimated matches}}",
          id: "rRoL/0",
          description:
            "Display of estimated matches to a pool candidate search request",
        },
        {
          resultCount: request.initialResultCount,
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
    <>
      <PreviewList.Item
        title={title}
        metaData={metaDataProps}
        action={<ReviewTalentRequestDialog title={title} id={request.id} />}
        headingAs={headingAs}
      />
    </>
  );
};

export default PoolCandidateSearchRequestPreviewListItem;
