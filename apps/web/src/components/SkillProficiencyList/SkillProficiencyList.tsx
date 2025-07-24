import { useIntl } from "react-intl";
import PlusCircleIcon from "@heroicons/react/24/solid/PlusCircleIcon";

import {
  FragmentType,
  getFragment,
  graphql,
  SkillCategory,
  SkillLevel,
} from "@gc-digital-talent/graphql";
import { Accordion, Button, Well } from "@gc-digital-talent/ui";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import SkillProficiencyAccordionItem from "./SkillProficiencyAccordionItem";
import SkillBrowserDialog from "../SkillBrowser/SkillBrowserDialog";

export const Options_Fragment = graphql(/* GraphQL */ `
  fragment SkillProficiencyListOptions on Query {
    skills {
      id
      key
      name {
        en
        fr
        localized
      }
      description {
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
      families {
        id
        key
        name {
          en
          fr
        }
      }
    }
  }
`);

export interface ListItem {
  skillId: string;
  skillName: string | null;
  skillLevel: SkillLevel | null;
  skillDefinition: string | null;
  skillCategory: SkillCategory | null;
}

export interface SkillProficiencyListProps {
  optionsQuery: FragmentType<typeof Options_Fragment>;
  filterOptionsSkillCategory: SkillCategory | null | undefined;
  listItems: (ListItem & { id: string })[]; // react hook form adds the ID field
  onEdit: ({
    index,
    skillId,
    skillLevel,
  }: {
    index: number;
    skillId: string | null;
    skillLevel: SkillLevel | null;
  }) => Promise<void>;
  onRemove: ({ index }: { index: number }) => Promise<void>;
  onAdd: ({
    skillId,
    skillLevel,
  }: {
    skillId: string | null;
    skillLevel: SkillLevel | null;
  }) => Promise<void>;
  noToast?: boolean;
  withLevel?: boolean;
}

const SkillProficiencyList = ({
  optionsQuery,
  filterOptionsSkillCategory,
  listItems,
  onEdit,
  onRemove,
  onAdd,
  noToast = false,
  withLevel = false,
}: SkillProficiencyListProps) => {
  const intl = useIntl();

  const optionsData = getFragment(Options_Fragment, optionsQuery);
  const allSkills = unpackMaybes(optionsData.skills);
  let availableSkills: typeof allSkills;
  if (filterOptionsSkillCategory) {
    availableSkills = allSkills.filter(
      (s) => s.category.value === filterOptionsSkillCategory,
    );
  } else {
    availableSkills = allSkills;
  }

  return (
    <div className="flex flex-col gap-6">
      <>
        {listItems.length ? (
          /* we have items - show the accordion */
          <Accordion.Root type="multiple" mode="card">
            {listItems.map((item, index) => (
              <SkillProficiencyAccordionItem
                key={item.id}
                skillId={item.skillId}
                skillName={item.skillName}
                skillLevel={item.skillLevel}
                skillDefinition={item.skillDefinition}
                skillCategory={item.skillCategory}
                onEdit={
                  onEdit
                    ? async ({ skillId, skillLevel }) =>
                        await onEdit({
                          index,
                          skillId: skillId,
                          skillLevel: skillLevel,
                        })
                    : null
                }
                onRemove={onRemove ? () => onRemove({ index }) : null}
                availableSkills={availableSkills}
                withLevel={withLevel}
              />
            ))}
          </Accordion.Root>
        ) : (
          /* no items - show the well */
          <Well className="text-center">
            {intl.formatMessage({
              defaultMessage: "No skills have been added yet.",
              id: "Ak7f1p",
              description: "Null state message when there are no skills",
            })}
          </Well>
        )}
      </>

      <SkillBrowserDialog
        context={
          withLevel
            ? "skill-proficiency-list-with-level"
            : "skill-proficiency-list-without-level"
        }
        skills={availableSkills}
        onSave={async (value) => {
          await onAdd({
            skillId: value.skill ?? null,
            skillLevel: value.skillLevel ?? null,
          });
        }}
        customTrigger={
          <Button icon={PlusCircleIcon} mode="placeholder" type="button">
            {intl.formatMessage({
              defaultMessage: "Add a skill",
              id: "+ZREDW",
              description: "Button text to add a skill",
            })}
          </Button>
        }
        noToast={noToast}
      />
    </div>
  );
};

export default SkillProficiencyList;
