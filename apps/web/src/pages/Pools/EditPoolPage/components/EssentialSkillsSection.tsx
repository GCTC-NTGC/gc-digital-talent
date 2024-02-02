import * as React from "react";
import { useIntl } from "react-intl";
import AcademicCapIcon from "@heroicons/react/24/outline/AcademicCapIcon";

import { ToggleSection } from "@gc-digital-talent/ui";

import { PoolStatus, Skill, UpdatePoolInput } from "~/api/generated";
import { hasEmptyRequiredFields } from "~/validators/process/essentialSkills";
import useToggleSectionInfo from "~/hooks/useToggleSectionInfo";

import SkillTable from "./SkillTable";
import { SectionProps } from "../types";

export type EssentialSkillsSubmitData = Pick<
  UpdatePoolInput,
  "essentialSkills"
>;
type EssentialSkillsSectionProps = SectionProps<EssentialSkillsSubmitData> & {
  skills: Array<Skill>;
};

const EssentialSkillsSection = ({
  pool,
  skills,
  sectionMetadata,
  onSave,
}: EssentialSkillsSectionProps): JSX.Element => {
  const intl = useIntl();
  const emptyRequired = hasEmptyRequiredFields(pool);
  const { icon } = useToggleSectionInfo({
    isNull: emptyRequired,
    emptyRequired,
    fallbackIcon: AcademicCapIcon,
  });
  const defaultSkills = pool.essentialSkills ? pool.essentialSkills : [];

  const handleSave = async (ids: string[]) => {
    onSave({
      essentialSkills: {
        sync: ids,
      },
    });
  };

  // disabled unless status is draft
  const formDisabled = pool.status !== PoolStatus.Draft;

  const subtitle = intl.formatMessage({
    defaultMessage:
      "Select the skills that you are looking for in applicants. Any skill selected here will be required for any applicant to apply. To increase the diversity of applications try to keep the selected number of skills to a minimum.",
    id: "VKvAfu",
    description: "Describes selecting essentials skills for a process.",
  });

  return (
    <section>
      <ToggleSection.Header
        Icon={icon.icon}
        color={icon.color}
        level="h3"
        size="h4"
        data-h2-font-weight="base(bold)"
      >
        {sectionMetadata.title}
      </ToggleSection.Header>
      <p data-h2-margin="base(x1 0)">{subtitle}</p>
      <SkillTable
        caption={sectionMetadata.title}
        data={defaultSkills}
        allSkills={skills}
        onSave={handleSave}
        disableAdd={formDisabled}
        nullMessage={{
          title: intl.formatMessage({
            defaultMessage: "You haven't added any essential skills yet.",
            id: "V0U95l",
            description: "Null message title for essential skills table.",
          }),
          description: intl.formatMessage({
            defaultMessage: `Use the "Add a new skill" button to get started.`,
            id: "uiuMqi",
            description: "Null message description for essential skills table.",
          }),
        }}
      />
    </section>
  );
};

export default EssentialSkillsSection;
