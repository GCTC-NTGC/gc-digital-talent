import { ReactNode, useId, useState } from "react";
import { useIntl } from "react-intl";
import NewspaperIcon from "@heroicons/react/24/outline/NewspaperIcon";

import {
  Accordion,
  Button,
  CardSeparator,
  Heading,
  Ul,
  Well,
} from "@gc-digital-talent/ui";
import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import {
  assertUnreachable,
  notEmpty,
  unpackMaybes,
} from "@gc-digital-talent/helpers";
import { commonMessages } from "@gc-digital-talent/i18n";

import experienceMessages from "~/messages/experienceMessages";
import ExperienceCard from "~/components/ExperienceCard/ExperienceCard";

import {
  AccordionSection,
  buildExperienceByTypeData,
  buildExperienceByWorkStreamData,
} from "./fullCareerExperiencesUtils";

export const FullCareerExperiencesUser_Fragment = graphql(/* GraphQL */ `
  fragment FullCareerExperiencesUser on User {
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
        type {
          value
          label {
            localized
          }
        }
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

const FullCareerExperiencesTalentNominationGroup_Fragment = graphql(
  /* GraphQL */ `
    fragment FullCareerExperiencesTalentNominationGroup on TalentNominationGroup {
      talentNominationEvent {
        community {
          workStreams {
            id
            name {
              localized
            }
          }
        }
      }
    }
  `,
);

interface FullCareerExperiencesProps {
  userQuery:
    | FragmentType<typeof FullCareerExperiencesUser_Fragment>
    | null
    | undefined;
  talentNominationGroupQuery:
    | FragmentType<typeof FullCareerExperiencesTalentNominationGroup_Fragment>
    | null
    | undefined;
  shareProfile?: boolean;
  defaultOpen?: boolean;
}

const FullCareerExperiences = ({
  userQuery,
  talentNominationGroupQuery,
  shareProfile,
  defaultOpen = false,
}: FullCareerExperiencesProps) => {
  const intl = useIntl();
  const showExperienceByLabelId = useId();
  const user = getFragment(FullCareerExperiencesUser_Fragment, userQuery);
  const talentNominationGroup = getFragment(
    FullCareerExperiencesTalentNominationGroup_Fragment,
    talentNominationGroupQuery,
  );
  const experiences = user?.experiences?.filter(notEmpty) ?? [];
  const workStreams = unpackMaybes(
    talentNominationGroup?.talentNominationEvent.community?.workStreams,
  );
  const [selectedView, setSelectedView] = useState<"type" | "workStream">(
    "type",
  );

  let accordionSections: AccordionSection[] = [];
  let footer: ReactNode = null;

  if (selectedView == "type") {
    const { sections } = buildExperienceByTypeData(experiences, intl);
    accordionSections = sections;
    footer = null;
  } else if (selectedView == "workStream") {
    const { sections, workStreamsWithNoExperiences } =
      buildExperienceByWorkStreamData(experiences, workStreams, intl);
    accordionSections = sections;
    footer =
      workStreamsWithNoExperiences.length > 0 ? (
        <>
          <p className="mb-1.25 font-bold">
            {intl.formatMessage({
              defaultMessage: "Work streams with no experience",
              id: "PNTlS7",
              description:
                "a description for a list of work streams with no experiences",
            })}
          </p>
          <Ul space="sm">
            {workStreamsWithNoExperiences.map((workStream) => (
              <li key={workStream.id}>
                {workStream.name?.localized ??
                  intl.formatMessage(commonMessages.notProvided)}
              </li>
            ))}
          </Ul>
        </>
      ) : null;
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
      <div className="flex items-center justify-between">
        <div>
          <Heading
            level="h2"
            icon={NewspaperIcon}
            color="warning"
            className="m-0 font-normal"
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
              color="primary"
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

      <p className="mt-3 mb-6">
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
          <div className="flex items-center gap-6">
            <p id={showExperienceByLabelId}>
              {intl.formatMessage({
                defaultMessage: "Show experience by:",
                id: "KR4kRt",
                description: "Label for experience sorting options",
              })}
            </p>
            <Button
              type="button"
              mode="inline"
              color="primary"
              onClick={() => setSelectedView("type")}
              // Bold when selected
              className={selectedView === "type" ? "font-bold" : "font-normal"}
              aria-pressed={selectedView === "type"}
              aria-describedby={showExperienceByLabelId}
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
              color="primary"
              onClick={() => setSelectedView("workStream")} // Set view to "workStream"
              // Bold when selected
              className={selectedView === "type" ? "font-bold" : "font-normal"}
              aria-pressed={selectedView === "workStream"}
              aria-describedby={showExperienceByLabelId}
            >
              {intl.formatMessage({
                defaultMessage: "Work stream",
                id: "UKw7sB",
                description:
                  "Label displayed on the pool form stream/job title field.",
              })}
            </Button>
          </div>
        ) : (
          <Well className="mb-9" color="error">
            <p className="mb-6 font-bold">
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
              className="m-0"
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
                        <div className="flex flex-col gap-y-3">
                          {unpackMaybes(
                            sectionExperiences.map((experience) => {
                              return (
                                <ExperienceCard
                                  key={experience?.id}
                                  experienceQuery={experience}
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
                <CardSeparator space="sm" />
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
