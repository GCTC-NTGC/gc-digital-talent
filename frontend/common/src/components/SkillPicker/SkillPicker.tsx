import React, { useId } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useIntl } from "react-intl";

import type { HeadingLevel } from "../Heading";
import Chip, { Chips } from "../Chip";
import Separator from "../Separator";
import ScrollArea from "../ScrollArea";
import { InputLabel } from "../inputPartials";
import SkillBlock from "./SkillBlock";

import { Scalars, Skill, SkillFamily } from "../../api/generated";
import { getLocalizedName } from "../../helpers/localize";
import {
  filterSkillsByNameOrKeywords,
  invertSkillSkillFamilyTree,
} from "../../helpers/skillUtils";
import FamilyPicker from "./FamilyPicker";
import { Submit } from "../form";

type Skills = Array<Skill>;

interface FormValues {
  query: string;
  skillFamily: Scalars["ID"];
}

const defaultValues: FormValues = {
  query: "",
  skillFamily: "",
};
export interface SkillPickerProps {
  skills: Skills;
  selectedSkills?: Skills;
  onUpdateSelectedSkills?: (newSkills: Skills) => void;
  headingLevel?: HeadingLevel;
  handleSave?: () => void;
  submitButtonText?: string;
  isSubmitting?: boolean;
  skillType?: string;
}

const SkillPicker = ({
  skills,
  onUpdateSelectedSkills,
  selectedSkills = [],
  headingLevel = "h4",
  handleSave,
  submitButtonText,
  isSubmitting,
  skillType,
}: SkillPickerProps) => {
  const intl = useIntl();
  const Heading = headingLevel;
  const [validData, setValidData] = React.useState<FormValues>(defaultValues);
  const methods = useForm<FormValues>({
    mode: "onChange",
    defaultValues,
  });
  const { watch, handleSubmit } = methods;
  const staticId = useId();
  const skipToHeadingId = `selected-skills-heading-${skillType || staticId}`;
  const queryInputId = `query-${skillType || staticId}`;

  React.useEffect(() => {
    const subscription = watch(({ query, skillFamily }) => {
      setValidData({
        query: query ?? "",
        skillFamily: skillFamily ?? "",
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
        if (validData.skillFamily) {
          return skill?.families?.some(
            (family) => family.id === validData.skillFamily,
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

  const handleCheckFamily = (id: SkillFamily["id"]) => {
    methods.setValue("skillFamily", id);
  };

  return (
    <FormProvider {...methods}>
      <InputLabel
        required={false}
        inputId={queryInputId}
        label={intl.formatMessage({
          defaultMessage: "Search skills by keyword",
          id: "ARqO1j",
          description: "Label for the skills search bar.",
        })}
      />
      <div data-h2-display="base(flex)" data-h2-margin="base(x.25, 0, 0, 0)">
        <FamilyPicker
          onSelectFamily={handleCheckFamily}
          families={allSkillFamilies}
        />
        <input
          id={queryInputId}
          type="text"
          autoComplete="off"
          {...methods.register("query")}
          data-h2-background-color="base(white) base:focus-visible(dt-primary.lighter.10)"
          data-h2-outline="base(none)"
          data-h2-shadow="base:focus-visible(s, dt-primary.30)"
          data-h2-flex-grow="base(1)"
          data-h2-border="base(1px solid dt-primary) base:focus-visible(1px solid dt-primary.dark)"
          data-h2-radius="base(0, input, input, 0)"
          data-h2-padding="base(x.5, x1)"
          placeholder={intl.formatMessage({
            defaultMessage: "e.g. Python, JavaScript, etc.",
            id: "PF4ya+",
            description: "Placeholder for the skills search bar.",
          })}
        />
      </div>

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
      <a
        href={`#${skipToHeadingId}`}
        data-h2-visually-hidden="base(invisible)"
        data-h2-position="base:focus(static)"
        data-h2-location="base:focus(auto)"
        data-h2-height="base:focus(auto)"
        data-h2-width="base:focus(auto)"
      >
        {intl.formatMessage({
          defaultMessage: "Skip list of skills",
          id: "pg1S01",
          description: "Link text to skip the list of add skill links",
        })}
      </a>
      <ScrollArea.Root
        data-h2-width="base(100%)"
        data-h2-height="base(320px)"
        data-h2-max-height="base(50vh)"
        data-h2-shadow="base(s)"
      >
        <ScrollArea.Viewport data-h2-background-color="base(white)">
          <div
            data-h2-padding="base(x.5, x1, x.5, x.5)"
            role={filteredSkills.length > 0 ? "list" : undefined}
          >
            {filteredSkills.length > 0 ? (
              filteredSkills.map((skill, index: number) => (
                <div role="listitem" key={skill.id}>
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
                      data-h2-background-color="base(dt-gray.50)"
                      data-h2-margin="base(x.5, 0)"
                      orientation="horizontal"
                    />
                  ) : null}
                </div>
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
      <Heading
        data-h2-font-size="base(copy, 1)"
        data-h2-font-weight="base(700)"
        data-h2-margin="base(x.75, 0, x.5, 0)"
        id={skipToHeadingId}
        tabIndex={-1}
      >
        {intl.formatMessage({
          defaultMessage: "Selected skills",
          id: "l7Hif/",
          description: "Section header for a list of skills selected",
        })}
      </Heading>
      {selectedSkills.length > 0 ? (
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
      ) : (
        <p data-h2-margin="base(x1, 0)" data-h2-font-style="base(italic)">
          {intl.formatMessage({
            id: "/78DsY",
            defaultMessage: "You have not selected any skills.",
            description:
              "Text that appears after skill picker when no skills are selected",
          })}
        </p>
      )}
      {submitButtonText && handleSave && (
        <p data-h2-margin="base(x1, 0)">
          <Submit
            text={submitButtonText}
            color="cta"
            mode="solid"
            isSubmitting={isSubmitting}
            onClick={handleSubmit(handleSave)}
          />
        </p>
      )}
    </FormProvider>
  );
};

export default SkillPicker;
