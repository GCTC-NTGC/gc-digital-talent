import * as React from "react";
import { useIntl } from "react-intl";
import AcademicCapIcon from "@heroicons/react/24/outline/AcademicCapIcon";

import { ToggleSection } from "@gc-digital-talent/ui";

import { PoolStatus, Skill, UpdatePoolInput } from "~/api/generated";
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
  const { icon } = useToggleSectionInfo({
    isNull: false,
    emptyRequired: false,
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
            defaultMessage: "You haven't added any asset skills yet.",
            id: "DJL4F5",
            description: "Null message title for asset skills table.",
          }),
          description: intl.formatMessage({
            defaultMessage: `Use the "Add a new skill" button to get started.`,
            id: "Wd9+xg",
            description: "Null message description for asset skills table.",
          }),
        }}
      />
    </section>
  );
};

export default AssetSkillsSection;
