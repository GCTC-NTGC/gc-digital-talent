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
import { errorMessages, getLocalizedName } from "@gc-digital-talent/i18n";
import { normalizeString } from "@gc-digital-talent/helpers";
import { Skill } from "@gc-digital-talent/graphql";

import useRoutes from "~/hooks/useRoutes";

import skillBrowserMessages from "./messages";
import SkillDescription from "./SkillDescription";
import {
  formatOption,
  getCategoryOptions,
  getFamilyOptions,
  getFilteredFamilies,
  getFilteredSkills,
  getSkillFamilySkillCount,
} from "./utils";
import NullFamilyMessage from "./NullFamilyMessage";

const suggestionLink = (chunks: React.ReactNode, href: string) => (
  <Link href={href} state={{ referrer: window.location.href }}>
    {chunks}
  </Link>
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
    return getFilteredFamilies({ skills, category }).sort(
      (familyA, familyB) => {
        const a = normalizeString(getLocalizedName(familyA.name, intl));
        const b = normalizeString(getLocalizedName(familyB.name, intl));

        if (a === b) return 0;

        return a > b ? 1 : -1;
      },
    );
  }, [skills, category, intl]);

  const filteredSkills = React.useMemo(() => {
    return getFilteredSkills({ skills, family, inLibrary, category }).sort(
      (skillA, skillB) => {
        const a = normalizeString(getLocalizedName(skillA.name, intl));
        const b = normalizeString(getLocalizedName(skillB.name, intl));

        if (a === b) return 0;

        return a > b ? 1 : -1;
      },
    );
  }, [category, family, inLibrary, skills, intl]);

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

  const categoryOptions = getCategoryOptions(skills, intl);
  const familyOptions = getFamilyOptions(skills, intl, category, inLibrary);

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
            doNotSort
            nullSelection={intl.formatMessage(
              skillBrowserMessages.skillCategoryPlaceholder,
            )}
            trackUnsaved={false}
            label={intl.formatMessage(skillBrowserMessages.skillCategory)}
            options={categoryOptions}
          />
        )}
        <Select
          id="skill-family"
          name="family"
          nullSelection={intl.formatMessage(
            skillBrowserMessages.skillFamilyPlaceholder,
          )}
          trackUnsaved={false}
          doNotSort
          label={intl.formatMessage(skillBrowserMessages.skillFamily)}
          options={[
            ...familyOptions,
            ...filteredFamilies.map((skillFamily) => ({
              value: skillFamily.id,
              label: formatOption(
                getLocalizedName(skillFamily.name, intl),
                getSkillFamilySkillCount(skills, skillFamily),
                intl,
              ),
            })),
          ]}
        />
      </div>
      {family && family !== "" ? (
        <>
          <div data-h2-margin="base(x1, 0)">
            <Combobox
              id="skill"
              name="skill"
              rules={{ required: intl.formatMessage(errorMessages.required) }}
              trackUnsaved={false}
              total={filteredSkills.length}
              label={intl.formatMessage(skillBrowserMessages.skill)}
              options={filteredSkills.map((currentSkill) => ({
                value: currentSkill.id,
                label: getLocalizedName(currentSkill.name, intl),
              }))}
            />
          </div>
          {!selectedSkill && (
            <Well>
              <p data-h2-text-align="base(center)">
                {intl.formatMessage(skillBrowserMessages.nullSkill)}
              </p>
            </Well>
          )}
        </>
      ) : (
        <>
          <NullFamilyMessage />
          <input
            type="hidden"
            {...register("skill", {
              required: intl.formatMessage(
                skillBrowserMessages.nullSkillFamily,
              ),
            })}
          />
          {skillError && <Field.Error>{skillError?.toString()}</Field.Error>}
        </>
      )}
      {selectedSkill && <SkillDescription skill={selectedSkill} />}
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
                  ? intl.formatMessage(skillBrowserMessages.hideSkillInfo)
                  : intl.formatMessage(skillBrowserMessages.showSkillInfo)}
              </span>
            </span>
          </Button>
        </Collapsible.Trigger>
        <Collapsible.Content data-h2-padding-left="base(x1.5)">
          <Separator space="sm" />
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
