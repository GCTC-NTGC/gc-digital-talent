import { useIntl } from "react-intl";
import BriefcaseIcon from "@heroicons/react/20/solid/BriefcaseIcon";
import PresentationChartLineIcon from "@heroicons/react/20/solid/PresentationChartLineIcon";
import XCircleIcon from "@heroicons/react/20/solid/XCircleIcon";
import ExclamationTriangleIcon from "@heroicons/react/20/solid/ExclamationTriangleIcon";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { HeadingLevel, PreviewList } from "@gc-digital-talent/ui";

const PreviewListItemFunctionalCommunity_Fragment = graphql(/* GraphQL */ `
  fragment PreviewListItemFunctionalCommunity on CommunityInterest {
    id
    jobInterest
    trainingInterest
    community {
      id
      name {
        localized
      }
      description {
        localized
      }
    }
  }
`);

interface FunctionalCommunityListItemProps {
  headingAs?: HeadingLevel;
  functionalCommunityListItemQuery: FragmentType<
    typeof PreviewListItemFunctionalCommunity_Fragment
  >;
}

const FunctionalCommunityListItem = ({
  headingAs,
  functionalCommunityListItemQuery,
}: FunctionalCommunityListItemProps) => {
  const intl = useIntl();
  const communityInterest = getFragment(
    PreviewListItemFunctionalCommunity_Fragment,
    functionalCommunityListItemQuery,
  );

  const sharedIconStyling = {
    "data-h2-height": "base(x1)",
    "data-h2-width": "base(x1)",
    "data-h2-display": "base(inline-block)",
    "data-h2-vertical-align": "base(bottom)",
    "data-h2-margin-right": "base(x.25)",
    "data-h2-padding-top": "base(x.125)",
  };

  const interestedWork = (
    <span>
      <BriefcaseIcon
        data-h2-color="base(success)"
        {...sharedIconStyling}
      ></BriefcaseIcon>
      {intl.formatMessage({
        defaultMessage: "Interested in work",
        id: "1VKNrs",
        description: "Phrase marking interest in community work opportunities",
      })}
    </span>
  );
  const notInterestedWork = (
    <span>
      <XCircleIcon
        data-h2-color="base(gray.lighter)"
        {...sharedIconStyling}
      ></XCircleIcon>
      {intl.formatMessage({
        defaultMessage: "Not interested in work",
        id: "VDVRPt",
        description:
          "Phrase marking lack of interest in community work opportunities",
      })}
    </span>
  );
  const missingWork = (
    <span>
      <ExclamationTriangleIcon
        data-h2-color="base(error)"
        {...sharedIconStyling}
      ></ExclamationTriangleIcon>
      {intl.formatMessage({
        defaultMessage: "<red>Missing work info</red>",
        id: "ZrLeP8",
        description:
          "Phrase marking incomplete community work opportunities interest",
      })}
    </span>
  );

  const generateMetaDataJobInterest = (
    jobInterest: boolean | null | undefined,
  ): JSX.Element => {
    if (jobInterest === null || jobInterest === undefined) {
      return missingWork;
    }
    return jobInterest ? interestedWork : notInterestedWork;
  };

  const interestedTraining = (
    <span>
      <PresentationChartLineIcon
        data-h2-color="base(success)"
        {...sharedIconStyling}
      ></PresentationChartLineIcon>
      {intl.formatMessage({
        defaultMessage: "Interested in training",
        id: "ERsZAD",
        description:
          "Phrase marking interest in community training opportunities",
      })}
    </span>
  );
  const notInterestedTraining = (
    <span>
      <XCircleIcon
        data-h2-color="base(gray.lighter)"
        {...sharedIconStyling}
      ></XCircleIcon>
      {intl.formatMessage({
        defaultMessage: "Not interested in training",
        id: "8wU0cq",
        description:
          "Phrase marking lack of interest in community training opportunities",
      })}
    </span>
  );
  const missingTraining = (
    <span>
      <ExclamationTriangleIcon
        data-h2-color="base(error)"
        {...sharedIconStyling}
      ></ExclamationTriangleIcon>
      {intl.formatMessage({
        defaultMessage: "<red>Missing training info</red>",
        id: "bupAcV",
        description:
          "Phrase marking incomplete community training opportunities interest",
      })}
    </span>
  );

  const generateMetaDataTrainingInterest = (
    trainingInterest: boolean | null | undefined,
  ): JSX.Element => {
    if (trainingInterest === null || trainingInterest === undefined) {
      return missingTraining;
    }
    return trainingInterest ? interestedTraining : notInterestedTraining;
  };

  type MetaDataProps = React.ComponentProps<
    typeof PreviewList.Item
  >["metaData"];
  type MetaDataPropItem = MetaDataProps[number];
  const metaDataProps: MetaDataPropItem[] = [
    {
      key: "job-interest",
      type: "text",
      children: generateMetaDataJobInterest(communityInterest.jobInterest),
    },
    {
      key: "training-interest",
      type: "text",
      children: generateMetaDataTrainingInterest(
        communityInterest.trainingInterest,
      ),
    },
  ];

  return (
    <>
      <PreviewList.Item
        title={communityInterest?.community?.name?.localized ?? ""}
        metaData={metaDataProps}
        // action={<CommunityInterestDialog title={title} id={request.id} />}
        headingAs={headingAs}
      >
        <span>
          {communityInterest?.community?.description?.localized ?? ""}
        </span>
      </PreviewList.Item>
    </>
  );
};

export default FunctionalCommunityListItem;
