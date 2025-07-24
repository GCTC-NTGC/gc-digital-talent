import { useIntl } from "react-intl";
import Cog8ToothIcon from "@heroicons/react/24/outline/Cog8ToothIcon";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import {
  Accordion,
  AccordionMetaData,
  HTMLEntity,
  PreviewList,
  TaskCard,
  Ul,
  Well,
} from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";
import { empty, unpackMaybes } from "@gc-digital-talent/helpers";

import useRoutes from "~/hooks/useRoutes";
import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";
import BoolCheckIcon from "~/components/BoolCheckIcon/BoolCheckIcon";
import messages from "~/messages/careerDevelopmentMessages";

import FunctionalCommunityListItem from "./FunctionalCommunityListItem";

export const CareerDevelopmentTaskCard_Fragment = graphql(/* GraphQL */ `
  fragment CareerDevelopmentTaskCard on EmployeeProfile {
    lateralMoveInterest
    lateralMoveTimeFrame {
      value
      label {
        localized
      }
    }
    lateralMoveOrganizationType {
      value
      label {
        localized
      }
    }
    promotionMoveInterest
    promotionMoveTimeFrame {
      value
      label {
        localized
      }
    }
    promotionMoveOrganizationType {
      value
      label {
        localized
      }
    }
    communityInterests {
      id
      ...PreviewListItemFunctionalCommunity
    }
  }
`);

export const CareerDevelopmentTaskCardOptions_Fragment = graphql(/* GraphQL */ `
  fragment CareerDevelopmentTaskCardOptions on Query {
    organizationTypeInterest: localizedEnumStrings(
      enumName: "OrganizationTypeInterest"
    ) {
      value
      label {
        en
        fr
        localized
      }
    }
    timeFrame: localizedEnumStrings(enumName: "TimeFrame") {
      value
      label {
        en
        fr
        localized
      }
    }
    ...PreviewListItemFunctionalCommunityOptions
  }
`);

interface CareerDevelopmentTaskCardProps {
  careerDevelopmentTaskCardQuery: FragmentType<
    typeof CareerDevelopmentTaskCard_Fragment
  >;
  careerDevelopmentOptionsQuery: FragmentType<
    typeof CareerDevelopmentTaskCardOptions_Fragment
  >;
}

const CareerDevelopmentTaskCard = ({
  careerDevelopmentTaskCardQuery,
  careerDevelopmentOptionsQuery,
}: CareerDevelopmentTaskCardProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const careerDevelopmentMessages = messages(intl);

  const careerDevelopmentTaskCardFragment = getFragment(
    CareerDevelopmentTaskCard_Fragment,
    careerDevelopmentTaskCardQuery,
  );

  const careerDevelopmentTaskCardOptions = getFragment(
    CareerDevelopmentTaskCardOptions_Fragment,
    careerDevelopmentOptionsQuery,
  );

  const {
    lateralMoveInterest,
    lateralMoveTimeFrame,
    lateralMoveOrganizationType,
    promotionMoveInterest,
    promotionMoveTimeFrame,
    promotionMoveOrganizationType,
  } = careerDevelopmentTaskCardFragment;

  const lateralMoveOrganizationTypes = unpackMaybes(
    lateralMoveOrganizationType,
  ).map((interest) => String(interest.value));
  const promotionMoveOrganizationTypes = unpackMaybes(
    promotionMoveOrganizationType,
  ).map((interest) => String(interest.value));

  const careerPlanningMetaData: AccordionMetaData = [
    {
      key: "edit-career-planning-key",
      type: "link",
      href: `${paths.employeeProfile()}#career-planning-section`,
      color: "primary",
      children: (
        <>
          {intl.formatMessage({
            defaultMessage: "Edit career planning",
            id: "jno96W",
            description:
              "Link to a page to edit your career planning information",
          })}
        </>
      ),
    },
  ];

  const functionalCommunitiesMetaData: AccordionMetaData = [
    {
      key: "add-community-key",
      type: "link",
      href: paths.createCommunityInterest(),
      color: "primary",
      children: (
        <>
          {intl.formatMessage({
            defaultMessage: "Add a community",
            id: "kBEib8",
            description: "Link to a page to add a functional community",
          })}
        </>
      ),
    },
  ];

  const missingInfo = (
    <p className="text-error-500 dark:text-error-100">
      {intl.formatMessage({
        defaultMessage: "Missing information",
        id: "PnSSPo",
        description: "Missing information, warning",
      })}
    </p>
  );

  return (
    <>
      <div className="flex flex-col gap-6">
        <TaskCard.Root
          icon={Cog8ToothIcon}
          title={intl.formatMessage({
            defaultMessage: "Career development",
            id: "+2/ksA",
            description: "Card title for career development",
          })}
          headingColor="primary"
          headingAs="h2"
        >
          <TaskCard.Item>
            <Accordion.Root type="multiple">
              <Accordion.Item value="your_career_planning">
                <Accordion.Trigger
                  as="h3"
                  subtitle={intl.formatMessage({
                    defaultMessage:
                      "Tell us about your interest in a promotion, executive-level opportunities, or mentorship. Share your career aspirations, goals, and work style.",
                    id: "pm1xpZ",
                    description:
                      "Subtitle explaining career planning expandable within career development card",
                  })}
                >
                  {intl.formatMessage(commonMessages.careerPlanning)}
                </Accordion.Trigger>
                <Accordion.MetaData metadata={careerPlanningMetaData} />
                <Accordion.Content>
                  <div className="mt-3 flex flex-col gap-6">
                    <FieldDisplay
                      label={careerDevelopmentMessages.lateralMoveInterest}
                    >
                      {empty(lateralMoveInterest)
                        ? missingInfo
                        : intl.formatMessage(
                            lateralMoveInterest
                              ? {
                                  defaultMessage:
                                    "I’m interested in receiving opportunities for jobs at, or equivalent to, my current group and level.",
                                  id: "1TFJ+r",
                                  description:
                                    "The lateral move interest described as interested.",
                                }
                              : {
                                  defaultMessage:
                                    "I’m not looking for lateral movement right now.",
                                  id: "55IkTu",
                                  description:
                                    "The lateral move interest described as not interested.",
                                },
                          )}
                    </FieldDisplay>
                    {lateralMoveInterest && (
                      <FieldDisplay
                        label={careerDevelopmentMessages.lateralMoveTimeFrame}
                      >
                        {lateralMoveTimeFrame
                          ? lateralMoveTimeFrame.label.localized
                          : missingInfo}
                      </FieldDisplay>
                    )}
                    {lateralMoveInterest && (
                      <FieldDisplay
                        label={
                          careerDevelopmentMessages.lateralMoveOrganizationType
                        }
                      >
                        {lateralMoveOrganizationType ? (
                          <Ul space="md" unStyled>
                            {unpackMaybes(
                              careerDevelopmentTaskCardOptions?.organizationTypeInterest,
                            ).map((x) => {
                              const iconValue =
                                lateralMoveOrganizationTypes.includes(x.value);
                              return (
                                <li key={x.value}>
                                  <BoolCheckIcon
                                    value={iconValue}
                                    trueLabel={intl.formatMessage({
                                      defaultMessage: "Interested in",
                                      id: "AQiPuW",
                                      description:
                                        "Label for user expressing interest in a specific work stream",
                                    })}
                                    falseLabel={intl.formatMessage({
                                      defaultMessage: "Not interested in",
                                      id: "KyLikL",
                                      description:
                                        "Label for user expressing they are not interested in a specific work stream",
                                    })}
                                  >
                                    {x.label.localized ??
                                      intl.formatMessage(
                                        commonMessages.notFound,
                                      )}
                                  </BoolCheckIcon>
                                </li>
                              );
                            })}
                          </Ul>
                        ) : (
                          missingInfo
                        )}
                      </FieldDisplay>
                    )}
                    <FieldDisplay
                      label={careerDevelopmentMessages.promotionMoveInterest}
                    >
                      {empty(promotionMoveInterest)
                        ? missingInfo
                        : intl.formatMessage(
                            promotionMoveInterest
                              ? {
                                  defaultMessage:
                                    "I’m interested in receiving opportunities for promotion and advancement.",
                                  id: "2tAqF/",
                                  description:
                                    "The promotion move interest described as interested.",
                                }
                              : {
                                  defaultMessage:
                                    "I’m not looking for a promotion or advancement right now.",
                                  id: "tXLRmG",
                                  description:
                                    "The promotion move interest described as not interested.",
                                },
                          )}
                    </FieldDisplay>
                    {promotionMoveInterest && (
                      <FieldDisplay
                        label={careerDevelopmentMessages.promotionMoveTimeFrame}
                      >
                        {promotionMoveTimeFrame
                          ? promotionMoveTimeFrame.label.localized
                          : missingInfo}
                      </FieldDisplay>
                    )}
                    {promotionMoveInterest && (
                      <FieldDisplay
                        label={
                          careerDevelopmentMessages.promotionMoveOrganizationType
                        }
                      >
                        {promotionMoveOrganizationType ? (
                          <ul>
                            {unpackMaybes(
                              careerDevelopmentTaskCardOptions?.organizationTypeInterest,
                            ).map((x) => {
                              const iconValue =
                                promotionMoveOrganizationTypes.includes(
                                  x.value,
                                );
                              return (
                                <li key={x.value}>
                                  <BoolCheckIcon
                                    value={iconValue}
                                    trueLabel={intl.formatMessage({
                                      defaultMessage: "Interested in",
                                      id: "AQiPuW",
                                      description:
                                        "Label for user expressing interest in a specific work stream",
                                    })}
                                    falseLabel={intl.formatMessage({
                                      defaultMessage: "Not interested in",
                                      id: "KyLikL",
                                      description:
                                        "Label for user expressing they are not interested in a specific work stream",
                                    })}
                                  >
                                    {x.label.localized ??
                                      intl.formatMessage(
                                        commonMessages.notFound,
                                      )}
                                  </BoolCheckIcon>
                                </li>
                              );
                            })}
                          </ul>
                        ) : (
                          missingInfo
                        )}
                      </FieldDisplay>
                    )}
                  </div>
                </Accordion.Content>
              </Accordion.Item>
            </Accordion.Root>
          </TaskCard.Item>
          <TaskCard.Item>
            <Accordion.Root type="multiple">
              <Accordion.Item value="your_functional_communities">
                <Accordion.Trigger
                  as="h3"
                  subtitle={intl.formatMessage({
                    defaultMessage:
                      "Opt in to share your profile information with recruiters and talent management staff so that you can be referred for job opportunities or training.",
                    id: "vOseaw",
                    description:
                      "Subtitle explaining functional communities expandable within career development card",
                  })}
                >
                  {intl.formatMessage({
                    defaultMessage: "Functional communities",
                    id: "OH0wqV",
                    description: "Functional communities expandable",
                  })}
                  <span className="ml-1">
                    <HTMLEntity name="&lpar;" />
                    {careerDevelopmentTaskCardFragment?.communityInterests
                      ?.length ?? 0}
                    <HTMLEntity name="&rpar;" />
                  </span>
                </Accordion.Trigger>
                <Accordion.MetaData metadata={functionalCommunitiesMetaData} />
                <Accordion.Content>
                  <div className="mt-3 flex flex-col gap-6">
                    {careerDevelopmentTaskCardFragment?.communityInterests
                      ?.length ? (
                      <PreviewList.Root>
                        {careerDevelopmentTaskCardFragment.communityInterests.map(
                          (functionalCommunityInterestFragment) => (
                            <FunctionalCommunityListItem
                              key={functionalCommunityInterestFragment.id}
                              functionalCommunityListItemQuery={
                                functionalCommunityInterestFragment
                              }
                              functionalCommunityListItemOptionsQuery={
                                careerDevelopmentTaskCardOptions
                              }
                              headingAs="h4"
                            />
                          ),
                        )}
                      </PreviewList.Root>
                    ) : (
                      <Well className="text-center">
                        <p className="font-bold">
                          {intl.formatMessage({
                            defaultMessage:
                              "You haven't opted into any functional communities.",
                            id: "rrqAZ6",
                            description:
                              "Title for notice when there are no functional communities a user is a part of",
                          })}
                        </p>
                        <p>
                          {intl.formatMessage({
                            defaultMessage:
                              'Communities might be suggested based on your career experience. You can also add functional communities using the "Add a community" link.',
                            id: "ldgukM",
                            description:
                              "Body for notice when there are no functional communities a user is a part of",
                          })}
                        </p>
                      </Well>
                    )}
                  </div>
                </Accordion.Content>
              </Accordion.Item>
            </Accordion.Root>
          </TaskCard.Item>
        </TaskCard.Root>
      </div>
    </>
  );
};

export default CareerDevelopmentTaskCard;
