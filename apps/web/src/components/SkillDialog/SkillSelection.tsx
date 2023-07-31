import React from "react";
import { FieldError, useFormContext } from "react-hook-form";
import { useIntl } from "react-intl";
import ChevronRightIcon from "@heroicons/react/20/solid/ChevronRightIcon";
import get from "lodash/get";

import {
  Button,
  Collapsible,
  Link,
  Separator,
  Well,
} from "@gc-digital-talent/ui";
import { Combobox, Field, Select } from "@gc-digital-talent/forms";
import {
  errorMessages,
  getLocalizedName,
  uiMessages,
} from "@gc-digital-talent/i18n";

import { invertSkillSkillFamilyTree } from "~/utils/skillUtils";
import { Skill, SkillCategory } from "~/api/generated";
import useRoutes from "~/hooks/useRoutes";

import SkillDescription from "./SkillDescription";
import { getSkillCategorySkillCount, getSkillFamilySkillCount } from "./utils";

const suggestionLink = (chunks: React.ReactNode, href: string) => (
  <Link href={href}>{chunks}</Link>
);

interface SkillSelectionProps {
  skills: Skill[];
  inLibrary?: Skill[];
  onSelectSkill?: (skill: Skill | null) => void;
  showCategory?: boolean;
}

const SkillSelection = ({
  skills,
  onSelectSkill,
  inLibrary,
  showCategory = true,
}: SkillSelectionProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const [isExpanded, setIsExpanded] = React.useState<boolean>(false);
  const {
    watch,
    resetField,
    register,
    formState: { errors },
  } = useFormContext();
  const skillError = get(errors, "skill")?.message as FieldError;

  const [category, family, skill] = watch(["category", "family", "skill"]);

  const filteredFamilies = React.useMemo(() => {
    const invertedTree = invertSkillSkillFamilyTree(skills);

    return category && category !== "all"
      ? invertedTree.filter((currentFamily) => {
          return currentFamily.category === category;
        })
      : invertedTree;
  }, [skills, category]);

  const filteredSkills = React.useMemo(() => {
    if (inLibrary && family && family === "library") {
      // If `inLibrary` was passed and selected, filter by those instead of family
      return skills.filter((currentSkill) =>
        inLibrary?.find(
          (skillInLibrary) => skillInLibrary.id === currentSkill.id,
        ),
      );
    }

    if (family && family !== "all") {
      // We only care about family if it is set
      // since we are filtering families by category
      return skills.filter((currentSkill) =>
        currentSkill.families?.some((skillFamily) => skillFamily.id === family),
      );
    }
    if (category && category !== "all") {
      return skills.filter((currentSkill) =>
        currentSkill.families?.some(
          (skillFamily) => skillFamily.category === category,
        ),
      );
    }

    // neither is set so return all skills
    return skills;
  }, [category, family, inLibrary, skills]);

  const selectedSkill = React.useMemo(() => {
    return skill
      ? skills.find((currentSkill) => currentSkill.id === skill)
      : undefined;
  }, [skill, skills]);

  React.useEffect(() => {
    if (onSelectSkill) {
      onSelectSkill(selectedSkill || null);
    }
  }, [onSelectSkill, selectedSkill]);

  React.useEffect(() => {
    resetField("skill");
  }, [category, family, resetField]);

  React.useEffect(() => {
    resetField("family");
  }, [category, resetField]);

  let familyOptions = [
    {
      value: "all",
      label: intl.formatMessage(
        {
          defaultMessage: "All skill families ({count})",
          id: "mzQAMK",
          description: "Label for removing the skill family filter",
        },
        {
          count: category
            ? getSkillCategorySkillCount(skills, category)
            : skills.length,
        },
      ),
    },
  ];

  if (inLibrary) {
    familyOptions = [
      ...familyOptions,
      {
        value: "library",
        label: intl.formatMessage(
          {
            defaultMessage: "My library ({count})",
            id: "P5tK5j",
            description:
              "Label for filtering skills by ones already added to the users library",
          },
          {
            count: inLibrary.length,
          },
        ),
      },
    ];
  }

  return (
    <>
      <div
        data-h2-display="base(grid)"
        data-h2-gap="base(x1)"
        data-h2-margin-bottom="base(x1)"
        {...(showCategory
          ? {
              "data-h2-grid-template-columns": "base(1fr) p-tablet(1fr 1fr)",
            }
          : {
              "data-h2-grid-template-columns": "base(1fr)",
            })}
      >
        {showCategory && (
          <Select
            id="skill-category"
            name="category"
            nullSelection={intl.formatMessage(uiMessages.nullSelectionOption)}
            trackUnsaved={false}
            label={intl.formatMessage({
              defaultMessage: "Skill category",
              id: "piZjS+",
              description: "Label for the skill category filter field",
            })}
            options={[
              {
                value: "all",
                label: intl.formatMessage(
                  {
                    defaultMessage: "All categories ({count})",
                    id: "zS2PN+",
                    description: "Label for removing the skill category filter",
                  },
                  {
                    count: skills.length,
                  },
                ),
              },
              {
                value: SkillCategory.Behavioural,
                label: intl.formatMessage(
                  {
                    defaultMessage: "Behavioural skills ({count})",
                    id: "ElOtG0",
                    description: "Tab name for a list of behavioural skills",
                  },
                  {
                    count: getSkillCategorySkillCount(
                      skills,
                      SkillCategory.Behavioural,
                    ),
                  },
                ),
              },
              {
                value: SkillCategory.Technical,
                label: intl.formatMessage(
                  {
                    defaultMessage: "Technical skills ({count})",
                    id: "Z3+zWD",
                    description: "Tab name for a list of technical skills",
                  },
                  {
                    count: getSkillCategorySkillCount(
                      skills,
                      SkillCategory.Technical,
                    ),
                  },
                ),
              },
            ]}
          />
        )}
        <Select
          id="skill-family"
          name="family"
          nullSelection={intl.formatMessage(uiMessages.nullSelectionOption)}
          trackUnsaved={false}
          label={intl.formatMessage({
            defaultMessage: "Skill family",
            id: "6ofORn",
            description: "Label for the skill family filter field",
          })}
          options={[
            ...familyOptions,
            ...filteredFamilies.map((skillFamily) => ({
              value: skillFamily.id,
              label: `${getLocalizedName(
                skillFamily.name,
                intl,
              )} (${getSkillFamilySkillCount(skills, skillFamily)})`,
            })),
          ]}
        />
      </div>
      {family && family !== "" ? (
        <div data-h2-margin="base(x1, 0)">
          <Combobox
            id="skill"
            name="skill"
            rules={{ required: intl.formatMessage(errorMessages.required) }}
            trackUnsaved={false}
            label={intl.formatMessage({
              defaultMessage: "Skill",
              id: "+K/smr",
              description: "Label for the skill select field",
            })}
            options={filteredSkills.map((currentSkill) => ({
              value: currentSkill.id,
              label: getLocalizedName(currentSkill.name, intl),
            }))}
          />
        </div>
      ) : (
        <>
          <input
            type="hidden"
            {...register("skill", {
              required: intl.formatMessage({
                defaultMessage: "Select a skill family and skill to continue.",
                id: "jYPyWq",
                description:
                  "Error message when a user attempts to add a skill before selecting one",
              }),
            })}
          />
          {skillError && <Field.Error>{skillError?.toString()}</Field.Error>}
        </>
      )}
      {selectedSkill && <SkillDescription skill={selectedSkill} />}
      {!selectedSkill && (
        <Well>
          <p data-h2-text-align="base(center)">
            {intl.formatMessage({
              id: "HrRgTT",
              defaultMessage: "Please select a skill to continue.",
              description:
                "Help text to tell users to select a skill before submitting",
            })}
          </p>
        </Well>
      )}
      <Collapsible.Root
        open={isExpanded}
        onOpenChange={setIsExpanded}
        data-h2-margin="base(x1 0)"
      >
        <Collapsible.Trigger asChild>
          <Button
            type="button"
            mode="inline"
            color="black"
            data-h2-transform="base:children[.ExperienceCard__Chevron](rotate(0deg)) base:selectors[[data-state='open']]:children[.ExperienceCard__Chevron](rotate(90deg))"
          >
            <span
              data-h2-display="base(flex)"
              data-h2-align-items="base(center)"
              data-h2-gap="base(0 x.25)"
            >
              <ChevronRightIcon
                data-h2-height="base(x1.25)"
                data-h2-width="base(x1.25)"
                className="ExperienceCard__Chevron"
              />
              <span>
                {isExpanded
                  ? intl.formatMessage({
                      defaultMessage:
                        "Hide information on what to do if you can't find a skill",
                      id: "AxRGK2",
                      description:
                        "Button text to hide help information about skills",
                    })
                  : intl.formatMessage({
                      defaultMessage:
                        "Find out what to do if you can't find a skill",
                      id: "mAN6yW",
                      description:
                        "Button text to show help information about skills",
                    })}
              </span>
            </span>
          </Button>
        </Collapsible.Trigger>
        <Collapsible.Content data-h2-padding-left="base(x1.5)">
          <Separator
            orientation="horizontal"
            decorative
            data-h2-background-color="base(gray.lighter)"
            data-h2-margin="base(x1 0)"
          />
          <p data-h2-margin-bottom="base(x.5)">
            {intl.formatMessage({
              defaultMessage:
                "If you can't find a skill, try broadening your filters or searching for the skill's name using other industry terms.",
              id: "Q0AKK4",
              description:
                "Help text to tell users to change their filters to find a skill",
            })}
          </p>
          <p>
            {intl.formatMessage(
              {
                defaultMessage:
                  "If you still can't find a skill, it's possible that it hasn't been added to our library yet! We're always growing our skills list and would love to hear from you. <a>Get in touch with your suggestion</a>.",
                id: "c0SFYY",
                description:
                  "Help text to tell users to change their filters to find a skill",
              },
              {
                a: (chunks: React.ReactNode) =>
                  suggestionLink(chunks, paths.support()),
              },
            )}
          </p>
        </Collapsible.Content>
      </Collapsible.Root>
    </>
  );
};

export default SkillSelection;
