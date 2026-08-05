import { useIntl } from "react-intl";
import XMarkIcon from "@heroicons/react/20/solid/XMarkIcon";
import PencilSquareIcon from "@heroicons/react/20/solid/PencilSquareIcon";
import { useState, type ReactNode } from "react";

import type { FragmentType } from "@gc-digital-talent/graphql";
import { getFragment, graphql } from "@gc-digital-talent/graphql";
import type { HeadingLevel } from "@gc-digital-talent/ui";
import {
  DropdownMenu,
  Heading,
  IconButton,
  Ul,
  UNICODE_CHAR,
} from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";

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
  edit?: ReactNode;
  iconLabel?: string;
}

const FunctionalCommunityCard = ({
  headingAs,
  functionalCommunityListItemQuery,
  edit,
  iconLabel,
}: FunctionalCommunityListItemProps) => {
  const intl = useIntl();
  const [open, setOpen] = useState(false);

  const functionalCommunityListItemFragment = getFragment(
    PreviewListItemFunctionalCommunity_Fragment,
    functionalCommunityListItemQuery,
  );

  return (
    <li className="border-b border-gray-200 p-6 last:border-b-0 odd:bg-gray-100/30 dark:border-gray-700 dark:odd:bg-gray-600 dark:even:bg-gray-600/80">
      <div className="flex items-start gap-3">
        <DropdownMenu.Root open={open} onOpenChange={setOpen}>
          <DropdownMenu.Trigger
            render={
              <IconButton
                icon={open ? XMarkIcon : PencilSquareIcon}
                color="primary"
                label={iconLabel}
                className="-mt-0.5"
              />
            }
          />
          <DropdownMenu.Popup portalProps={{ keepMounted: true }}>
            {edit ? <DropdownMenu.Item>{edit}</DropdownMenu.Item> : undefined}
            <DropdownMenu.Item onClick={() => console.debug("remove")}>
              {intl.formatMessage(commonMessages.remove)}
            </DropdownMenu.Item>
          </DropdownMenu.Popup>
        </DropdownMenu.Root>

        <div className="flex flex-col items-start gap-3">
          <Heading
            level={headingAs}
            size="h6"
            className="m-0 text-base font-bold"
          >
            {functionalCommunityListItemFragment?.community?.name?.localized ??
              intl.formatMessage(commonMessages.notAvailable)}
          </Heading>
          {functionalCommunityListItemFragment?.community?.description
            ?.localized ? (
            <span className="text-gray-600 dark:text-gray-200">
              {
                functionalCommunityListItemFragment.community.description
                  .localized
              }
            </span>
          ) : null}
          <div className="flex flex-col flex-nowrap items-start gap-1.5 text-sm xs:flex-row xs:flex-wrap xs:items-center">
            <MetaDataJobInterest
              jobInterest={functionalCommunityListItemFragment.jobInterest}
            />
            {UNICODE_CHAR.BULLET}
            <MetaDataTrainingInterest
              trainingInterest={
                functionalCommunityListItemFragment.trainingInterest
              }
            />
          </div>
        </div>
      </div>
    </li>
  );
};

const Root = ({ children }: { children: ReactNode }) => {
  return (
    <Ul unStyled className="bg-white dark:bg-gray-700">
      {children}
    </Ul>
  );
};

export default {
  Root,
  Item: FunctionalCommunityCard,
};
