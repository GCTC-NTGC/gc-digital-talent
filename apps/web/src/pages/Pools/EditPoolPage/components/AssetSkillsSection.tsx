import type { JSX } from "react";
import { useIntl } from "react-intl";
import AcademicCapIcon from "@heroicons/react/24/outline/AcademicCapIcon";

import { ToggleSection } from "@gc-digital-talent/ui";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import type { SkillLevel, FragmentType } from "@gc-digital-talent/graphql";
import {
  PoolSkillType,
  PoolStatus,
  getFragment,
} from "@gc-digital-talent/graphql";

import useToggleSectionInfo from "~/hooks/useToggleSectionInfo";
import type { EditPoolSectionMetadata } from "~/types/pool";
import { hasEmptyRequiredFields } from "~/validators/process/nonEssentialSkills";

import SkillTable, { type SkillTableSkill_Fragment } from "./SkillTable";
import type { PoolSkillMutationsType } from "../types";
import { EditPoolSkills_Fragment } from "../fragments";

interface AssetSkillsSectionProps {
  poolQuery: FragmentType<typeof EditPoolSkills_Fragment>;
  sectionMetadata: EditPoolSectionMetadata;
  skillsQuery: FragmentType<typeof SkillTableSkill_Fragment>[];
  poolSkillMutations: PoolSkillMutationsType;
}

const AssetSkillsSection = ({
  poolQuery,
  skillsQuery,
  sectionMetadata,
  poolSkillMutations,
}: AssetSkillsSectionProps): JSX.Element => {
  const intl = useIntl();
  const pool = getFragment(EditPoolSkills_Fragment, poolQuery);
  const emptyRequired = hasEmptyRequiredFields(pool);
  const { icon } = useToggleSectionInfo({
    isNull: emptyRequired,
    emptyRequired,
    fallbackIcon: AcademicCapIcon,
  });

  const nonessentialPoolSkills = unpackMaybes(pool.poolSkills).filter(
    (poolSkill) => poolSkill.type?.value === PoolSkillType.Nonessential,
  );

  const handleCreate = async (
    skillSelected: string,
    skillLevel: SkillLevel,
  ) => {
    await poolSkillMutations.create({
      poolId: pool.id,
      skillId: skillSelected,
      type: PoolSkillType.Nonessential,
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
      "Select skills that will improve the chances of quality matches with managers. These can typically be learned on the job and are not necessary to be accepted into the pool.",
    id: "AdRTuc",
    description: "Describes selecting asset skills for a process.",
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
        poolSkillsQuery={nonessentialPoolSkills}
        allSkillsQuery={skillsQuery}
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
            defaultMessage: `Use the "Add skill" button to get started.`,
            id: "GMbOaT",
            description: "Null message description for asset skills table.",
          }),
        }}
      />
    </section>
  );
};

export default AssetSkillsSection;
