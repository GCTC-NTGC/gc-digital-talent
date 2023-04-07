import React from "react";
import { notEmpty } from "@gc-digital-talent/helpers";
import { getLocale } from "@gc-digital-talent/i18n";
import { Accordion, Button, TreeView } from "@gc-digital-talent/ui";
import { useIntl } from "react-intl";
import { Skill } from "~/api/generated";
import ExperienceAccordion from "../UserProfile/ExperienceAccordion/ExperienceAccordion";

interface ExperienceTreeViewProps {
  skill: Skill;
}

const ExperienceTreeView = ({ skill }: ExperienceTreeViewProps) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const experiences = skill.experiences
    ? skill.experiences.filter(notEmpty)
    : [];
  return (
    <TreeView.Root
      title={skill.name[locale] ?? ""}
      subtitle={skill.description ? skill.description[locale] : ""}
      error={
        experiences.length === 0
          ? intl.formatMessage({
              defaultMessage:
                "This required skill must have at least 1 résumé experience associated with it.",
              id: "7XSyhV",
              description: "Experience tree view error message",
            })
          : ""
      }
    >
      {experiences.length > 0 &&
        experiences.map((experience) => (
          <TreeView.Item key={experience.id}>
            <Accordion.Root
              type="single"
              collapsible
              data-h2-margin="base(0, 0)"
            >
              <ExperienceAccordion experience={experience} />{" "}
              {/* TODO: Add editUrlPaths when edit experience dialog component is completed. */}
            </Accordion.Root>
          </TreeView.Item>
        ))}
      <TreeView.Item>
        <Button color="blue" mode="solid" type="button">
          {intl.formatMessage({
            defaultMessage: "Connect a résumé experience",
            id: "GE9NbK",
            description: "Experience tree view action button label",
          })}
        </Button>
      </TreeView.Item>
    </TreeView.Root>
  );
};

export default ExperienceTreeView;
