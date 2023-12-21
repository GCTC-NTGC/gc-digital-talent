import React, { useState } from "react";
import { useIntl } from "react-intl";
import { useFieldArray, useFormContext } from "react-hook-form";

import { Accordion, Heading, Well } from "@gc-digital-talent/ui";

import { Skill } from "~/api/generated";
import SkillsInDetail from "~/components/SkillsInDetail/SkillsInDetail";
import type { ExperienceType, FormSkill, FormSkills } from "~/types/experience";
import SkillBrowserDialog from "~/components/SkillBrowser/SkillBrowserDialog";
import { FormValues as SkillBrowserDialogFormValues } from "~/components/SkillBrowser/types";
import NullExperienceType from "~/components/ExperienceFormFields/NullExperienceType";

type AccordionStates = "learn-more" | "";
interface ExperienceSkillsProps {
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

  const handleAddSkill = async (values: SkillBrowserDialogFormValues) => {
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

  const watchedSkillIds = watchedSkills
    ? watchedSkills.map((watchedSkill) => watchedSkill.skillId)
    : [];
  const unclaimedSkills = skills.filter(
    (skill) => !watchedSkillIds.includes(skill.id),
  );

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
      <Heading
        level="h3"
        size="h4"
        data-h2-font-weight="base(700)"
        data-h2-margin="base(x3, 0, x1, 0)"
      >
        {intl.formatMessage({
          defaultMessage: "Link featured skills",
          id: "/I7wrY",
          description: "Title for skills on Experience form",
        })}
      </Heading>
      <p data-h2-margin-bottom="base(x1)">
        {intl.formatMessage({
          defaultMessage:
            "Featured skills allow you to highlight how you used or developed particularly important skillsets during your experience. When applying to an opportunity on the platform, you’ll be asked to link the essential skills required for that job to your experiences in the same way, allowing you to build a holistic picture of your skill development. Skills you link during an application will also appear here for later editing.",
          id: "WY7q+L",
          description: "Description blurb for skills on Experience form",
        })}
      </p>
      <Accordion.Root
        type="single"
        size="sm"
        value={accordionState}
        onValueChange={(value: AccordionStates) => setAccordionState(value)}
        collapsible
      >
        <Accordion.Item value="learn-more">
          <Accordion.Trigger>
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
          </Accordion.Trigger>
          <Accordion.Content>
            <p>
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
                  id: "WEVxYV",
                  description: "Question for clarifying skill details",
                })}
              </li>
              <li>
                {intl.formatMessage({
                  defaultMessage:
                    "What tasks or activities did you do that relate to this skill?",
                  id: "ac1z9L",
                  description: "Question about related tasks to a skill",
                })}
              </li>
              <li>
                {intl.formatMessage({
                  defaultMessage:
                    "Were there any special techniques or approaches that you used?",
                  id: "Ivvi/F",
                  description: "Question about techniques used for a skill",
                })}
              </li>
              <li>
                {intl.formatMessage({
                  defaultMessage:
                    "How much responsibility did you have in this role?",
                  id: "Qjpmm8",
                  description: "Question for clarifying skill details",
                })}
              </li>
            </ul>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
      {derivedType ? (
        <div
          data-h2-display="base(flex)"
          data-h2-gap="base(x.5)"
          data-h2-flex-direction="base(column)"
          data-h2-flex-wrap="p-tablet(wrap)"
          data-h2-margin-top="base(x1)"
        >
          <div data-h2-align-self="base(flex-end)">
            <SkillBrowserDialog
              trigger={{
                label: intl.formatMessage({
                  defaultMessage: "Add a skill",
                  id: "Oeb04k",
                  description:
                    "Label for skill dialog trigger on experience skills section.",
                }),
              }}
              context="experience"
              skills={unclaimedSkills}
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
                data-h2-margin-bottom="base(x.5)"
                data-h2-text-align="base(center)"
                data-h2-font-weight="base(bold)"
              >
                {intl.formatMessage({
                  defaultMessage:
                    "You haven't featured any skills on this experience yet.",
                  id: "YJIOOh",
                  description:
                    "Primary message to user when no skills have been attached to experience.",
                })}
              </p>
              <p data-h2-text-align="base(center)">
                {intl.formatMessage({
                  defaultMessage: `You can use the "Add a skill" button provided to feature skills here.`,
                  id: "kUkyuI",
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
