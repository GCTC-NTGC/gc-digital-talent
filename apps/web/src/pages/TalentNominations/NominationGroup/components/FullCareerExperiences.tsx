import { ReactNode, useState } from "react";
import { useIntl } from "react-intl";
import NewspaperIcon from "@heroicons/react/24/outline/NewspaperIcon";

import {
  Accordion,
  Button,
  CardSeparator,
  Heading,
  Well,
} from "@gc-digital-talent/ui";
import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import {
  assertUnreachable,
  notEmpty,
  unpackMaybes,
} from "@gc-digital-talent/helpers";

import experienceMessages from "~/messages/experienceMessages";
import ExperienceCard from "~/components/ExperienceCard/ExperienceCard";

import {
  AccordionSection,
  buildTypeSections,
  buildWorkStreamSections,
} from "./fullCareerExperiencesUtils";

export const FullCareerExperiences_Fragment = graphql(/* GraphQL */ `
  fragment FullCareerExperiences on User {
    experiences {
      id
      ... on AwardExperience {
        awardedDate
      }
      ... on CommunityExperience {
        startDate
        endDate
      }
      ... on EducationExperience {
        startDate
        endDate
      }
      ... on PersonalExperience {
        startDate
        endDate
      }
      ... on WorkExperience {
        startDate
        endDate
        workStreams {
          id
        }
      }
      ...ExperienceCard
    }
  }
`);

const FullCareerExperiencesOptions_Fragment = graphql(/* GraphQL */ `
  fragment FullCareerExperiencesOptions on Query {
    workStreams {
      id
      name {
        localized
      }
    }
  }
`);
interface FullCareerExperiencesProps {
  query: FragmentType<typeof FullCareerExperiences_Fragment>;
  optionsQuery: FragmentType<typeof FullCareerExperiencesOptions_Fragment>;
  shareProfile?: boolean;
  defaultOpen?: boolean;
}

const FullCareerExperiences = ({
  query,
  optionsQuery,
  shareProfile,
  defaultOpen = false,
}: FullCareerExperiencesProps) => {
  const intl = useIntl();
  const data = getFragment(FullCareerExperiences_Fragment, query);
  const optionsData = getFragment(
    FullCareerExperiencesOptions_Fragment,
    optionsQuery,
  );
  const experiences = data?.experiences?.filter(notEmpty) ?? [];
  const workStreams = optionsData.workStreams.filter(notEmpty) ?? [];
  const [selectedView, setSelectedView] = useState<"type" | "workStream">(
    "type",
  );

  let accordionSections: AccordionSection[] = [];
  let footer: ReactNode = null;

  if (selectedView == "type") {
    accordionSections = buildTypeSections(experiences, intl);
    footer = null;
  } else if (selectedView == "workStream") {
    const sections = buildWorkStreamSections(experiences, workStreams, intl);
    accordionSections = sections.experienceSections;
    footer = sections.footer;
  } else {
    assertUnreachable(selectedView);
  }

  const sectionIds = accordionSections.map((section) => section.id);

  const [openSections, setOpenSections] = useState<string[]>(
    defaultOpen ? sectionIds : [],
  );
  const hasOpenSections = openSections.length > 0;

  const toggleSections = () => {
    setOpenSections((currentOpen) => {
      return currentOpen.length > 0 ? [] : sectionIds;
    });
  };

  return (
    <>
      {/* heading section */}
      <div
        data-h2-display="base(flex)"
        data-h2-align-items="base(center)"
        data-h2-justify-content="base(space-between)"
      >
        <div>
          <Heading
            level="h2"
            Icon={NewspaperIcon}
            color="quaternary"
            data-h2-font-weight="base(400)"
            data-h2-margin="base(0)"
          >
            {intl.formatMessage({
              defaultMessage: "Full career",
              id: "+mG20j",
              description: "Heading for career experience",
            })}
          </Heading>
        </div>
        {shareProfile && (
          <div>
            <Button
              type="button"
              mode="inline"
              color="secondary"
              onClick={toggleSections}
            >
              {intl.formatMessage(
                hasOpenSections
                  ? experienceMessages.collapseDetails
                  : experienceMessages.expandDetails,
              )}
            </Button>
          </div>
        )}
      </div>

      <p data-h2-margin="base(x.5 x1.5 x1 x1.5)">
        {intl.formatMessage({
          defaultMessage:
            "This section allows you to browse the nominee’s full career experience. By default, experience is organized by type, however you can choose to see how much experience the nominee has in a particular work stream or type of department using the options provided",
          id: "gu2wRn",
          description: "Description for the career page full career section",
        })}
      </p>
      <div>
        {/* If can share profile, show controls. Otherwise, show error well */}
        {shareProfile ? (
          <div
            data-h2-display="base(flex)"
            data-h2-align-items="base(center)"
            data-h2-gap="base(x1)"
          >
            <p data-h2-margin="base(0)">
              {intl.formatMessage({
                defaultMessage: "Show experience by:",
                id: "KR4kRt",
                description: "Label for experience sorting options",
              })}
            </p>
            <Button
              type="button"
              mode="inline"
              color="secondary"
              onClick={() => setSelectedView("type")}
              data-h2-font-weight={
                selectedView === "type" ? "base(700)" : "base(400)"
              }
            >
              {intl.formatMessage({
                defaultMessage: "Type",
                id: "trerKD",
                description: "Button to filter experiences by type",
              })}
            </Button>
            <Button
              type="button"
              mode="inline"
              color="secondary"
              onClick={() => setSelectedView("workStream")} // Set view to "workStream"
              data-h2-font-weight={
                selectedView === "workStream" ? "base(700)" : "base(400)"
              } // Bold when selected
              aria-pressed={selectedView === "workStream"}
            >
              {intl.formatMessage({
                defaultMessage: "Work Stream",
                id: "27YVit",
                description: "Button to filter experiences by work stream",
              })}
            </Button>
          </div>
        ) : (
          <Well data-h2-margin="base(0 x1.5 x1.75 x1.5)" color="error">
            <p data-h2-margin-bottom="base(x1)" data-h2-font-weight="base(700)">
              {intl.formatMessage({
                defaultMessage:
                  "This nominee has not agreed to share their information with your community",
                id: "4ujr5X",
                description: "Null message for nominee profile",
              })}
            </p>
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "Nominees can agree to provide access to their profile using the “Functional communities” tool on their dashboard.",
                id: "8plD42",
                description: "Null secondary message for nominee profile",
              })}
            </p>
          </Well>
        )}
      </div>
      <div>
        {/* If can share profile, show accordion. Otherwise, show nothing */}
        {shareProfile ? (
          <>
            <Accordion.Root
              type="multiple"
              mode="card"
              value={openSections}
              onValueChange={setOpenSections} // Sync state with Accordion
              data-h2-margin="base(0, 0)"
            >
              {accordionSections.map(
                ({ id, title, subtitle, experiences: sectionExperiences }) => (
                  <Accordion.Item key={id} value={id}>
                    <Accordion.Trigger subtitle={subtitle ?? undefined}>
                      {/* eslint-disable-next-line formatjs/no-literal-string-in-jsx */}
                      {title} ({sectionExperiences.length})
                    </Accordion.Trigger>
                    <Accordion.Content>
                      <div>
                        <div
                          data-h2-display="base(flex)"
                          data-h2-flex-direction="base(column)"
                          data-h2-gap="base(x.5 0)"
                        >
                          {unpackMaybes(
                            sectionExperiences.map((experience) => {
                              return (
                                <ExperienceCard
                                  key={experience?.id}
                                  experience={experience}
                                  showEdit={false}
                                />
                              );
                            }),
                          )}
                        </div>
                      </div>
                    </Accordion.Content>
                  </Accordion.Item>
                ),
              )}
            </Accordion.Root>
            {footer ? (
              <>
                <CardSeparator
                  data-h2-margin-top="base(x1)"
                  data-h2-margin-bottom="base(x1)"
                  space="none"
                />
                {footer}
              </>
            ) : null}
          </>
        ) : null}
      </div>
    </>
  );
};

export default FullCareerExperiences;
