import React from "react";
import { notEmpty } from "@gc-digital-talent/helpers";
import { getLocale } from "@gc-digital-talent/i18n";
import {
  Accordion,
  Alert,
  Button,
  Card,
  TreeView,
} from "@gc-digital-talent/ui";
import { useIntl } from "react-intl";
import { Skill } from "~/api/generated";
import ExperienceAccordion from "~/components/ExperienceAccordion/ExperienceAccordion";

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
    <TreeView.Root>
      <TreeView.Head>
        <Card title={skill.name[locale] ?? ""} color="white" bold>
          {skill.description && (
            <p>{skill.description ? skill.description[locale] : ""}</p>
          )}
        </Card>
      </TreeView.Head>
      {experiences.length === 0 && (
        <TreeView.Item>
          <Alert.Root type="warning" data-h2-margin="base(0, 0)">
            <Alert.Title>
              {intl.formatMessage({
                defaultMessage:
                  "This required skill must have at least 1 résumé experience associated with it.",
                id: "7XSyhV",
                description: "Experience tree view error message",
              })}
            </Alert.Title>
          </Alert.Root>
        </TreeView.Item>
      )}
      {experiences.length > 0 &&
        experiences.map((experience) => (
          <TreeView.Item key={experience.id}>
            <div data-h2-margin="base(-x.5, 0)">
              <Accordion.Root type="single" collapsible>
                <ExperienceAccordion experience={experience} />{" "}
                {/* TODO: Add editUrlPaths when edit experience dialog component is completed. */}
              </Accordion.Root>
            </div>
          </TreeView.Item>
        ))}
      <TreeView.Item>
        <Button color="secondary" mode="solid" type="button">
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
