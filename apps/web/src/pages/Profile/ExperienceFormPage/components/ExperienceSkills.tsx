import React, { useState } from "react";
import { useIntl } from "react-intl";
import { useFieldArray, useFormContext } from "react-hook-form";

import {
  Accordion,
  StandardAccordionHeader,
  Well,
} from "@gc-digital-talent/ui";

import { Skill } from "~/api/generated";
import SkillsInDetail from "~/components/SkillsInDetail/SkillsInDetail";

import type { ExperienceType, FormSkill, FormSkills } from "~/types/experience";
import SkillDialog, {
  FormValues as SkillDialogFormValues,
} from "~/components/SkillDialog/SkillDialog";

import { notEmpty } from "@gc-digital-talent/helpers";
import NullExperienceType from "~/components/ExperienceFormFields/NullExperienceType";

type AccordionStates = "learn-more" | "";
export interface ExperienceSkillsProps {
  skills: Skill[];
  experienceType?: ExperienceType;
}

const ExperienceSkills = ({
  skills,
  experienceType,
}: ExperienceSkillsProps) => {
  const intl = useIntl();
  const { control, watch } = useFormContext();
  const type = watch("experienceType");
  const derivedType = type ?? experienceType;
  const watchedSkills: FormSkills = watch("skills");
  const { fields, remove, append } = useFieldArray({
    control,
    name: "skills",
  });

  const [accordionState, setAccordionState] = useState<AccordionStates>("");

  const handleAddSkill = async (values: SkillDialogFormValues) => {
    const skillId = values.skill;
    const skill = skills.find(({ id }) => id === skillId);

    if (skill) {
      append(
        {
          skillId: skill.id,
          name: skill.name,
          details: "",
        },
        { shouldFocus: false },
      );
    }
  };

  const handleRemoveSkill = (id: string) => {
    const index = watchedSkills.findIndex(
      (field: FormSkill) => field.skillId === id,
    );
    if (index >= 0) {
      remove(index);
    }
  };

  return (
    <section>
      <h2 data-h2-font-size="base(h3, 1)" data-h2-margin="base(x3, 0, x1, 0)">
        {intl.formatMessage({
          defaultMessage: "Link featured skills",
          id: "/I7wrY",
          description: "Title for skills on Experience form",
        })}
      </h2>
      <p data-h2-margin="base(0, 0, x2, 0)">
        {intl.formatMessage({
          defaultMessage:
            "Featured skills allow you to highlight how you used or developed particularly important skillsets during your experience. When applying to an opportunity on the platform, you’ll be asked to link the essential skills required for that job to your experiences in the same way, allowing you to build a holistic picture of your skill development. Skills you link during an application will also appear here for later editing.",
          id: "WY7q+L",
          description: "Description blurb for skills on Experience form",
        })}
      </p>
      <Accordion.Root
        type="single"
        mode="simple"
        value={accordionState}
        onValueChange={(value: AccordionStates) => setAccordionState(value)}
        collapsible
      >
        <Accordion.Item value="learn-more">
          <StandardAccordionHeader headingAs="h3">
            {accordionState === "learn-more"
              ? intl.formatMessage({
                  defaultMessage:
                    "Hide information on how to best describe your skill experience",
                  id: "24NbNI",
                  description:
                    "Button text to close accordion describing skill experience",
                })
              : intl.formatMessage({
                  defaultMessage:
                    "Learn how to best describe your skill experience",
                  id: "YCqTbH",
                  description:
                    "Button text to open accordion describing skill experience",
                })}
          </StandardAccordionHeader>
          <Accordion.Content>
            <p data-h2-margin-top="base(x1)">
              {intl.formatMessage({
                defaultMessage:
                  "When linking an experience, try answering one or more of these questions:",
                id: "B9dbbl",
                description:
                  "Lead-in text for the list of skill experience questions",
              })}
            </p>
            <ul data-h2-margin="base:children[>li](x.5, 0, 0, 0)">
              <li>
                {intl.formatMessage({
                  defaultMessage:
                    "What did you accomplish, create or deliver using this skill?",
                  id: "aaFVT3",
                  description:
                    "Question list item in link featured skills section of experience form (accomplish).",
                })}
              </li>
              <li>
                {intl.formatMessage({
                  defaultMessage:
                    "What tasks or activities did you do that relate to this skill?",
                  id: "ibT7BK",
                  description:
                    "Question list item in link featured skills section of experience form (tasks).",
                })}
              </li>
              <li>
                {intl.formatMessage({
                  defaultMessage:
                    "Were there any special techniques or approaches that you used?",
                  id: "x2xN5X",
                  description:
                    "Question list item in link featured skills section of experience form (techniques).",
                })}
              </li>
              <li>
                {intl.formatMessage({
                  defaultMessage:
                    "How much responsibility did you have in this role?",
                  id: "u/IV5p",
                  description:
                    "Question list item in link featured skills section of experience form (responsibilities).",
                })}
              </li>
            </ul>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
      {notEmpty(derivedType) ? (
        <div
          data-h2-display="base(flex)"
          data-h2-gap="base(x1)"
          data-h2-flex-direction="base(column)"
          data-h2-flex-wrap="p-tablet(wrap)"
          data-h2-margin-top="base(x1)"
        >
          <div data-h2-align-self="base(flex-end)">
            <SkillDialog
              trigger={{
                label: intl.formatMessage({
                  defaultMessage: "Add a skill",
                  id: "Oeb04k",
                  description:
                    "Label for skill dialog trigger on experience skills section.",
                }),
              }}
              context="experience"
              skills={skills}
              onSave={handleAddSkill}
            />
          </div>
          {watchedSkills && watchedSkills.length > 0 ? (
            <SkillsInDetail
              skills={fields as FormSkills}
              onDelete={handleRemoveSkill}
            />
          ) : (
            <Well>
              <p
                data-h2-margin-bottom="base(x1)"
                data-h2-text-align="base(center)"
                data-h2-font-weight="base(bold)"
              >
                {intl.formatMessage({
                  defaultMessage:
                    "You haven’t featured any skills on this experience yet.",
                  id: "fdAwEs",
                  description:
                    "Primary message to user when no skills have been attached to experience.",
                })}
              </p>
              <p data-h2-text-align="base(center)">
                {intl.formatMessage({
                  defaultMessage:
                    "You can use the “Add a skill” button provided to feature skills here.",
                  id: "ScvzNz",
                  description:
                    "Secondary message to user when no skills have been attached to experience.",
                })}
              </p>
            </Well>
          )}
        </div>
      ) : (
        <NullExperienceType />
      )}
    </section>
  );
};

export default ExperienceSkills;
