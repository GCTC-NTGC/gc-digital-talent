import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useIntl } from "react-intl";

import type { HeadingLevel } from "../Heading";
import Chip, { Chips } from "../Chip";
import Separator from "../Separator";
import ScrollArea from "../ScrollArea";
import { Input } from "../form";
import MultiSelectFieldV2 from "../form/MultiSelect/MultiSelectFieldV2";
import SkillBlock from "./SkillBlock";

import { Scalars, Skill, SkillCategory } from "../../api/generated";
import { getLocalizedName } from "../../helpers/localize";
import { notEmpty } from "../../helpers/util";
import {
  filterSkillsByNameOrKeywords,
  invertSkillSkillFamilyTree,
} from "../../helpers/skillUtils";

type Skills = Array<Skill>;

interface FormValues {
  query: string;
  skillFamilies: Array<Scalars["ID"]>;
}

const defaultValues: FormValues = {
  query: "",
  skillFamilies: [],
};
export interface SkillPickerProps {
  skills: Skills;
  selectedSkills?: Skills;
  onUpdateSelectedSkills?: (newSkills: Skills) => void;
  headingLevel?: HeadingLevel;
}

const SkillPicker = ({
  skills,
  onUpdateSelectedSkills,
  selectedSkills = [],
  headingLevel = "h4",
}: SkillPickerProps) => {
  const intl = useIntl();
  const Heading = headingLevel;
  const [validData, setValidData] = React.useState<FormValues>(defaultValues);
  const methods = useForm<FormValues>({
    mode: "onChange",
    defaultValues,
  });
  const { watch } = methods;

  React.useEffect(() => {
    const subscription = watch(({ query, skillFamilies }) => {
      setValidData({
        query: query ?? "",
        skillFamilies: skillFamilies ? skillFamilies?.filter(notEmpty) : [],
      });
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  const handleSkillUpdate = React.useCallback(
    (newSkills: Skills) => {
      if (onUpdateSelectedSkills) {
        onUpdateSelectedSkills(newSkills);
      }
    },
    [onUpdateSelectedSkills],
  );

  const allSkillFamilies = React.useMemo(
    () => invertSkillSkillFamilyTree(skills),
    [skills],
  );

  const filteredSkills = React.useMemo(() => {
    return filterSkillsByNameOrKeywords(skills, validData.query, intl).filter(
      (skill) => {
        if (validData.skillFamilies.length) {
          return skill?.families?.some((family) =>
            validData.skillFamilies.includes(family.id),
          );
        }

        return true;
      },
    );
  }, [validData, skills, intl]);

  const handleAddSkill = (id: Skill["id"]) => {
    const skillToAdd = skills.find((skill) => skill.id === id);
    if (skillToAdd) {
      const newSkills = [...selectedSkills, skillToAdd];
      handleSkillUpdate(newSkills);
    }
  };

  const handleRemoveSkill = (id: Skill["id"]) => {
    const newSkills = selectedSkills.filter((selected) => selected.id !== id);
    handleSkillUpdate(newSkills);
  };

  const skillFamilyOptions = React.useMemo(() => {
    return [
      {
        label: intl.formatMessage({
          defaultMessage: "Technical skills",
          id: "kxseH4",
          description: "Tab name for a list of technical skills",
        }),
        options: allSkillFamilies
          .filter((sf) => sf.category === SkillCategory.Technical)
          .map((family) => ({
            value: family.id,
            label: getLocalizedName(family.name, intl),
          })),
      },
      {
        label: intl.formatMessage({
          defaultMessage: "Behavioural skills",
          id: "LjkK5G",
          description: "Tab name for a list of behavioural skills",
        }),
        options: allSkillFamilies
          .filter((sf) => sf.category === SkillCategory.Behavioural)
          .map((family) => ({
            value: family.id,
            label: getLocalizedName(family.name, intl),
          })),
      },
    ];
  }, [allSkillFamilies, intl]);

  return (
    <>
      <FormProvider {...methods}>
        <Input
          id="query"
          name="query"
          type="text"
          label={intl.formatMessage({
            defaultMessage: "Search skills by keyword",
            id: "ARqO1j",
            description: "Label for the skills search bar.",
          })}
          placeholder={intl.formatMessage({
            defaultMessage: "e.g. Python, JavaScript, etc.",
            id: "PF4ya+",
            description: "Placeholder for the skills search bar.",
          })}
        />
        <MultiSelectFieldV2
          id="skillFamilies"
          name="skillFamilies"
          label={intl.formatMessage({
            defaultMessage: "Filter skills by type",
            description: "Label for the skills families dropdown",
            id: "SwsGvU",
          })}
          options={skillFamilyOptions}
        />
      </FormProvider>
      <p
        aria-live="polite"
        aria-atomic="true"
        data-h2-font-size="base(h6)"
        data-h2-font-weight="base(700)"
        data-h2-margin="base(x.75, 0, x.5, 0)"
      >
        {intl.formatMessage(
          {
            defaultMessage: "Found <primary>{skillCount}</primary> skills.",
            id: "2Ckihd",
            description: "The number of skills found within the skill picker.",
          },
          {
            skillCount: filteredSkills.length,
          },
        )}
      </p>
      <ScrollArea.Root
        data-h2-width="base(100%)"
        data-h2-height="base(320px)"
        data-h2-max-height="base(50vh)"
      >
        <ScrollArea.Viewport data-h2-background-color="base(white)">
          <div data-h2-padding="base(x.5, x1, x.5, x.5)">
            {filteredSkills.length > 0 ? (
              filteredSkills.map((skill, index: number) => (
                <React.Fragment key={skill.id}>
                  <SkillBlock
                    skill={skill}
                    isAdded={
                      !!selectedSkills.find(
                        (selected) => selected.id === skill.id,
                      )
                    }
                    onAddSkill={handleAddSkill}
                    onRemoveSkill={handleRemoveSkill}
                  />
                  {index + 1 !== filteredSkills.length ? (
                    <Separator
                      color="black"
                      data-h2-margin="base(x.5, 0)"
                      orientation="horizontal"
                    />
                  ) : null}
                </React.Fragment>
              ))
            ) : (
              <p
                data-h2-align-self="base(center)"
                data-h2-font-size="base(h4)"
                data-h2-margin="base(x2, 0)"
                data-h2-text-align="base(center)"
                data-h2-font-style="base(italic)"
                data-h2-color="base(dt-gray)"
              >
                {intl.formatMessage({
                  defaultMessage: "No skills found.",
                  id: "9CkDfr",
                  description:
                    "Message displayed when no skills were found in skill picker search",
                })}
              </p>
            )}
          </div>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar orientation="vertical">
          <ScrollArea.Thumb />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
      {selectedSkills.length > 0 ? (
        <>
          <Heading
            data-h2-font-size="base(copy, 1)"
            data-h2-font-weight="base(700)"
            data-h2-margin="base(x.75, 0, x.5, 0)"
          >
            {intl.formatMessage({
              defaultMessage: "Selected skills",
              id: "l7Hif/",
              description: "Section header for a list of skills selected",
            })}
          </Heading>
          <Chips>
            {selectedSkills.map((skill) => (
              <Chip
                key={skill.id}
                label={getLocalizedName(skill.name, intl)}
                color="primary"
                mode="outline"
                onDismiss={() => handleRemoveSkill(skill.id)}
              />
            ))}
          </Chips>
        </>
      ) : null}
    </>
  );
};

export default SkillPicker;
