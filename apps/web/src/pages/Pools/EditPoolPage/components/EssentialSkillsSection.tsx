import { JSX } from "react";
import { useIntl } from "react-intl";
import AcademicCapIcon from "@heroicons/react/24/outline/AcademicCapIcon";

import { ToggleSection } from "@gc-digital-talent/ui";
import {
  PoolSkillType,
  SkillCategory,
  SkillLevel,
  PoolStatus,
  Skill,
  FragmentType,
  getFragment,
} from "@gc-digital-talent/graphql";
import { notEmpty } from "@gc-digital-talent/helpers";

import { hasEmptyRequiredFields } from "~/validators/process/essentialSkills";
import useToggleSectionInfo from "~/hooks/useToggleSectionInfo";
import { EditPoolSectionMetadata } from "~/types/pool";

import SkillTable from "./SkillTable";
import { PoolSkillMutationsType } from "../types";
import { EditPoolSkills_Fragment } from "../fragments";

interface EssentialSkillsSectionProps {
  poolQuery: FragmentType<typeof EditPoolSkills_Fragment>;
  sectionMetadata: EditPoolSectionMetadata;
  skills: Skill[];
  poolSkillMutations: PoolSkillMutationsType;
}

const EssentialSkillsSection = ({
  poolQuery,
  skills,
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

  const poolSkills = pool.poolSkills ?? [];
  const essentialPoolSkills = poolSkills
    .filter(notEmpty)
    .filter(
      (poolSkill) =>
        poolSkill.type?.value === PoolSkillType.Essential && poolSkill.skill,
    );

  const essentialSkills: (Skill & {
    poolSkillId: string;
    requiredLevel?: SkillLevel;
  })[] = essentialPoolSkills.map((poolSkill) => {
    return {
      // Note: This is ugly and should be cleaned up
      category: poolSkill.skill?.category ?? {
        value: SkillCategory.Technical,
        label: { en: "", fr: "" },
      },
      description: poolSkill.skill?.description,
      id: poolSkill.skill?.id ?? poolSkill.id,
      key: poolSkill.skill?.key ?? "",
      name: poolSkill.skill?.name ?? {},
      poolSkillId: poolSkill.id,
      requiredLevel: poolSkill.requiredLevel ?? undefined,
    };
  });

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
        data={essentialSkills}
        allSkills={skills}
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
