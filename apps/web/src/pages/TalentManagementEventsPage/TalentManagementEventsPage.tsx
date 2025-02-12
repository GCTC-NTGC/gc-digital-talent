import { useIntl } from "react-intl";
import MegaphoneOutlineIcon from "@heroicons/react/24/outline/MegaphoneIcon";
import { useQuery } from "urql";
import { ReactNode } from "react";

import {
  Flourish,
  Loading,
  TableOfContents,
  Well,
} from "@gc-digital-talent/ui";
import { navigationMessages } from "@gc-digital-talent/i18n";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { graphql } from "@gc-digital-talent/graphql";

import Hero from "~/components/Hero";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import useRoutes from "~/hooks/useRoutes";
import TalentNominationEventCard from "~/components/TalentNominationEventCard/TalentNominationEventCard";

const TalentManagementEventsPage_Query = graphql(/* GraphQL */ `
  query TalentManagementEventsPage {
    activeEvents: talentNominationEvents(status: ACTIVE) {
      id
      ...TalentNominationEventCard
    }
  }
`);

interface Section {
  id: string;
  title: ReactNode;
}

export const Component = () => {
  const intl = useIntl();
  const paths = useRoutes();

  const [{ data, fetching }] = useQuery({
    query: TalentManagementEventsPage_Query,
  });

  const activeEvents = unpackMaybes(data?.activeEvents);

  const pageTitle = intl.formatMessage(
    navigationMessages.talentManagementEvents,
  );

  const subtitle = intl.formatMessage({
    defaultMessage:
      "Learn more about the events that focus on talent promotion, lateral movement, and professional development.",
    id: "HPaQCC",
    description: "Subtitle for talent management events page",
  });

  const sections: Section[] = [
    {
      id: "active-events",
      title: intl.formatMessage({
        defaultMessage: "Active events",
        id: "9SO6OE",
        description: "Title for active events section",
      }),
    },
  ];

  const crumbs = useBreadcrumbs({
    crumbs: [
      {
        label: pageTitle,
        url: paths.talentManagementEvents(),
      },
    ],
  });

  return (
    <>
      <Hero title={pageTitle} subtitle={subtitle} crumbs={crumbs} />
      <div data-h2-wrapper="base(center, large, x1) p-tablet(center, large, x2)">
        <TableOfContents.Wrapper data-h2-margin-top="base(x3)">
          <TableOfContents.Navigation>
            <TableOfContents.List>
              {sections.map((section) => (
                <TableOfContents.ListItem key={section.id}>
                  <TableOfContents.AnchorLink id={section.id}>
                    {section.title}
                  </TableOfContents.AnchorLink>
                </TableOfContents.ListItem>
              ))}
            </TableOfContents.List>
          </TableOfContents.Navigation>
          <TableOfContents.Content>
            <TableOfContents.Section id={sections[0].id}>
              <TableOfContents.Heading
                size="h3"
                icon={MegaphoneOutlineIcon}
                color="primary"
                data-h2-margin-top="base(0)"
              >
                {sections[0].title}
              </TableOfContents.Heading>
              <p data-h2-margin="base(x1 0)">
                {intl.formatMessage({
                  defaultMessage:
                    'Events found in this section are currently accepting nominations. Use the "Learn more" link on each event card to find details outlining eligibility criteria and requirements.',
                  id: "Pva73v",
                  description: "Description for active events section",
                })}
              </p>
              {fetching ? (
                <Loading inline />
              ) : activeEvents.length > 0 ? (
                <div
                  data-h2-display="base(flex)"
                  data-h2-flex-direction="base(column)"
                  data-h2-gap="base(x.25)"
                >
                  {activeEvents.map((item) => (
                    <TalentNominationEventCard
                      key={item.id}
                      talentNominationEventQuery={item}
                    />
                  ))}
                </div>
              ) : (
                <Well data-h2-text-align="base(center)">
                  <p
                    data-h2-font-weight="base(700)"
                    data-h2-margin-bottom="base(x.5)"
                  >
                    {intl.formatMessage({
                      defaultMessage:
                        "There aren't any active events at the moment.",
                      id: "5iTUew",
                      description:
                        "Message title displayed when no active events",
                    })}
                  </p>
                  <p>
                    {intl.formatMessage({
                      defaultMessage:
                        "Check back regularly for nomination opportunities. Each functional community runs events on unique schedules and the moment an event is prepared, it will appear here ahead of launching.",
                      id: "kl3wX/",
                      description:
                        "Message description displayed when no active events",
                    })}
                  </p>
                </Well>
              )}
            </TableOfContents.Section>
          </TableOfContents.Content>
        </TableOfContents.Wrapper>
      </div>
      <Flourish />
    </>
  );
};

Component.displayName = "TalentManagementEventsPage";

export default Component;
