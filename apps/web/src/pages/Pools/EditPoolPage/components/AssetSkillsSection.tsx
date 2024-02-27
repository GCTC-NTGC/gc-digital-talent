import * as React from "react";
import { useIntl } from "react-intl";
import AcademicCapIcon from "@heroicons/react/24/outline/AcademicCapIcon";

import { ToggleSection } from "@gc-digital-talent/ui";
import { notEmpty } from "@gc-digital-talent/helpers";
import {
  PoolSkillType,
  SkillCategory,
  SkillLevel,
  Pool,
  PoolStatus,
  Skill,
} from "@gc-digital-talent/graphql";

import useToggleSectionInfo from "~/hooks/useToggleSectionInfo";
import { EditPoolSectionMetadata } from "~/types/pool";

import SkillTable from "./SkillTable";
import { PoolSkillMutationsType } from "../types";

type AssetSkillsSectionProps = {
  pool: Pool;
  sectionMetadata: EditPoolSectionMetadata;
  skills: Array<Skill>;
  poolSkillMutations: PoolSkillMutationsType;
};

const AssetSkillsSection = ({
  pool,
  skills,
  sectionMetadata,
  poolSkillMutations,
}: AssetSkillsSectionProps): JSX.Element => {
  const intl = useIntl();
  const { icon } = useToggleSectionInfo({
    isNull: false,
    emptyRequired: false,
    fallbackIcon: AcademicCapIcon,
  });

  const poolSkills = pool.poolSkills ?? [];
  const nonessentialPoolSkills = poolSkills
    .filter(notEmpty)
    .filter(
      (poolSkill) =>
        poolSkill.type === PoolSkillType.Nonessential &&
        poolSkill.skill &&
        poolSkill.skill.category &&
        poolSkill.skill.id,
    );

  const nonessentialSkills: (Skill & {
    poolSkillId: string;
    requiredLevel?: SkillLevel;
  })[] = nonessentialPoolSkills.map((poolSkill) => {
    return {
      category: poolSkill.skill?.category ?? SkillCategory.Technical,
      description: poolSkill.skill?.description,
      id: poolSkill.skill?.id ?? poolSkill.id,
      key: poolSkill.skill?.key,
      name: poolSkill.skill?.name ?? {},
      poolSkillId: poolSkill.id,
      requiredLevel: poolSkill.requiredLevel ?? undefined,
    };
  });

  const handleCreate = async (
    skillSelected: string,
    skillLevel: SkillLevel,
  ) => {
    poolSkillMutations.create(pool.id, skillSelected, {
      type: PoolSkillType.Nonessential,
      requiredLevel: skillLevel,
    });
  };

  const handleUpdate = async (
    poolSkillSelected: string,
    skillLevel: SkillLevel,
  ) => {
    poolSkillMutations.update(poolSkillSelected, {
      requiredLevel: skillLevel,
    });
  };

  const handleRemove = async (poolSkillSelected: string) => {
    poolSkillMutations.delete(poolSkillSelected);
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
        data={nonessentialSkills}
        allSkills={skills}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        onRemove={handleRemove}
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
