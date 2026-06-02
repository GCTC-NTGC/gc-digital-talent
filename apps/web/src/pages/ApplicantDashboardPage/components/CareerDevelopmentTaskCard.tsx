import { useIntl } from "react-intl";
import Cog8ToothIcon from "@heroicons/react/24/outline/Cog8ToothIcon";
import { useContext, useState } from "react";

import type { FragmentType } from "@gc-digital-talent/graphql";
import { getFragment, graphql } from "@gc-digital-talent/graphql";
import type { AccordionMetaData } from "@gc-digital-talent/ui";
import {
  Accordion,
  PreviewList,
  TaskCard,
  Ul,
  Notice,
  wrapParens,
} from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";
import { empty, unpackMaybes } from "@gc-digital-talent/helpers";

import useRoutes from "~/hooks/useRoutes";
import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";
import BoolCheckIcon from "~/components/BoolCheckIcon/BoolCheckIcon";
import messages from "~/messages/careerDevelopmentMessages";
import { PAGE_SECTION_ID as APPLICANT_DASHBOARD_SECTION_ID } from "~/constants/sections/applicantDashboard";

import FunctionalCommunityListItem from "./FunctionalCommunityListItem";
import { ApplicantDashboardContext } from "../ApplicantDashboardProvider";
import { ACCORDION_ID } from "../constants";

const CareerDevelopmentTaskCardUser_Fragment = graphql(/* GraphQL */ `
  fragment CareerDevelopmentTaskCardUser on User {
    isVerifiedGovEmployee
    employeeProfile {
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
  userQuery: FragmentType<typeof CareerDevelopmentTaskCardUser_Fragment>;
  optionsQuery: FragmentType<typeof CareerDevelopmentTaskCardOptions_Fragment>;
}

const CareerDevelopmentTaskCard = ({
  userQuery,
  optionsQuery,
}: CareerDevelopmentTaskCardProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const careerDevelopmentMessages = messages(intl);

  const {
    communityAccordionValue,
    setCommunityAccordionValue,
    communityAccordionRef,
  } = useContext(ApplicantDashboardContext);

  const [careerPlanningAccordionValue, setCareerPlanningAccordionValue] =
    useState<string>("");

  const userFragment = getFragment(
    CareerDevelopmentTaskCardUser_Fragment,
    userQuery,
  );

  const optionsFragment = getFragment(
    CareerDevelopmentTaskCardOptions_Fragment,
    optionsQuery,
  );

  const { isVerifiedGovEmployee, employeeProfile } = userFragment ?? {};

  const {
    lateralMoveInterest,
    lateralMoveTimeFrame,
    lateralMoveOrganizationType,
    promotionMoveInterest,
    promotionMoveTimeFrame,
    promotionMoveOrganizationType,
    communityInterests,
  } = employeeProfile ?? {};

  const lateralMoveOrganizationTypes = unpackMaybes(
    lateralMoveOrganizationType,
  ).map((interest) => String(interest.value));
  const promotionMoveOrganizationTypes = unpackMaybes(
    promotionMoveOrganizationType,
  ).map((interest) => String(interest.value));

  const { organizationTypeInterest } = optionsFragment;

  const editCareerPlanningLinkText = intl.formatMessage({
    defaultMessage: "Edit career planning",
    id: "jno96W",
    description: "Link to a page to edit your career planning information",
  });

  const careerPlanningMetaData: AccordionMetaData = [
    {
      key: "edit-career-planning-key",
      type: "link",
      href: `${paths.employeeProfile()}#career-planning-section`,
      color: "primary",
      children: <>{editCareerPlanningLinkText}</>,
    },
  ];

  const addACommunityLinkText = intl.formatMessage({
    defaultMessage: "Add a community",
    id: "kBEib8",
    description: "Link to a page to add a functional community",
  });

  const functionalCommunitiesMetaData: AccordionMetaData = isVerifiedGovEmployee
    ? // if verified, then a link to the community interest page
      [
        {
          key: "add-community-key",
          type: "link",
          href: paths.createCommunityInterest(),
          color: "primary",
          children: <>{addACommunityLinkText}</>,
        },
      ]
    : // if not verified, then a link to get verified
      [
        {
          key: "add-community-key",
          type: "link",
          href: paths.employeeProfile(),
          color: "primary",
          children: <>{addACommunityLinkText}</>,
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

  const isAccordionOpen =
    careerPlanningAccordionValue === "" && communityAccordionValue === "";
  const handleToggleAccordions = () => {
    if (isAccordionOpen) {
      setCareerPlanningAccordionValue(ACCORDION_ID.CAREER_PLANNING);
      setCommunityAccordionValue(ACCORDION_ID.FUNCTIONAL_COMMUNITIES);
    } else {
      setCareerPlanningAccordionValue("");
      setCommunityAccordionValue("");
    }
  };

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
          locked={!userFragment.isVerifiedGovEmployee}
          action={{
            label: isAccordionOpen
              ? intl.formatMessage({
                  defaultMessage:
                    "Expand all<hidden> career development sections</hidden>",
                  id: "8OWZvv",
                  description:
                    "Button text to show all career development sections",
                })
              : intl.formatMessage({
                  defaultMessage:
                    "Collapse all<hidden> career development sections</hidden>",
                  id: "A4dp/3",
                  description:
                    "Button text to hide all career development sections",
                }),
            onClick: handleToggleAccordions,
          }}
        >
          <TaskCard.Item>
            <Accordion.Root
              type="single"
              collapsible
              value={careerPlanningAccordionValue}
              onValueChange={setCareerPlanningAccordionValue}
            >
              <Accordion.Item value={ACCORDION_ID.CAREER_PLANNING}>
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
                            {unpackMaybes(organizationTypeInterest).map((x) => {
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
                            {unpackMaybes(organizationTypeInterest).map((x) => {
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
            <Accordion.Root
              type="single"
              collapsible
              id={APPLICANT_DASHBOARD_SECTION_ID.FUNCTIONAL_COMMUNITIES}
              value={communityAccordionValue}
              onValueChange={setCommunityAccordionValue}
            >
              <Accordion.Item value={ACCORDION_ID.FUNCTIONAL_COMMUNITIES}>
                <Accordion.Trigger
                  as="h3"
                  subtitle={intl.formatMessage({
                    defaultMessage:
                      "Opt in to share your profile information with recruiters and talent management staff so that you can be referred for job opportunities or training.",
                    id: "vOseaw",
                    description:
                      "Subtitle explaining functional communities expandable within career development card",
                  })}
                  ref={communityAccordionRef}
                >
                  {intl.formatMessage({
                    defaultMessage: "Functional communities",
                    id: "OH0wqV",
                    description: "Functional communities expandable",
                  })}
                  <span className="ml-1">
                    {wrapParens(communityInterests?.length ?? 0)}
                  </span>
                </Accordion.Trigger>
                <Accordion.MetaData metadata={functionalCommunitiesMetaData} />
                <Accordion.Content>
                  <div className="mt-3 flex flex-col gap-6">
                    {communityInterests?.length ? (
                      <PreviewList.Root>
                        {communityInterests.map(
                          (functionalCommunityInterestFragment) => (
                            <FunctionalCommunityListItem
                              key={functionalCommunityInterestFragment.id}
                              functionalCommunityListItemQuery={
                                functionalCommunityInterestFragment
                              }
                              functionalCommunityListItemOptionsQuery={
                                optionsFragment
                              }
                              headingAs="h4"
                            />
                          ),
                        )}
                      </PreviewList.Root>
                    ) : (
                      <Notice.Root className="text-center">
                        <Notice.Title>
                          {intl.formatMessage({
                            defaultMessage:
                              "You haven't opted into any functional communities.",
                            id: "rrqAZ6",
                            description:
                              "Title for notice when there are no functional communities a user is a part of",
                          })}
                        </Notice.Title>
                        <Notice.Content>
                          <p>
                            {intl.formatMessage({
                              defaultMessage:
                                'Communities might be suggested based on your career experience. You can also add functional communities using the "Add a community" link.',
                              id: "ldgukM",
                              description:
                                "Body for notice when there are no functional communities a user is a part of",
                            })}
                          </p>
                        </Notice.Content>
                      </Notice.Root>
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
