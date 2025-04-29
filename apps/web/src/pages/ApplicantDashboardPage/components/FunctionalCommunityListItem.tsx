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

const PreviewListItemFunctionalCommunityOptions_Fragment = graphql(
  /* GraphQL */ `
    fragment PreviewListItemFunctionalCommunityOptions on Query {
      ...CommunityInterestOptions
    }
  `,
);

interface FunctionalCommunityListItemProps {
  headingAs?: HeadingLevel;
  functionalCommunityListItemQuery: FragmentType<
    typeof PreviewListItemFunctionalCommunity_Fragment
  >;
  functionalCommunityListItemOptionsQuery: FragmentType<
    typeof PreviewListItemFunctionalCommunityOptions_Fragment
  >;
}

const FunctionalCommunityListItem = ({
  headingAs,
  functionalCommunityListItemQuery,
  functionalCommunityListItemOptionsQuery,
}: FunctionalCommunityListItemProps) => {
  const intl = useIntl();

  const functionalCommunityListItemFragment = getFragment(
    PreviewListItemFunctionalCommunity_Fragment,
    functionalCommunityListItemQuery,
  );

  const functionalCommunityListItemOptionsFragment = getFragment(
    PreviewListItemFunctionalCommunityOptions_Fragment,
    functionalCommunityListItemOptionsQuery,
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

  const title =
    functionalCommunityListItemFragment?.community?.name?.localized ??
    intl.formatMessage(commonMessages.notAvailable);
  return (
    <>
      <PreviewList.Item
        title={title}
        metaData={metaDataProps}
        action={
          <CommunityInterestDialog
            communityInterestQuery={functionalCommunityListItemFragment}
            communityInterestOptionsQuery={
              functionalCommunityListItemOptionsFragment
            }
            trigger={<PreviewList.Button label={title} />}
          />
        }
        headingAs={headingAs}
      >
        {functionalCommunityListItemFragment?.community?.description
          ?.localized ? (
          <span data-h2-color="base(black.light)">
            {
              functionalCommunityListItemFragment.community.description
                .localized
            }
          </span>
        ) : null}
      </PreviewList.Item>
    </>
  );
};

export default FunctionalCommunityListItem;
