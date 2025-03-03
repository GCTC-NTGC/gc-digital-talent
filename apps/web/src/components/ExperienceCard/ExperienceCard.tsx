import { useIntl } from "react-intl";
import isArray from "lodash/isArray";
import isBoolean from "lodash/isBoolean";
import ChevronRightIcon from "@heroicons/react/20/solid/ChevronRightIcon";
import { ReactNode } from "react";

import {
  Collapsible,
  HeadingRank,
  Heading,
  Button,
  incrementHeadingRank,
  Separator,
  Well,
  useControllableState,
} from "@gc-digital-talent/ui";
import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";
import {
  EmploymentCategory,
  Skill,
  WorkExperienceGovEmployeeType,
} from "@gc-digital-talent/graphql";

import { AnyExperience } from "~/types/experience";
import {
  getExperienceFormLabels,
  isAwardExperience,
  isCommunityExperience,
  isEducationExperience,
  isPersonalExperience,
  isWorkExperience,
  useExperienceInfo,
} from "~/utils/experienceUtils";

import ExperienceSkillFormDialog from "../ExperienceSkillFormDialog/ExperienceSkillFormDialog";
import AwardContent from "./AwardContent";
import ContentSection from "./ContentSection";
import CommunityContent from "./CommunityContent";
import EducationContent from "./EducationContent";
import WorkContent from "./WorkContent";
import EditLink from "./EditLink";
import WorkStreamContent from "./WorkContent/WorkStreamsContent";

type EditMode = "link" | "dialog";

interface ExperienceCardProps {
  // Override ID if more than one card is used, for uniqueness
  id?: string;
  experience: AnyExperience;
  headingLevel?: HeadingRank;
  showSkills?: boolean | Skill | Skill[];
  showEdit?: boolean;
  hideDetails?: boolean;
  editParam?: string;
  // Override the edit path if needed
  editPath?: string;
  editMode?: EditMode;
  // Allows passing in a link to view a specific experience
  view?: ReactNode;
  onSave?: () => void;
  linkTo?: Skill;
  editTrigger?: ReactNode;
  onOpenChange?: (isOpen: boolean) => void;
  isOpen?: boolean;
}

const ExperienceCard = ({
  id,
  experience,
  editParam,
  editPath: editPathProp,
  editMode = "link",
  view = null,
  hideDetails = false,
  onSave,
  linkTo,
  editTrigger,
  isOpen: isOpenProp,
  onOpenChange,
  headingLevel = "h2",
  showSkills = true,
  showEdit = true,
}: ExperienceCardProps) => {
  const intl = useIntl();
  const [isOpen, setIsOpen] = useControllableState({
    controlledProp: isOpenProp,
    defaultValue: false,
    onChange: onOpenChange,
  });
  const experienceLabels = getExperienceFormLabels(intl);
  const { title, titleHtml, editPath, icon, typeMessage, date } =
    useExperienceInfo(experience);
  const contentHeadingLevel = incrementHeadingRank(headingLevel);
  const Icon = icon;

  const skills = isArray(showSkills)
    ? experience.skills?.filter((skill) =>
        showSkills.some((showSkill) => showSkill.id === skill.id),
      )
    : experience.skills;
  const singleSkill =
    !isBoolean(showSkills) && !isArray(showSkills) && "id" in showSkills
      ? experience.skills?.find((skill) => skill.id === showSkills.id)
      : false;

  const skillCount = skills?.length;

  const edit =
    (editPath || editParam) && editMode === "link" ? (
      <EditLink
        editUrl={`${editPathProp ?? editPath}${editParam ?? ""}`}
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
        {intl.formatMessage(commonMessages.edit)}
      </EditLink>
    ) : (
      <ExperienceSkillFormDialog
        onSave={onSave}
        skill={linkTo}
        trigger={editTrigger}
        experience={experience}
      />
    );

  return (
    <div
      id={id ?? `experience-${experience.id}`}
      data-h2-border-left="base(x.5 solid tertiary) base:iap(x.5 solid secondary) base:iap:dark(x.5 solid secondary.lighter)"
      data-h2-padding="base(x1)"
      data-h2-shadow="base(larger)"
      data-h2-radius="base(0 rounded rounded 0)"
      data-h2-background-color="base(foreground)"
    >
      <div
        data-h2-display="base(flex)"
        data-h2-align-items="base(center)"
        data-h2-justify-content="base(space-between)"
        data-h2-gap="base(0 x1)"
        data-h2-margin-bottom="base(x.5)"
      >
        <Heading
          Icon={Icon}
          level={headingLevel}
          size="h6"
          color="tertiary"
          data-h2-margin="base(0)"
          data-h2-font-weight="base(400)"
        >
          <span>{titleHtml}</span>
        </Heading>
        {showEdit && edit}
        {view}
      </div>
      <p
        data-h2-display="base(flex)"
        data-h2-align-items="base(center)"
        data-h2-gap="base(0 x.5)"
        data-h2-margin="base(x.25, 0, x1, 0)"
        data-h2-color="base(black.light)"
      >
        <span>{typeMessage}</span>
        {isWorkExperience(experience) &&
          experience.employmentCategory?.value ===
            EmploymentCategory.GovernmentOfCanada && (
            <>
              <span aria-hidden>&bull;</span>
              <span>
                {intl.formatMessage({
                  defaultMessage: "Government of Canada",
                  id: "OKqOVT",
                  description:
                    "Label for goc employment category on work experience card metadata",
                })}
              </span>
            </>
          )}
        {isWorkExperience(experience) &&
          experience.employmentCategory?.value ===
            EmploymentCategory.GovernmentOfCanada &&
          experience.govEmploymentType?.value ===
            WorkExperienceGovEmployeeType.Contractor && (
            <>
              <span aria-hidden>&bull;</span>
              <span>
                {intl.formatMessage({
                  defaultMessage: "Contractor",
                  id: "dpZ2B9",
                  description:
                    "Label for contractor employment type on work experience card metadata",
                })}
              </span>
            </>
          )}
        {isWorkExperience(experience) &&
          experience.employmentCategory?.value ===
            EmploymentCategory.CanadianArmedForces && (
            <>
              <span aria-hidden>&bull;</span>
              <span>
                {intl.formatMessage({
                  defaultMessage: "Canadian Armed Forces",
                  id: "dBpcNA",
                  description:
                    "Label for caf employment category on work experience card metadata",
                })}
              </span>
            </>
          )}
        {date && (
          <>
            <span aria-hidden>&bull;</span>
            <span>{date}</span>
          </>
        )}
      </p>
      {singleSkill && singleSkill.experienceSkillRecord?.details && (
        <>
          <Heading
            level={contentHeadingLevel}
            size="h6"
            data-h2-font-size="base(copy)"
            data-h2-margin="base(x1 0 x.5 0)"
          >
            {intl.formatMessage(
              {
                defaultMessage:
                  'How you applied "{skillName}" in this experience',
                id: "J8Nltm",
                description: "Heading for a single skill on an experience.",
              },
              {
                skillName: getLocalizedName(singleSkill.name, intl),
              },
            )}
          </Heading>
          <p>{singleSkill.experienceSkillRecord.details}</p>
        </>
      )}
      {!hideDetails && (
        <Collapsible.Root
          open={isOpen}
          onOpenChange={setIsOpen}
          data-h2-margin-top="base(x1)"
        >
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
            <Separator space="sm" />
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
            {isWorkExperience(experience) && (
              <WorkContent
                experience={experience}
                headingLevel={contentHeadingLevel}
              />
            )}
            {/** Personal type has no custom content so separator is redundant */}
            {!isPersonalExperience(experience) && <Separator space="sm" />}
            <ContentSection
              title={experienceLabels.details}
              headingLevel={headingLevel}
            >
              {experience.details ??
                intl.formatMessage(commonMessages.notAvailable)}
            </ContentSection>
            {isWorkExperience(experience) && (
              <WorkStreamContent
                workStreams={experience.workStreams}
                headingLevel={headingLevel}
              />
            )}
            {showSkills && !singleSkill && (
              <>
                <Separator space="sm" />
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
                      "You can link new skills by editing this experience or adding the skill to your skills portfolio. Skills added to this experience through job applications also appear here.",
                    id: "9nwXXJ",
                    description:
                      "Lead in text for list of skills linked to a specific experience",
                  })}
                </ContentSection>
                <div data-h2-margin-top="base(x1)">
                  {skills && skillCount ? (
                    <ul
                      data-h2-list-style-position="base(outside)"
                      data-h2-padding-left="base(x.75)"
                    >
                      {skills.map((skill) => (
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
      )}
    </div>
  );
};

export default ExperienceCard;
