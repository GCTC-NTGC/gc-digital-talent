import { useIntl } from "react-intl";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { HeadingLevel, PreviewList } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";

import CommunityInterestDialog from "~/components/CommunityInterestDialog/CommunityInterestDialog";

import { MetaDataJobInterest, MetaDataTrainingInterest } from "./iconElements";

const PreviewListItemFunctionalCommunity_Fragment = graphql(/* GraphQL */ `
  fragment PreviewListItemFunctionalCommunity on CommunityInterest {
    id
    jobInterest
    trainingInterest
    community {
      name {
        localized
      }
      description {
        localized
      }
    }

    ...CommunityInterestDialog
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

  const functionalCommunityListItemFragment = getFragment(
    PreviewListItemFunctionalCommunity_Fragment,
    functionalCommunityListItemQuery,
  );

  type MetaDataProps = React.ComponentProps<
    typeof PreviewList.Item
  >["metaData"];
  type MetaDataPropItem = MetaDataProps[number];
  const metaDataProps: MetaDataPropItem[] = [
    {
      key: "job-interest",
      type: "text",
      children: (
        <MetaDataJobInterest
          jobInterest={functionalCommunityListItemFragment.jobInterest}
        />
      ),
    },
    {
      key: "training-interest",
      type: "text",
      children: (
        <MetaDataTrainingInterest
          trainingInterest={
            functionalCommunityListItemFragment.trainingInterest
          }
        />
      ),
    },
  ];

  return (
    <>
      <PreviewList.Item
        title={
          functionalCommunityListItemFragment?.community?.name?.localized ??
          intl.formatMessage(commonMessages.notAvailable)
        }
        metaData={metaDataProps}
        action={
          <CommunityInterestDialog
            communityInterestQuery={functionalCommunityListItemFragment}
          />
        }
        headingAs={headingAs}
      >
        <span>
          {functionalCommunityListItemFragment?.community?.description
            ?.localized ?? ""}
        </span>
      </PreviewList.Item>
    </>
  );
};

export default FunctionalCommunityListItem;
