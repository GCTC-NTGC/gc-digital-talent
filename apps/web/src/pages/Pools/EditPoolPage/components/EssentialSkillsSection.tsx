import type { JSX } from "react";
import { useIntl } from "react-intl";
import AcademicCapIcon from "@heroicons/react/24/outline/AcademicCapIcon";

import { ToggleSection } from "@gc-digital-talent/ui";
import type { SkillLevel, FragmentType } from "@gc-digital-talent/graphql";
import {
  PoolSkillType,
  PoolStatus,
  getFragment,
} from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import { hasEmptyRequiredFields } from "~/validators/process/essentialSkills";
import useToggleSectionInfo from "~/hooks/useToggleSectionInfo";
import type { EditPoolSectionMetadata } from "~/types/pool";

import SkillTable, { type SkillTableSkill_Fragment } from "./SkillTable";
import type { PoolSkillMutationsType } from "../types";
import { EditPoolSkills_Fragment } from "../fragments";

interface EssentialSkillsSectionProps {
  poolQuery: FragmentType<typeof EditPoolSkills_Fragment>;
  sectionMetadata: EditPoolSectionMetadata;
  skillsQuery: FragmentType<typeof SkillTableSkill_Fragment>[];
  poolSkillMutations: PoolSkillMutationsType;
}

const EssentialSkillsSection = ({
  poolQuery,
  skillsQuery,
  sectionMetadata,
  poolSkillMutations,
}: EssentialSkillsSectionProps): JSX.Element => {
  const intl = useIntl();
  const pool = getFragment(EditPoolSkills_Fragment, poolQuery);
  const emptyRequired = hasEmptyRequiredFields(pool);
  const { icon } = useToggleSectionInfo({
    isNull: emptyRequired,
    emptyRequired,
    fallbackIcon: AcademicCapIcon,
  });

  const essentialPoolSkills = unpackMaybes(pool.poolSkills).filter(
    (poolSkill) => poolSkill.type?.value === PoolSkillType.Essential,
  );

  const handleCreate = async (
    skillSelected: string,
    skillLevel: SkillLevel,
  ) => {
    await poolSkillMutations.create({
      poolId: pool.id,
      skillId: skillSelected,
      type: PoolSkillType.Essential,
      requiredLevel: skillLevel,
    });
  };

  const handleUpdate = async (
    poolSkillSelected: string,
    skillLevel: SkillLevel,
  ) => {
    await poolSkillMutations.update(poolSkillSelected, {
      requiredLevel: skillLevel,
    });
  };

  const handleRemove = async (poolSkillSelected: string) => {
    await poolSkillMutations.delete(poolSkillSelected);
  };

  // disabled unless status is draft
  const formDisabled = pool.status?.value !== PoolStatus.Draft;

  const subtitle = intl.formatMessage({
    defaultMessage:
      "Select the skills that you're looking for in applicants. Skills selected here are required for an applicant to be considered for the role. To increase the diversity of applications, please try to keep the selected number of skills to a minimum.",
    id: "7gTBjD",
    description: "Describes selecting essentials skills for a process.",
  });

  return (
    <section>
      <ToggleSection.Header
        icon={icon.icon}
        color={icon.color}
        level="h3"
        size="h4"
        className="font-bold"
      >
        {sectionMetadata.title}
      </ToggleSection.Header>
      <p className="my-6">{subtitle}</p>
      <SkillTable
        caption={sectionMetadata.title}
        poolSkillsQuery={essentialPoolSkills}
        allSkillsQuery={skillsQuery}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        onRemove={handleRemove}
        disableAdd={formDisabled}
        nullMessage={{
          title: intl.formatMessage({
            defaultMessage: "You haven't added any essential skills yet.",
            id: "V0U95l",
            description: "Null message title for essential skills table.",
          }),
          description: intl.formatMessage({
            defaultMessage: `Use the "Add skill" button to get started.`,
            id: "VaToft",
            description: "Null message description for essential skills table.",
          }),
        }}
      />
    </section>
  );
};

export default EssentialSkillsSection;
