import type { ReactNode } from "react";
import { useIntl } from "react-intl";

import { Button, Dialog, Link, Separator } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";
import type { FragmentType } from "@gc-digital-talent/graphql";
import { getFragment, graphql } from "@gc-digital-talent/graphql";

import { useExperienceInfo } from "~/utils/experienceUtils";

import type { UserSkillLevel } from "../ExperienceCard/SkillsContent";
import SkillsContent from "../ExperienceCard/SkillsContent";

export const ExperienceDialog_Fragment = graphql(/* GraphQL */ `
  fragment ExperienceDialog on Experience {
    id
    skills {
      id
      name {
        localized
      }
      category {
        value
      }
      experienceSkillRecord {
        details
      }
    }
    ... on AwardExperience {
      title
    }
    ... on CommunityExperience {
      title
      organization
    }
    ... on EducationExperience {
      educationType {
        value
        label {
          en
          fr
        }
      }
      degreeType {
        value
        label {
          en
          fr
        }
      }
      fellowshipType {
        value
        label {
          en
          fr
        }
      }
      otherEducationType
      otherFellowshipType
      areaOfStudy
      institution
      licenseOrAccreditation
      certification
    }
    ... on PersonalExperience {
      title
    }
    ... on WorkExperience {
      role
      organization
      employmentCategory {
        value
        label {
          en
          fr
        }
      }
      department {
        id
        name {
          en
          fr
        }
      }
      cafForce {
        value
        label {
          en
          fr
        }
      }
    }
  }
`);

export interface ExperienceDialogBaseProps {
  trigger: ReactNode;
  editPath?: string;
  showEdit?: boolean;
  userSkills?: UserSkillLevel[];
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface ExperienceDialogProps extends ExperienceDialogBaseProps {
  experienceQuery: FragmentType<typeof ExperienceDialog_Fragment>;
  children: ReactNode;
}

const ExperienceDialog = ({
  experienceQuery,
  trigger,
  editPath: editPathProp,
  showEdit = true,
  userSkills,
  defaultOpen,
  open,
  onOpenChange,
  children,
}: ExperienceDialogProps) => {
  const intl = useIntl();
  const experience = getFragment(ExperienceDialog_Fragment, experienceQuery);
  const { titleHtml, editPath } = useExperienceInfo(experience);
  const editHref = editPathProp ?? editPath;

  return (
    <Dialog.Root
      defaultOpen={defaultOpen}
      open={open}
      onOpenChange={onOpenChange}
    >
      <Dialog.Trigger>{trigger}</Dialog.Trigger>
      <Dialog.Content hasSubtitle>
        <Dialog.Header
          subtitle={intl.formatMessage({
            defaultMessage:
              "View this experience's details or edit its information.",
            id: "Dr9vKe",
            description: "Subtitle for the dialog displaying an experience",
          })}
        >
          {titleHtml}
        </Dialog.Header>
        <Dialog.Body>
          {children}
          <Separator space="sm" decorative />
          <SkillsContent
            skills={experience.skills}
            userSkills={userSkills}
            headingRank="h3"
          />
          <Dialog.Footer>
            {showEdit && editHref && (
              <Link href={editHref} mode="solid" color="primary">
                {intl.formatMessage({
                  defaultMessage: "Edit experience",
                  id: "zfX1QQ",
                  description:
                    "Link text to edit the experience shown in the dialog",
                })}
              </Link>
            )}
            <Dialog.Close>
              <Button color="warning" mode="inline">
                {intl.formatMessage(commonMessages.cancel)}
              </Button>
            </Dialog.Close>
          </Dialog.Footer>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ExperienceDialog;
