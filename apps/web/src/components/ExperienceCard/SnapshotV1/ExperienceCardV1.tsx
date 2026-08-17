import { useIntl } from "react-intl";
import ChevronRightIcon from "@heroicons/react/20/solid/ChevronRightIcon";

import type { HeadingRank } from "@gc-digital-talent/ui";
import {
  Collapsible,
  Heading,
  Button,
  incrementHeadingRank,
  Separator,
  Notice,
  useControllableState,
  Ul,
  UNICODE_CHAR,
} from "@gc-digital-talent/ui";
import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";
import type { Skill } from "@gc-digital-talent/graphql";
import {
  EmploymentCategory,
  GovEmployeeType,
} from "@gc-digital-talent/graphql";
import { nodeToString } from "@gc-digital-talent/helpers";

import {
  getExperienceFormLabels,
  isAwardExperience,
  isCommunityExperience,
  isEducationExperience,
  isPersonalExperience,
  isWorkExperience,
  useExperienceInfo,
  type SnapshotExperience,
} from "~/utils/experienceUtils";

import ContentSection from "../ContentSection";
import CommunityContent from "../CommunityContent";
import WorkStreamContent from "../WorkContent/WorkStreamsContent";
import { getV1ExperienceName } from "./utils";
import PersonalContentV1 from "./PersonalContentV1";
import AwardContentV1 from "./AwardContentV1";
import WorkContentV1 from "./WorkContentV1";
import EducationContentV1 from "./EducationContentV1";

interface FlexibleSnapshotExperience extends SnapshotExperience {
  details?: string | null;
  description?: string | null;
}

type SimpleSkill = Pick<Skill, "id">;

interface ExperienceCardV1Props {
  // Override ID if more than one card is used, for uniqueness
  id?: string;
  experience: FlexibleSnapshotExperience;
  headingLevel?: HeadingRank;
  showSkills?: boolean | SimpleSkill | SimpleSkill[];
  hideDetails?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  isOpen?: boolean;
}

const ExperienceCardV1 = ({
  id,
  experience,
  hideDetails = false,
  isOpen: isOpenProp,
  onOpenChange,
  headingLevel = "h2",
  showSkills = true,
}: ExperienceCardV1Props) => {
  const intl = useIntl();
  const [isOpen, setIsOpen] = useControllableState({
    controlledProp: isOpenProp,
    defaultValue: false,
    onChange: onOpenChange,
  });
  const experienceLabels = getExperienceFormLabels(intl);
  const title =
    nodeToString(getV1ExperienceName(experience, intl)) ??
    intl.formatMessage(commonMessages.notProvided).toString();
  const titleHtml = getV1ExperienceName(experience, intl, true);
  const { icon, typeMessage, date } = useExperienceInfo(experience);
  const contentHeadingLevel = incrementHeadingRank(headingLevel);
  const Icon = icon;

  const skills = Array.isArray(showSkills)
    ? experience.skills?.filter((skill) =>
        showSkills.some((showSkill) => showSkill.id === skill.id),
      )
    : experience.skills;
  const singleSkill =
    typeof showSkills !== "boolean" &&
    !Array.isArray(showSkills) &&
    "id" in showSkills
      ? experience.skills?.find((skill) => skill.id === showSkills.id)
      : null;

  const skillCount = skills?.length;

  return (
    <div
      id={id ?? `experience-${experience.id}`}
      className="rounded-r-md border-l-12 border-error bg-white p-6 shadow-lg dark:bg-gray-600 iap:border-secondary iap:dark:border-secondary-200"
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-x-6 xs:flex-nowrap">
        <Heading
          icon={Icon}
          level={headingLevel}
          size="h6"
          color="error"
          className="m-0 font-normal"
        >
          <span>{titleHtml}</span>
        </Heading>
      </div>
      <p className="mt-3 mb-6 flex flex-wrap items-center justify-center gap-x-3 text-gray-600 xs:flex-nowrap xs:justify-normal dark:text-gray-100">
        <span>{typeMessage}</span>
        {isWorkExperience(experience) &&
          experience.employmentCategory?.value ===
            EmploymentCategory.GovernmentOfCanada && (
            <>
              <span aria-hidden="true">{UNICODE_CHAR.BULLET}</span>
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
            GovEmployeeType.Contractor && (
            <>
              <span aria-hidden="true">{UNICODE_CHAR.BULLET}</span>
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
              <span aria-hidden="true">{UNICODE_CHAR.BULLET}</span>
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
            <span aria-hidden="true">{UNICODE_CHAR.BULLET}</span>
            <span>{date}</span>
          </>
        )}
      </p>
      {singleSkill?.experienceSkillRecord?.details && (
        <>
          <Heading
            level={contentHeadingLevel}
            size="h6"
            className="mt-6 mb-3 text-base"
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
          className="mt-6"
        >
          <Collapsible.Trigger asChild>
            <Button
              type="button"
              mode="inline"
              color="black"
              className="group/collapse"
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
              <span className="flex items-center gap-x-1.5">
                <ChevronRightIcon className="size-7.5 rotate-0 transition-transform duration-150 group-data-[state=open]/collapse:rotate-90" />
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
          <Collapsible.Content className="pl-9">
            <Separator space="sm" />
            {isAwardExperience(experience) && (
              <AwardContentV1
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
              <EducationContentV1
                experience={experience}
                headingLevel={contentHeadingLevel}
              />
            )}
            {isWorkExperience(experience) && (
              <WorkContentV1
                experience={experience}
                headingLevel={contentHeadingLevel}
              />
            )}
            {isPersonalExperience(experience) && (
              <PersonalContentV1
                experience={experience}
                headingLevel={contentHeadingLevel}
              />
            )}
            <Separator space="sm" />
            <ContentSection
              title={experienceLabels.details}
              headingLevel={headingLevel}
            >
              {experience.details ??
                intl.formatMessage(commonMessages.notAvailable)}
            </ContentSection>
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
                <div className="mt-6">
                  {skills && skillCount ? (
                    <Ul space="sm">
                      {skills.map((skill) => (
                        <li key={skill.id}>
                          <span className="block font-bold">
                            {getLocalizedName(skill.name, intl)}
                          </span>
                          <span>
                            {skill.experienceSkillRecord?.details ??
                              intl.formatMessage(commonMessages.notAvailable)}
                          </span>
                        </li>
                      ))}
                    </Ul>
                  ) : (
                    <Notice.Root>
                      <Notice.Content>
                        <p className="text-center">
                          {intl.formatMessage({
                            defaultMessage:
                              "No skills have been linked to this experience.",
                            id: "exxM/M",
                            description:
                              "Text displayed when no skills have been linked to an experience",
                          })}
                        </p>
                      </Notice.Content>
                    </Notice.Root>
                  )}
                </div>
              </>
            )}
            {isWorkExperience(experience) && (
              <WorkStreamContent
                workStreams={experience.workStreams}
                headingLevel={headingLevel}
              />
            )}
          </Collapsible.Content>
        </Collapsible.Root>
      )}
    </div>
  );
};

export default ExperienceCardV1;
