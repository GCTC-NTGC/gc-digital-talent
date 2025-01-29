import { useIntl } from "react-intl";
import Cog8ToothIcon from "@heroicons/react/24/outline/Cog8ToothIcon";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import {
  Accordion,
  AccordionMetaData,
  PreviewList,
  TaskCard,
  Well,
} from "@gc-digital-talent/ui";

import useRoutes from "~/hooks/useRoutes";

import MoveInterestsList from "./MoveInterestsList";
import OrganizationTypeInterestsList from "./OrganizationInterestsList";
import FunctionalCommunityListItem from "./FunctionalCommunityListItem";

const CareerDevelopmentTaskCard_Fragment = graphql(/* GraphQL */ `
  fragment CareerDevelopmentTaskCard on EmployeeProfile {
    moveInterest {
      value
    }
    organizationTypeInterest {
      value
    }
    communityInterests {
      id
      ...PreviewListItemFunctionalCommunity
    }
  }
`);

interface CareerDevelopmentTaskCardProps {
  careerDevelopmentTaskCardQuery: FragmentType<
    typeof CareerDevelopmentTaskCard_Fragment
  >;
}

const CareerDevelopmentTaskCard = ({
  careerDevelopmentTaskCardQuery,
}: CareerDevelopmentTaskCardProps) => {
  const intl = useIntl();
  const paths = useRoutes();

  const careerDevelopmentTaskCardFragment = getFragment(
    CareerDevelopmentTaskCard_Fragment,
    careerDevelopmentTaskCardQuery,
  );

  const moveInterestsMapped = careerDevelopmentTaskCardFragment?.moveInterest
    ? careerDevelopmentTaskCardFragment.moveInterest.map(
        (interest) => interest.value,
      )
    : null;
  const organizationTypeInterestsMapped =
    careerDevelopmentTaskCardFragment?.organizationTypeInterest
      ? careerDevelopmentTaskCardFragment.organizationTypeInterest.map(
          (interest) => interest.value,
        )
      : null;

  const careerPlanningMetaData: AccordionMetaData[] = [
    {
      key: "edit-career-planning-key",
      type: "link",
      href: paths.employeeProfile(),
      color: "secondary",
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

  const functionalCommunitiesMetaData: AccordionMetaData[] = [
    {
      key: "add-community-key",
      type: "link",
      href: "#",
      color: "secondary",
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
    {
      key: "career-planning-key",
      type: "link",
      href: paths.employeeProfile(),
      color: "secondary",
      children: (
        <>
          {intl.formatMessage({
            defaultMessage: "Career planning",
            id: "zN7MBv",
            description: "Title for a users career plan",
          })}
        </>
      ),
    },
  ];

  return (
    <>
      <div
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column)"
        data-h2-gap="base(x1)"
        data-h2-flex-grow="p-tablet(2)"
      >
        <TaskCard.Root
          icon={Cog8ToothIcon}
          title={intl.formatMessage({
            defaultMessage: "Career development",
            id: "+2/ksA",
            description: "Card title for career development",
          })}
          headingColor="secondary"
          headingAs="h2"
        >
          <TaskCard.Item>
            <Accordion.Root
              type="multiple"
              data-h2-padding-bottom="base:selectors[>.Accordion__Item > .Accordion__Content](x.5)"
            >
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
                  {intl.formatMessage({
                    defaultMessage: "Career planning",
                    id: "E0I0Yj",
                    description: "Career planning expandable",
                  })}
                </Accordion.Trigger>
                <Accordion.MetaData metadata={careerPlanningMetaData} />
                <Accordion.Content>
                  <div
                    data-h2-display="base(flex)"
                    data-h2-flex-direction="base(column)"
                    data-h2-gap="base(x1)"
                    data-h2-padding-top="base(x.5)"
                  >
                    <div>
                      <p data-h2-font-weight="base(700)">
                        {intl.formatMessage({
                          defaultMessage:
                            "Interest in promotions and lateral moves",
                          id: "TiPh1V",
                          description:
                            "Heading for list of user's interest in employment moves",
                        })}
                      </p>
                      {moveInterestsMapped ? (
                        <MoveInterestsList
                          moveInterests={moveInterestsMapped}
                        ></MoveInterestsList>
                      ) : (
                        <p data-h2-color="base(error.darker) base:dark(error.lightest)">
                          {intl.formatMessage({
                            defaultMessage: "Missing information",
                            id: "PnSSPo",
                            description: "Missing information, warning",
                          })}
                        </p>
                      )}
                    </div>
                    <div>
                      <p data-h2-font-weight="base(700)">
                        {intl.formatMessage({
                          defaultMessage:
                            "Types of organizations you'd like to work for",
                          id: "WvzD/I",
                          description:
                            "Heading for list of user's interest in organizations as employers",
                        })}
                      </p>
                      {organizationTypeInterestsMapped ? (
                        <OrganizationTypeInterestsList
                          organizationTypeInterests={
                            organizationTypeInterestsMapped
                          }
                        ></OrganizationTypeInterestsList>
                      ) : (
                        <p data-h2-color="base(error.darker) base:dark(error.lightest)">
                          {intl.formatMessage({
                            defaultMessage: "Missing information",
                            id: "PnSSPo",
                            description: "Missing information, warning",
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                </Accordion.Content>
              </Accordion.Item>
            </Accordion.Root>
          </TaskCard.Item>
          <TaskCard.Item>
            <Accordion.Root
              type="multiple"
              data-h2-padding-bottom="base:selectors[>.Accordion__Item > .Accordion__Content](x.5)"
            >
              <Accordion.Item value="your_functional_communities">
                <Accordion.Trigger
                  as="h3"
                  subtitle={intl.formatMessage({
                    defaultMessage:
                      "Opt in to your profile information being shared with recruiters and talent management staff so that you can be referred for job opportunities or training.",
                    id: "Yohuno",
                    description:
                      "Subtitle explaining functional communities expandable within career development card",
                  })}
                >
                  {`${intl.formatMessage({
                    defaultMessage: "Functional communities",
                    id: "OH0wqV",
                    description: "Functional communities expandable",
                  })} (${careerDevelopmentTaskCardFragment?.communityInterests?.length ?? 0})`}
                </Accordion.Trigger>
                <Accordion.MetaData metadata={functionalCommunitiesMetaData} />
                <Accordion.Content>
                  <div
                    data-h2-display="base(flex)"
                    data-h2-flex-direction="base(column)"
                    data-h2-gap="base(x1)"
                    data-h2-padding-top="base(x.5)"
                  >
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
                              headingAs="h4"
                            />
                          ),
                        )}
                      </PreviewList.Root>
                    ) : (
                      <Well data-h2-text-align="base(center)">
                        <p data-h2-font-weight="base(bold)">
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
                              'Communities might be suggested based on your career experience. You can also add functional communities using the "Add a community" button.',
                            id: "w6JVdk",
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
