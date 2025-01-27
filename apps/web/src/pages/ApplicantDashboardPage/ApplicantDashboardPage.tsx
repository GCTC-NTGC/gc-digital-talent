/* eslint-disable import/no-unused-modules */
import { useIntl } from "react-intl";
import { useQuery } from "urql";
import Cog8ToothIcon from "@heroicons/react/24/outline/Cog8ToothIcon";

import {
  Accordion,
  AccordionMetaData,
  Pending,
  ResourceBlock,
  TaskCard,
} from "@gc-digital-talent/ui";
import { ROLE_NAME } from "@gc-digital-talent/auth";
import {
  graphql,
  ApplicantDashboard_QueryQuery as ApplicantDashboardQueryType,
} from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";

import useRoutes from "~/hooks/useRoutes";
import SEO from "~/components/SEO/SEO";
import { getFullNameHtml } from "~/utils/nameUtils";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import Hero from "~/components/Hero";

import MoveInterestsList from "./components/MoveInterestsList";
import OrganizationTypeInterestsList from "./components/OrganizationInterestsList";

export interface DashboardPageProps {
  currentUser?: ApplicantDashboardQueryType["me"];
}

export const DashboardPage = ({ currentUser }: DashboardPageProps) => {
  const intl = useIntl();
  const paths = useRoutes();

  const moveInterestsMapped = currentUser?.employeeProfile?.moveInterest
    ? currentUser.employeeProfile.moveInterest.map((interest) => interest.value)
    : null;
  const organizationTypeInterestsMapped = currentUser?.employeeProfile
    ?.organizationTypeInterest
    ? currentUser.employeeProfile.organizationTypeInterest.map(
        (interest) => interest.value,
      )
    : null;

  const careerPlanningMetaData: AccordionMetaData[] = [
    {
      key: "edit-career-planning-key",
      type: "link",
      href: "#",
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

  return (
    <>
      <SEO title={""} description={""} />
      <Hero
        title={intl.formatMessage(
          {
            defaultMessage:
              "Welcome back<hidden> to your applicant dashboard</hidden>, {name}",
            id: "bw4CAS",
            description:
              "Title for applicant dashboard on the talent cloud admin portal.",
          },
          {
            name: currentUser
              ? getFullNameHtml(
                  currentUser.firstName,
                  currentUser.lastName,
                  intl,
                )
              : intl.formatMessage(commonMessages.notAvailable),
          },
        )}
        subtitle={""}
      />
      <section data-h2-margin="base(x3, 0)">
        <div data-h2-wrapper="base(center, large, x1) p-tablet(center, large, x2)">
          <div
            data-h2-display="base(flex)"
            data-h2-flex-direction="base(column) p-tablet(row)"
            data-h2-gap="base(x1)"
          >
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
                    // value={accordionItems}
                    // onValueChange={(newValue: AccordionItems) => {
                    //   setAccordionItems(newValue);
                    // }}
                    type="multiple"
                    // we don't need that fat padding in the accordion inside the task card
                    data-h2-padding-bottom="base:selectors[>.Accordion__Item > .Accordion__Content](x.5)"
                  >
                    <Accordion.Item value="your_talent_searches">
                      <Accordion.Trigger
                        as="h3"
                        subtitle={intl.formatMessage({
                          defaultMessage:
                            "Opt in to your profile information being shared with recruiters and talent management staff so that you can be referred for job opportunities or training.",
                          id: "L4UWvU",
                          description:
                            "Subtitle explaining career planning expandable withing career development card",
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
                        >
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
                            <p>
                              {intl.formatMessage({
                                defaultMessage:
                                  "<red>Missing information</red>",
                                id: "hI7luh",
                                description: "Missing information, warning",
                              })}
                            </p>
                          )}
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
                            <p>
                              {intl.formatMessage({
                                defaultMessage:
                                  "<red>Missing information</red>",
                                id: "hI7luh",
                                description: "Missing information, warning",
                              })}
                            </p>
                          )}
                        </div>
                      </Accordion.Content>
                    </Accordion.Item>
                  </Accordion.Root>
                </TaskCard.Item>
              </TaskCard.Root>
            </div>
            <div
              data-h2-display="base(flex)"
              data-h2-flex-direction="base(column)"
              data-h2-gap="base(x1)"
              data-h2-max-width="p-tablet(x14)"
            >
              <ResourceBlock.Root
                headingColor="tertiary"
                headingAs="h2"
                title={intl.formatMessage({
                  defaultMessage: "Resources",
                  id: "nGSUzp",
                  description: "Card title for a 'resources' card",
                })}
              >
                <ResourceBlock.SingleLinkItem
                  title={intl.formatMessage({
                    defaultMessage: "Learn about skills",
                    id: "n40Nry",
                    description: "Link for the 'learn about skills' card",
                  })}
                  href={paths.skills()}
                  description={intl.formatMessage({
                    defaultMessage:
                      "Browse a complete list of available skills, learn how they’re organized, and recommend additional skills to include.",
                    id: "CTBcGm",
                    description: "the 'Learn about skills' tool description",
                  })}
                />
              </ResourceBlock.Root>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

const ApplicantDashboard_Query = graphql(/* GraphQL */ `
  query ApplicantDashboard_Query {
    me {
      id
      firstName
      lastName
      employeeProfile {
        moveInterest {
          value
        }
        organizationTypeInterest {
          value
        }
      }
    }
  }
`);

export const ApplicantDashboardPageApi = () => {
  const [{ data, fetching, error }] = useQuery({
    query: ApplicantDashboard_Query,
  });

  return (
    <Pending fetching={fetching} error={error}>
      <DashboardPage currentUser={data?.me} />
    </Pending>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.Applicant]}>
    <ApplicantDashboardPageApi />
  </RequireAuth>
);

Component.displayName = "ApplicantDashboardPage";
