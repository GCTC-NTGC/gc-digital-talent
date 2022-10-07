import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useIntl } from "react-intl";

import ScrollArea from "../../ScrollArea";
import { getLocalizedName } from "../../../helpers/localize";
import { notEmpty } from "../../../helpers/util";
import { Input } from "../../form";
import { SkillBlock } from "../SkillResults/SkillResults";
import MultiSelectFieldV2 from "../../form/MultiSelect/MultiSelectFieldV2";
import { Scalars, Skill } from "../../../api/generated";

import {
  filterSkillsByNameOrKeywords,
  invertSkillSkillFamilyTree,
} from "../../../helpers/skillUtils";

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
  defaultSelectedSkills?: Skills;
  onUpdateSelectedSkills?: (newSkills: Skills) => void;
}

const SkillPicker = ({
  skills,
  onUpdateSelectedSkills,
  defaultSelectedSkills = [],
}: SkillPickerProps) => {
  const intl = useIntl();
  const [selectedSkills, setSelectedSkills] = React.useState<Skills>(
    defaultSelectedSkills,
  );
  const [validData, setValidData] = React.useState<FormValues>(defaultValues);
  const methods = useForm<FormValues>({
    mode: "onChange",
    defaultValues,
  });
  const {
    handleSubmit,
    watch,
    formState: { isSubmitting, isValid, isValidating },
  } = methods;

  const onSubmit = React.useCallback((newData: FormValues) => {
    console.log(newData);
  }, []);

  React.useEffect(() => {
    const subscription = watch(({ query, skillFamilies }, args) => {
      if (isValid && !isValidating) {
        setValidData({
          query: query ?? "",
          skillFamilies: skillFamilies ? skillFamilies?.filter(notEmpty) : [],
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, isValid, isValidating, setValidData]);

  React.useEffect(() => {
    if (onUpdateSelectedSkills) {
      onUpdateSelectedSkills(selectedSkills);
    }
  }, [selectedSkills, onUpdateSelectedSkills]);

  const allSkillFamilies = React.useMemo(
    () => invertSkillSkillFamilyTree(skills),
    [skills],
  );

  const filteredSkills = React.useMemo(() => {
    return filterSkillsByNameOrKeywords(skills, validData.query, intl).filter(
      (skill) => {
        if (validData.skillFamilies.length) {
          const toAdd = skill?.families?.some((family) =>
            validData.skillFamilies.includes(family.id),
          );
          console.log(toAdd);
          return toAdd;
        }

        return true;
      },
    );
  }, [validData, skills, intl]);

  const handleAddSkill = (id: Skill["id"]) => {
    const skillToAdd = skills.find((skill) => skill.id === id);
    if (skillToAdd) {
      const newSkills = [...selectedSkills, skillToAdd];
      setSelectedSkills(newSkills);
    }
  };

  const handleRemoveSkill = (id: Skill["id"]) => {
    const newSkills = selectedSkills.filter((selected) => selected.id !== id);
    setSelectedSkills(newSkills);
  };

  /**
   * TO DO: Figure out how to support optgroup in MultiSelect
   */
  // const skillFamilyOptions = React.useMemo(() => {
  //   return [
  //     {
  //       label: intl.formatMessage({
  //         defaultMessage: "Technical skills",
  //         id: "kxseH4",
  //         description: "Tab name for a list of technical skills",
  //       }),
  //       options: allSkillFamilies
  //         .filter((sf) => sf.category === SkillCategory.Technical)
  //         .map((family) => ({
  //           value: family.id,
  //           label: getLocalizedName(family.name, intl),
  //         })),
  //     },
  //     {
  //       label: intl.formatMessage({
  //         defaultMessage: "Behavioural skills",
  //         id: "LjkK5G",
  //         description: "Tab name for a list of behavioural skills",
  //       }),
  //       options: allSkillFamilies
  //         .filter((sf) => sf.category === SkillCategory.Behavioural)
  //         .map((family) => ({
  //           value: family.id,
  //           label: getLocalizedName(family.name, intl),
  //         })),
  //     },
  //   ];
  // }, [allSkillFamilies, intl]);

  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            id="query"
            name="query"
            type="text"
            label={intl.formatMessage({
              defaultMessage: "Search for specific skill...",
              id: "JY6WhU",
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
              defaultMessage: "Skill families",
              description: "Label for the skills families dropdown",
              id: "U6Zf0K",
            })}
            options={allSkillFamilies.map((family) => ({
              value: family.id,
              label: getLocalizedName(family.name, intl),
            }))}
          />
        </form>
      </FormProvider>
      <p
        aria-live="polite"
        data-h2-font-size="base(h4)"
        data-h2-font-weight="base(800)"
        data-h2-margin="base(x1, 0)"
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
          <div data-h2-padding="base(x.5)">
            {filteredSkills.length > 0 ? (
              filteredSkills.map((skill, index) => (
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
                    <hr
                      data-h2-background-color="base(light.dt-gray)"
                      data-h2-border="base(all, 0, solid, transparent)"
                      data-h2-height="base(1px)"
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
    </>
  );
};

export default SkillPicker;
