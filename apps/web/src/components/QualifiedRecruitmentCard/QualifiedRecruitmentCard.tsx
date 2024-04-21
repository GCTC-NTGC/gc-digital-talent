import React from "react";
import { useIntl } from "react-intl";
import ChevronRightIcon from "@heroicons/react/20/solid/ChevronRightIcon";
import GlobeAmericasIcon from "@heroicons/react/20/solid/GlobeAmericasIcon";
import CpuChipIcon from "@heroicons/react/20/solid/CpuChipIcon";
import CheckIcon from "@heroicons/react/20/solid/CheckIcon";

import {
  Button,
  Collapsible,
  Heading,
  HeadingRank,
  Chip,
  Separator,
  incrementHeadingRank,
} from "@gc-digital-talent/ui";
import { notEmpty } from "@gc-digital-talent/helpers";
import { getLocalizedName, getSkillCategory } from "@gc-digital-talent/i18n";
import { SkillCategory } from "@gc-digital-talent/graphql";

import { categorizeSkill } from "~/utils/skillUtils";
import { getRecruitmentType } from "~/utils/poolCandidate";
import { Application } from "~/utils/applicationUtils";

import RecruitmentAvailabilityDialog from "../RecruitmentAvailabilityDialog/RecruitmentAvailabilityDialog";
import { getQualifiedRecruitmentInfo, joinDepartments } from "./utils";

export interface QualifiedRecruitmentCardProps {
  candidate: Application;
  headingLevel?: HeadingRank;
}

const QualifiedRecruitmentCard = ({
  candidate,
  headingLevel = "h2",
}: QualifiedRecruitmentCardProps) => {
  const intl = useIntl();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [linkCopied, setLinkCopied] = React.useState<boolean>(false);
  const contentHeadingLevel = incrementHeadingRank(headingLevel);
  const {
    title,
    statusChip,
    availability: { icon: AvailabilityIcon, ...availability },
  } = getQualifiedRecruitmentInfo(candidate, intl);

  const departments = joinDepartments(
    candidate.pool?.team?.departments ?? [],
    intl,
  );

  // NOTE: Until we store assessed skills, we will just be displayed all essential skills
  const categorizedSkills = categorizeSkill(
    candidate.pool.essentialSkills?.filter(notEmpty) ?? [],
  );

  /** Reset link copied after 3 seconds */
  React.useEffect(() => {
    if (linkCopied) {
      setTimeout(() => {
        setLinkCopied(false);
      }, 3000);
    }
  }, [linkCopied, setLinkCopied]);

  const ChipIcon = statusChip.icon;

  return (
    <div
      data-h2-border-left="base(x.5 solid secondary)"
      data-h2-background-color="base(foreground)"
      className="rounded-r p-6 pb-3 shadow-xl"
    >
      <div className="flex items-center justify-between gap-x-6">
        <Heading level={headingLevel} size="h6" data-h2-margin="base(0)">
          {title.html}
        </Heading>
        <Chip color={statusChip.color} icon={ChipIcon}>
          {statusChip.text}
        </Chip>
      </div>
      <p data-h2-color="base(secondary.darker)" className="mb-6 mt-1.5">
        {getRecruitmentType(candidate.pool.publishingGroup, intl)}
      </p>
      <Collapsible.Root open={isOpen} onOpenChange={setIsOpen}>
        <Collapsible.Trigger asChild>
          <Button
            type="button"
            mode="inline"
            color="black"
            className="group/qr-card"
            aria-label={
              isOpen
                ? intl
                    .formatMessage(
                      {
                        defaultMessage: "Hide {title} skill assessments",
                        id: "eWLKRt",
                        description:
                          "Button text to hide a specific qualified recruitment cards's skill assessments",
                      },
                      { title: title.label },
                    )
                    .toString()
                : intl
                    .formatMessage(
                      {
                        defaultMessage: "Show {title} skill assessments",
                        id: "x2/qvf",
                        description:
                          "Button text to show a specific qualified recruitment cards's skill assessments",
                      },
                      { title: title.label },
                    )
                    .toString()
            }
          >
            <span className="flex items-center gap-x-1.5">
              <ChevronRightIcon className="h-6 w-6 group-data-[state=open]/qr-card:rotate-90" />
              <span>
                {isOpen
                  ? intl.formatMessage({
                      defaultMessage:
                        "Hide the skill assessments of this process",
                      id: "vMcen8",
                      description:
                        "Button text to hide a miscellaneous qualified recruitment's skill assessments",
                    })
                  : intl.formatMessage({
                      defaultMessage:
                        "Show the skill assessments of this process",
                      id: "nSwruS",
                      description:
                        "Button text to show a miscellaneous qualified recruitment's skill assessments",
                    })}
              </span>
            </span>
          </Button>
        </Collapsible.Trigger>
        <Collapsible.Content className="pl-9">
          <Heading
            level={contentHeadingLevel}
            size="h6"
            data-h2-font-size="base(copy)"
            className="my-6"
          >
            {intl.formatMessage(
              {
                defaultMessage:
                  "The following skills were assessed by {departments}",
                id: "VwVXYb",
                description:
                  "Lead in text describing the skills assessed for a qualified recruitment",
              },
              {
                departments,
              },
            )}
          </Heading>
          {categorizedSkills[SkillCategory.Behavioural]?.length ? (
            <>
              <Heading
                level={incrementHeadingRank(contentHeadingLevel)}
                Icon={GlobeAmericasIcon}
                data-h2-margin="base(x1, 0, x.5, 0)"
                data-h2-font-size="base(copy)"
                className="font-bold"
                color="secondary"
              >
                {intl.formatMessage(
                  getSkillCategory(SkillCategory.Behavioural),
                )}
              </Heading>
              <ul className="grid gap-x-3 gap-y-1 sm:grid-cols-2">
                {categorizedSkills[SkillCategory.Behavioural]?.map((skill) => (
                  <li key={skill.id}>{getLocalizedName(skill.name, intl)}</li>
                ))}
              </ul>
            </>
          ) : null}
          {categorizedSkills[SkillCategory.Technical]?.length ? (
            <>
              <Heading
                level={incrementHeadingRank(contentHeadingLevel)}
                Icon={CpuChipIcon}
                data-h2-margin="base(x1, 0, x.5, 0)"
                data-h2-font-size="base(copy)"
                className="font-bold"
                color="secondary"
              >
                {intl.formatMessage(getSkillCategory(SkillCategory.Technical))}
              </Heading>
              <ul className="grid gap-x-3 gap-y-1 sm:grid-cols-2">
                {categorizedSkills[SkillCategory.Technical]?.map((skill) => (
                  <li key={skill.id}>{getLocalizedName(skill.name, intl)}</li>
                ))}
              </ul>
            </>
          ) : null}
        </Collapsible.Content>
      </Collapsible.Root>
      <Separator
        data-h2-width="base(calc(100% + x2))"
        data-h2-margin="base(x1 -x1 x.5 -x1)"
      />
      <div className="flex flex-col items-center justify-between gap-y-3 text-center sm:flex-row sm:gap-x-3 sm:gap-y-0 sm:text-inherit">
        <div className="flex flex-col items-center justify-between gap-x-1.5 gap-y-3 text-center sm:flex-row sm:text-inherit">
          {availability.text && (
            <p data-h2-font-size="base(caption)">
              {AvailabilityIcon ? (
                <AvailabilityIcon
                  className="mr-1.5 inline-block h-auto w-3"
                  {...availability.color}
                />
              ) : null}
              <span>{availability.text}</span>
            </p>
          )}
          {availability.showDialog && (
            <div className="flex-shrink-0">
              <RecruitmentAvailabilityDialog candidate={candidate} />
            </div>
          )}
        </div>
        <div className="flex-shrink-0">
          <Button
            mode="inline"
            color="black"
            fontSize="caption"
            icon={linkCopied ? CheckIcon : undefined}
            onClick={() => {
              navigator.clipboard.writeText(candidate.id);
              setLinkCopied(true);
            }}
            aria-label={intl.formatMessage(
              {
                defaultMessage: "Copy {title} ID to clipboard",
                id: "leFf/M",
                description:
                  "Button text to copy a specific qualified recruitment's ID",
              },
              {
                title: title.label,
              },
            )}
          >
            {linkCopied
              ? intl.formatMessage({
                  defaultMessage: "Process ID copied",
                  id: "QNmxIN",
                  description:
                    "Button text to indicate that a specific qualified recruitment's ID has been copied",
                })
              : intl.formatMessage({
                  defaultMessage: "Copy process ID",
                  id: "IW+wmC",
                  description:
                    "Button text to copy a specific qualified recruitment's ID",
                })}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QualifiedRecruitmentCard;
