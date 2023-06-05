import React from "react";
import { useIntl } from "react-intl";
import ChevronRightIcon from "@heroicons/react/20/solid/ChevronRightIcon";

import {
  Collapsible,
  HeadingRank,
  Heading,
  Button,
  incrementHeadingRank,
  Separator,
  Well,
} from "@gc-digital-talent/ui";
import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";

import { AnyExperience } from "~/types/experience";
import {
  isAwardExperience,
  isCommunityExperience,
  isEducationExperience,
  isPersonalExperience,
  isWorkExperience,
  useExperienceInfo,
} from "~/utils/experienceUtils";

import AwardContent from "./AwardContent";
import ContentSection from "./ContentSection";
import CommunityContent from "./CommunityContent";
import EducationContent from "./EducationContent";
import PersonalContent from "./PersonalContent";
import WorkContent from "./WorkContent";
import EditLink from "./EditLink";

interface ExperienceCardProps {
  experience: AnyExperience;
  headingLevel?: HeadingRank;
  showSkills?: boolean;
  showEdit?: boolean;
  editParam?: string;
  // If the edit button is a button, pass the onClick function
  onEditClick?: () => void;
}

const ExperienceCard = ({
  experience,
  onEditClick,
  editParam,
  headingLevel = "h2",
  showSkills = true,
  showEdit = true,
}: ExperienceCardProps) => {
  const intl = useIntl();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const { title, titleHtml, editPath, icon, typeMessage } =
    useExperienceInfo(experience);
  const contentHeadingLevel = incrementHeadingRank(headingLevel);
  const Icon = icon;

  const skillCount = experience.skills?.length;

  return (
    <div
      data-h2-border-left="base(x.5 solid tertiary)"
      data-h2-padding="base(x1)"
      data-h2-shadow="base(larger)"
      data-h2-radius="base(0 rounded rounded 0)"
      data-h2-background-color="base(white) base:dark(black)"
    >
      <div
        data-h2-display="base(flex)"
        data-h2-align-items="base(center)"
        data-h2-justify-content="base(space-between)"
        data-h2-gap="base(0 x1)"
        data-h2-margin-bottom="base(x.5)"
      >
        <Heading
          level={headingLevel}
          size="h6"
          data-h2-margin="base(0)"
          data-h2-font-weight="base(400)"
        >
          {titleHtml}
        </Heading>
        {showEdit && (editPath || onEditClick) && (
          <EditLink
            editUrl={onEditClick ? undefined : `${editPath}${editParam || ""}`}
            onEditClick={onEditClick}
            ariaLabel={intl
              .formatMessage(
                {
                  defaultMessage: "Edit {experienceName}",
                  id: "CDV1Cw",
                  description: "Link text to edit a specific experience",
                },
                {
                  experienceName: title,
                },
              )
              .toString()}
          >
            {intl.formatMessage({
              defaultMessage: "Edit",
              id: "vXwT4K",
              description: "Generic link text to edit a miscellaneous item",
            })}
          </EditLink>
        )}
      </div>
      <p
        data-h2-display="base(flex)"
        data-h2-align-items="base(center)"
        data-h2-gap="base(0 x.5)"
        data-h2-margin="base(x1 0)"
      >
        <span
          data-h2-display="base(flex)"
          data-h2-align-items="base(center)"
          data-h2-gap="base(0 x.25)"
        >
          <Icon
            data-h2-color="base(tertiary)"
            data-h2-height="base(1.2em)"
            data-h2-width="base(1.2em)"
          />
          <span data-h2-color="base(tertiary.darker)">{typeMessage}</span>
        </span>
        <span aria-hidden>•</span>
        <span data-h2-color="base(black.light)">
          {intl.formatMessage(
            {
              defaultMessage: "{skillCount} featured skills",
              id: "8LPNbf",
              description: "Number of skills attached to a specific experience",
            },
            { skillCount },
          )}
        </span>
      </p>
      <Collapsible.Root open={isOpen} onOpenChange={setIsOpen}>
        <Collapsible.Trigger asChild>
          <Button
            type="button"
            mode="inline"
            color="black"
            data-h2-transform="base:children[.ExperienceCard__Chevron](rotate(0deg)) base:selectors[[data-state='open']]:children[.ExperienceCard__Chevron](rotate(90deg))"
            aria-label={
              isOpen
                ? intl
                    .formatMessage(
                      {
                        defaultMessage: "Hide {experienceName} details",
                        id: "pLef1V",
                        description:
                          "Button text to hide a specific experience's details",
                      },
                      { experienceName: title },
                    )
                    .toString()
                : intl
                    .formatMessage(
                      {
                        defaultMessage: "Show {experienceName} details",
                        id: "ge40rv",
                        description:
                          "Button text to show a specific experience's details",
                      },
                      { experienceName: title },
                    )
                    .toString()
            }
          >
            <span
              data-h2-display="base(flex)"
              data-h2-align-items="base(center)"
              data-h2-gap="base(0 x.25)"
            >
              <ChevronRightIcon
                data-h2-height="base(x1.25)"
                data-h2-width="base(x1.25)"
                className="ExperienceCard__Chevron"
              />
              <span>
                {isOpen
                  ? intl.formatMessage({
                      defaultMessage: "Hide this experience's details",
                      id: "IxngA3",
                      description:
                        "Button text to hide a miscellaneous experience's details",
                    })
                  : intl.formatMessage({
                      defaultMessage: "Show this experience's details",
                      id: "zxLL3N",
                      description:
                        "Button text to show a miscellaneous experience's details",
                    })}
              </span>
            </span>
          </Button>
        </Collapsible.Trigger>
        <Collapsible.Content data-h2-padding-left="base(x1.5)">
          <Separator
            orientation="horizontal"
            decorative
            data-h2-background-color="base(gray.lighter)"
            data-h2-margin="base(x1 0)"
          />
          {isAwardExperience(experience) && (
            <AwardContent
              experience={experience}
              headingLevel={contentHeadingLevel}
            />
          )}
          {isCommunityExperience(experience) && (
            <CommunityContent
              experience={experience}
              headingLevel={contentHeadingLevel}
            />
          )}
          {isEducationExperience(experience) && (
            <EducationContent
              experience={experience}
              headingLevel={contentHeadingLevel}
            />
          )}
          {isPersonalExperience(experience) && (
            <PersonalContent
              experience={experience}
              headingLevel={contentHeadingLevel}
            />
          )}
          {isWorkExperience(experience) && (
            <WorkContent
              experience={experience}
              headingLevel={contentHeadingLevel}
            />
          )}
          <Separator
            orientation="horizontal"
            decorative
            data-h2-background-color="base(gray.lighter)"
            data-h2-margin="base(x1 0)"
          />
          <ContentSection
            title={intl.formatMessage({
              defaultMessage: "Tasks and responsibilities",
              id: "jDvu8u",
              description:
                "Heading for the tasks section of the experience form",
            })}
            headingLevel={headingLevel}
          >
            {experience.details ??
              intl.formatMessage(commonMessages.notAvailable)}
          </ContentSection>
          {showSkills && (
            <>
              <Separator
                orientation="horizontal"
                decorative
                data-h2-background-color="base(gray.lighter)"
                data-h2-margin="base(x1 0)"
              />
              <ContentSection
                headingLevel={headingLevel}
                title={intl.formatMessage({
                  defaultMessage: "Featured skills",
                  id: "a8wd8c",
                  description:
                    "Label displayed for featured skills attached to an experience",
                })}
              >
                {intl.formatMessage({
                  defaultMessage:
                    "The following skills have been linked to this experience through your skills showcase or job applications. You link new skills by editing this experience or adding the skill to your library in the showcase.",
                  id: "xLIImd",
                  description:
                    "Lead in text for list of skills linked to a specific experience",
                })}
              </ContentSection>
              <div data-h2-margin-top="base(x1)">
                {experience.skills && skillCount ? (
                  <ul
                    data-h2-list-style-position="base(outside)"
                    data-h2-padding-left="base(x.75)"
                  >
                    {experience.skills.map((skill) => (
                      <li key={skill.id} data-h2-margin-bottom="base(x.25)">
                        <span
                          data-h2-font-weight="base(700)"
                          data-h2-display="base(block)"
                        >
                          {getLocalizedName(skill.name, intl)}
                        </span>
                        <span>
                          {skill.experienceSkillRecord?.details ??
                            intl.formatMessage(commonMessages.notAvailable)}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <Well data-h2-margin-top>
                    <p data-h2-text-align="base(center)">
                      {intl.formatMessage({
                        defaultMessage:
                          "No skills have been linked to this experience.",
                        id: "exxM/M",
                        description:
                          "Text displayed when no skills have been linked to an experience",
                      })}
                    </p>
                  </Well>
                )}
              </div>
            </>
          )}
        </Collapsible.Content>
      </Collapsible.Root>
    </div>
  );
};

export default ExperienceCard;
