import { useIntl } from "react-intl";
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
  Notice,
  useControllableState,
  Ul,
  UNICODE_CHAR,
} from "@gc-digital-talent/ui";
import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";
import {
  EmploymentCategory,
  FragmentType,
  getFragment,
  GovEmployeeType,
  graphql,
  Skill,
} from "@gc-digital-talent/graphql";
import { htmlToRichTextJSON, RichTextRenderer } from "@gc-digital-talent/forms";

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
import PersonalContent from "./PersonalContent";

type EditMode = "link" | "dialog";

export const ExperienceCard_Fragment = graphql(/* GraphQL */ `
  fragment ExperienceCard on Experience {
    id
    details
    skills {
      id
      key
      name {
        en
        fr
      }
      description {
        en
        fr
      }
      keywords {
        en
        fr
      }
      category {
        value
        label {
          en
          fr
        }
      }
      experienceSkillRecord {
        details
      }
    }
    ... on AwardExperience {
      title
      issuedBy
      awardedDate
      awardedTo {
        value
        label {
          en
          fr
        }
      }
      awardedScope {
        value
        label {
          en
          fr
        }
      }
    }
    ... on CommunityExperience {
      title
      organization
      project
      startDate
      endDate
    }
    ... on EducationExperience {
      institution
      areaOfStudy
      thesisTitle
      startDate
      endDate
      type {
        value
        label {
          localized
          en
          fr
        }
      }
      status {
        value
        label {
          localized
          en
          fr
        }
      }
    }
    ... on PersonalExperience {
      title
      description
      startDate
      endDate
    }
    ... on WorkExperience {
      id
      role
      organization
      division
      startDate
      endDate
      details
      employmentCategory {
        value
        label {
          localized
          en
          fr
        }
      }
      extSizeOfOrganization {
        value
        label {
          localized
          en
          fr
        }
      }
      extRoleSeniority {
        value
        label {
          localized
          en
          fr
        }
      }
      govEmploymentType {
        value
        label {
          localized
          en
          fr
        }
      }
      govPositionType {
        value
        label {
          localized
          en
          fr
        }
      }
      govContractorRoleSeniority {
        value
        label {
          localized
          en
          fr
        }
      }
      govContractorType {
        value
        label {
          localized
          en
          fr
        }
      }
      contractorFirmAgencyName
      cafEmploymentType {
        value
        label {
          localized
          en
          fr
        }
      }
      cafForce {
        value
        label {
          localized
          en
          fr
        }
      }
      cafRank {
        value
        label {
          localized
          en
          fr
        }
      }
      supervisoryPosition
      supervisedEmployees
      supervisedEmployeesNumber
      budgetManagement
      annualBudgetAllocation
      seniorManagementStatus
      cSuiteRoleTitle {
        value
        label {
          localized
        }
      }
      otherCSuiteRoleTitle
      classification {
        id
        name {
          localized
          en
          fr
        }
        group
        level
        maxSalary
        minSalary
      }
      department {
        id
        name {
          localized
          en
          fr
        }
        departmentNumber
      }
      workStreams {
        id
        key
        name {
          localized
        }
        community {
          id
          key
          name {
            localized
          }
        }
      }
      skills {
        id
        key
        category {
          value
          label {
            localized
          }
        }
        name {
          en
          fr
        }
        experienceSkillRecord {
          details
        }
      }
    }
  }
`);

type SimpleSkill = Pick<Skill, "id">;

interface ExperienceCardProps {
  // Override ID if more than one card is used, for uniqueness
  id?: string;
  experienceQuery: FragmentType<typeof ExperienceCard_Fragment>;
  headingLevel?: HeadingRank;
  showSkills?: boolean | SimpleSkill | SimpleSkill[];
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
  experienceQuery,
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
  const experience = getFragment(ExperienceCard_Fragment, experienceQuery);
  const { title, titleHtml, editPath, icon, typeMessage, date } =
    useExperienceInfo(experience);
  const contentHeadingLevel = incrementHeadingRank(headingLevel);
  const Icon = icon;

  const skills = Array.isArray(showSkills)
    ? experience.skills?.filter((skill) =>
        showSkills.some((showSkill) => showSkill.id === skill.id),
      )
    : experience.skills;
  const singleSkill =
    !isBoolean(showSkills) && !Array.isArray(showSkills) && "id" in showSkills
      ? experience.skills?.find((skill) => skill.id === showSkills.id)
      : null;

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
        {(showEdit || view) && (
          <div className="mt-6 mb-3 block w-full text-center xs:m-0 xs:w-auto xs:text-left">
            {showEdit && edit}
            {view}
          </div>
        )}
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
            {isPersonalExperience(experience) && (
              <PersonalContent
                experience={experience}
                headingLevel={contentHeadingLevel}
              />
            )}
            <Separator space="sm" />
            <ContentSection
              title={experienceLabels.details}
              headingLevel={headingLevel}
            >
              <RichTextRenderer
                node={htmlToRichTextJSON(
                  experience.details ??
                    intl.formatMessage(commonMessages.notAvailable),
                )}
              />
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

export default ExperienceCard;
