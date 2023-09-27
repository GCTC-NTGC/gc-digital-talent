import * as React from "react";
import { useIntl } from "react-intl";
import AcademicCapIcon from "@heroicons/react/24/outline/AcademicCapIcon";

import { ToggleSection } from "@gc-digital-talent/ui";

import { PoolStatus, Skill, UpdatePoolInput } from "~/api/generated";
import { hasEmptyRequiredFields } from "~/validators/process/essentialSkills";
import useToggleSectionInfo from "~/hooks/useToggleSectionInfo";

import SkillTable from "./SkillTable";
import { SectionProps } from "../types";

export type AssetSkillsSubmitData = Pick<UpdatePoolInput, "nonessentialSkills">;
type AssetSkillsSectionProps = SectionProps<AssetSkillsSubmitData> & {
  skills: Array<Skill>;
};

const AssetSkillsSection = ({
  pool,
  skills,
  sectionMetadata,
  onSave,
}: AssetSkillsSectionProps): JSX.Element => {
  const intl = useIntl();
  const emptyRequired = hasEmptyRequiredFields(pool);
  const { icon } = useToggleSectionInfo({
    isNull: emptyRequired,
    emptyRequired,
    fallbackIcon: AcademicCapIcon,
  });
  const defaultSkills = pool.nonessentialSkills ? pool.nonessentialSkills : [];

  const handleSave = async (ids: string[]) => {
    onSave({
      nonessentialSkills: {
        sync: ids,
      },
    });
  };

  // disabled unless status is draft
  const formDisabled = pool.status !== PoolStatus.Draft;

  const subtitle = intl.formatMessage({
    defaultMessage:
      "Select skills that will improve the chances of quality matches with managers. These can typically be learned on the job and are not necessary to be accepted into the pool.",
    id: "AdRTuc",
    description: "Describes selecting asset skills for a process.",
  });

  return (
    <>
      <ToggleSection.Header
        Icon={icon.icon}
        color={icon.color}
        level="h3"
        size="h5"
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
      />
    </>
  );
};

export default AssetSkillsSection;
