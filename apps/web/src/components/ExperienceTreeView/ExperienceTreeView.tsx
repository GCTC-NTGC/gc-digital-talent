import React from "react";
import { useIntl } from "react-intl";

import { notEmpty } from "@gc-digital-talent/helpers";
import { useLocale } from "@gc-digital-talent/i18n";
import { Alert, Button, Card, TreeView } from "@gc-digital-talent/ui";

import { Skill } from "~/api/generated";

import ExperienceCard from "../ExperienceCard/ExperienceCard";

interface ExperienceTreeViewProps {
  skill: Skill;
}

const ExperienceTreeView = ({ skill }: ExperienceTreeViewProps) => {
  const intl = useIntl();
  const { locale } = useLocale();
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
                  "This required skill must have at least 1 career timeline experience associated with it.",
                id: "ZwGMwT",
                description: "Experience tree view error message",
              })}
            </Alert.Title>
          </Alert.Root>
        </TreeView.Item>
      )}
      {experiences.length > 0 &&
        experiences.map((experience) => (
          <TreeView.Item key={experience.id}>
            <ExperienceCard experience={experience} showEdit={false} />
            {/* TODO: Add editUrlPaths when edit experience dialog component is completed. */}
          </TreeView.Item>
        ))}
      <TreeView.Item>
        <Button color="secondary" mode="solid" type="button">
          {intl.formatMessage({
            defaultMessage: "Connect a career timeline experience",
            id: "URRpKO",
            description: "Experience tree view action button label",
          })}
        </Button>
      </TreeView.Item>
    </TreeView.Root>
  );
};

export default ExperienceTreeView;
