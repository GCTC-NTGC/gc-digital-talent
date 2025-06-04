import { useIntl } from "react-intl";

import { Button, Dialog, Heading, Ul } from "@gc-digital-talent/ui";
import {
  commonMessages,
  getSkillLevelDefinition,
  getSkillLevelName,
} from "@gc-digital-talent/i18n";
import { SkillCategory } from "@gc-digital-talent/graphql";

import { getSortedSkillLevels } from "~/utils/skillUtils";

const SkillLevelDialog = () => {
  const intl = useIntl();
  const skillLevels = getSortedSkillLevels();

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button color="secondary">
          {intl.formatMessage({
            defaultMessage: "Learn more about skill levels",
            id: "RdmeZV",
            description: "Info button label for pool skill levels details.",
          })}
        </Button>
      </Dialog.Trigger>
      <Dialog.Content hasSubtitle>
        <Dialog.Header
          subtitle={intl.formatMessage({
            defaultMessage:
              "Skills are divided into technical and behavioural types, and each type has a unique 4 level scale.",
            id: "hIv123",
            description: "Subtitle for the skill level definitions dialog",
          })}
        >
          {intl.formatMessage({
            defaultMessage: "Understanding skill levels",
            id: "Dsnj8x",
            description: "Heading for the skill level definitions dialog",
          })}
        </Dialog.Header>
        <Dialog.Body>
          <Heading level="h3" size="h6" data-h2-margin-top="base(0)">
            {intl.formatMessage({
              defaultMessage: "Behavioural skill levels",
              id: "yKQGy8",
              description:
                "Heading for the skills level definitions of behavioural skills",
            })}
          </Heading>
          <p data-h2-margin="base(x.25 0)">
            {intl.formatMessage({
              defaultMessage:
                "Behavioural skills refer to the key interpersonal and personal attributes that are necessary for specific jobs across the organization. These competencies generally refer to the way a person acts, communicates and interacts with others. They consist of the following levels",
              id: "4r+taV",
              description:
                "Lead-in text for the skills level definitions of behavioural skills",
            }) + intl.formatMessage(commonMessages.dividingColon)}
          </p>
          <Ul>
            {skillLevels.map((skillLevel) => (
              <li key={`behavioural${skillLevel}`}>
                <strong>
                  {intl.formatMessage(
                    getSkillLevelName(skillLevel, SkillCategory.Behavioural),
                  ) + intl.formatMessage(commonMessages.dividingColon)}
                </strong>
                {intl.formatMessage(
                  getSkillLevelDefinition(
                    skillLevel,
                    SkillCategory.Behavioural,
                  ),
                )}
              </li>
            ))}
          </Ul>
          <Heading level="h3" size="h6">
            {intl.formatMessage({
              defaultMessage: "Technical skill levels",
              id: "k8lEf0",
              description:
                "Heading for the skills level definitions of technical skills",
            })}
          </Heading>
          <p data-h2-margin="base(x.25 0)">
            {intl.formatMessage({
              defaultMessage:
                "Technical skills refer to the technical knowledge and abilities that are relevant to specific jobs or roles across the organization. Technical skills are usually acquired through specific learning or work experience in applying the knowledge and skill. They consist of the following levels",
              id: "p4YIkl",
              description:
                "Lead-in text for the skills level definitions of technical skills",
            }) + intl.formatMessage(commonMessages.dividingColon)}
          </p>
          <Ul>
            {skillLevels.map((skillLevel) => (
              <li key={`technical${skillLevel}`}>
                <strong>
                  {intl.formatMessage(
                    getSkillLevelName(skillLevel, SkillCategory.Technical),
                  ) + intl.formatMessage(commonMessages.dividingColon)}
                </strong>
                {intl.formatMessage(
                  getSkillLevelDefinition(skillLevel, SkillCategory.Technical),
                )}
              </li>
            ))}
          </Ul>
          <Dialog.Footer>
            <Dialog.Close>
              <Button color="secondary">
                {intl.formatMessage({
                  defaultMessage: "Close",
                  id: "4p0QdF",
                  description: "Button text used to close an open modal",
                })}
              </Button>
            </Dialog.Close>
          </Dialog.Footer>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default SkillLevelDialog;
