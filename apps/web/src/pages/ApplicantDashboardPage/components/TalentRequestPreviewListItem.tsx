import type { IntlShape } from "react-intl";
import { useIntl } from "react-intl";

import type {
  FragmentType,
  PreviewListItemTalentRequestFragment,
} from "@gc-digital-talent/graphql";
import { getFragment, graphql } from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";
import { PreviewList } from "@gc-digital-talent/ui";
import {
  DATE_FORMAT_LOCALIZED,
  formatDate,
  parseDateTimeUtc,
} from "@gc-digital-talent/date-helpers";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import { TALENT_REQUEST_STATUS_COLOUR_MAP } from "~/utils/searchRequestUtils";

import ReviewTalentRequestDialog from "./ReviewTalentRequestDialog";

const PreviewListItemTalentRequest_Fragment = graphql(/* GraphQL */ `
  fragment PreviewListItemTalentRequest on TalentRequest {
    id
    jobTitle
    talentRequestStatus {
      value
      label {
        localized
      }
    }
    requestedDate
    applicantFilter {
      qualifiedInClassifications {
        groupAndLevel
      }
    }
    initialResultCount
  }
`);

function buildTitle(
  request: PreviewListItemTalentRequestFragment,
  intl: IntlShape,
): string {
  const classifications = unpackMaybes(
    request.applicantFilter?.qualifiedInClassifications,
  );
  const classificationString =
    classifications.length == 1 ? classifications[0].groupAndLevel : null;

  const jobTitleString =
    request.jobTitle ?? intl.formatMessage(commonMessages.notProvided);

  const completedTitle =
    typeof classificationString === "string"
      ? `${classificationString}${intl.formatMessage(commonMessages.dividingColon)}${jobTitleString}`
      : jobTitleString;

  return completedTitle;
}

interface TalentRequestPreviewListItemProps {
  talentRequestQuery: FragmentType<
    typeof PreviewListItemTalentRequest_Fragment
  >;
}

const TalentRequestPreviewListItem = ({
  talentRequestQuery,
}: TalentRequestPreviewListItemProps) => {
  const intl = useIntl();
  const request = getFragment(
    PreviewListItemTalentRequest_Fragment,
    talentRequestQuery,
  );

  const title = buildTitle(request, intl);

  type MetaDataProps = React.ComponentProps<
    typeof PreviewList.Item
  >["metaData"];
  type MetaDataPropItem = MetaDataProps[number];
  const metaDataProps: MetaDataPropItem[] = [];
  if (request.talentRequestStatus) {
    metaDataProps.push({
      key: "status-chip",
      type: "chip",
      color:
        TALENT_REQUEST_STATUS_COLOUR_MAP[request.talentRequestStatus.value],
      children: request.talentRequestStatus.label.localized,
    });
  }
  if (typeof request.initialResultCount === "number") {
    metaDataProps.push({
      key: "match-count",
      type: "text",
      children: intl.formatMessage(
        {
          defaultMessage:
            "{resultCount, plural, one {# estimated match} other {# estimated matches}}",
          id: "uKKSqt",
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
      formatString: DATE_FORMAT_LOCALIZED,
      intl,
    });
    metaDataProps.push({
      key: "open-date",
      type: "text",
      children: intl.formatMessage(
        {
          defaultMessage: "Submitted: {formattedDate}",
          id: "iI7VxV",
          description:
            "A formatted display of the date the pool candidate search request was submitted",
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
        action={
          <ReviewTalentRequestDialog
            id={request.id}
            trigger={<PreviewList.Button label={title} />}
          />
        }
      />
    </>
  );
};

export default TalentRequestPreviewListItem;
