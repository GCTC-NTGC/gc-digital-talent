import { useIntl } from "react-intl";
import { tv } from "tailwind-variants";

import { Accordion, HTMLEntity } from "@gc-digital-talent/ui";
import {
  commonMessages,
  getLocalizedName,
  getSkillLevelMessages,
} from "@gc-digital-talent/i18n";
import {
  FragmentType,
  SkillCategory,
  getFragment,
  graphql,
} from "@gc-digital-talent/graphql";

const context = tv({
  base: "font-bold",
  variants: {
    required: {
      true: "text-secondary-600 dark:text-secondary-200",
      false: "text-primary-600 dark:text-primary-200",
    },
  },
});

interface ContextProps {
  required: boolean;
}

const Context = ({ required }: ContextProps) => {
  const intl = useIntl();

  return (
    <span className={context({ required })}>
      {required
        ? intl.formatMessage({
            defaultMessage: "Required",
            id: "c70xDW",
            description: "Label for a required skill",
          })
        : intl.formatMessage(commonMessages.optional)}
    </span>
  );
};

interface AccordionSubtitleProps {
  isSkillLevelAvailable: boolean;
  skillLevelItem: string;
  screeningTime?: string | null;
}

const AccordionSubtitle = ({
  isSkillLevelAvailable,
  skillLevelItem,
  screeningTime,
}: AccordionSubtitleProps) => (
  <span className="mt-3 flex flex-col items-start gap-3 text-sm text-gray-600 xs:flex-row xs:items-center dark:text-gray-200">
    {isSkillLevelAvailable && (
      <>
        <span>{skillLevelItem}</span>
      </>
    )}
    {screeningTime && (
      <>
        <HTMLEntity name="&bull;" className="hidden xs:inline" />
        <span>{screeningTime}</span>
      </>
    )}
  </span>
);

export const PoolSkillAccordion_Fragment = graphql(/* GraphQL */ `
  fragment PoolSkillAccordion on PoolSkill {
    id
    requiredLevel
    skill {
      id
      key
      category {
        value
      }
      name {
        en
        fr
      }
      description {
        en
        fr
      }
    }
  }
`);

interface PoolSkillAccordionProps {
  poolSkillQuery: FragmentType<typeof PoolSkillAccordion_Fragment>;
  required?: ContextProps["required"];
}

const PoolSkillAccordion = ({
  poolSkillQuery,
  required,
}: PoolSkillAccordionProps) => {
  const intl = useIntl();
  const poolSkill = getFragment(PoolSkillAccordion_Fragment, poolSkillQuery);
  if (!poolSkill.skill) return null;

  const definitionAndLevel = poolSkill.requiredLevel
    ? getSkillLevelMessages(
        poolSkill.requiredLevel,
        poolSkill.skill.category.value,
      )
    : null;

  const skillLevel = definitionAndLevel
    ? intl.formatMessage(definitionAndLevel.name)
    : intl.formatMessage(commonMessages.notFound);

  const skillLevelItem = `${`${
    intl.formatMessage(commonMessages.level) +
    intl.formatMessage(commonMessages.dividingColon)
  } ${skillLevel}`}`;

  const screeningTime =
    poolSkill.skill.category.value === SkillCategory.Technical
      ? intl.formatMessage({
          defaultMessage: "Assessed during initial application",
          id: "gLNQYB",
          description:
            "Message displayed for technical skills telling users at what point it will be assessed",
        })
      : intl.formatMessage({
          defaultMessage: "Assessed at a later time",
          id: "PNtGco",
          description:
            "Message displayed for behavioural skills telling users at what point it will be assessed",
        });

  return (
    <Accordion.Item value={poolSkill.skill.id}>
      <Accordion.Trigger
        as="h3"
        context={
          required !== undefined ? <Context required={required} /> : null
        }
        subtitle={
          <AccordionSubtitle
            isSkillLevelAvailable={!!poolSkill.requiredLevel}
            skillLevelItem={skillLevelItem}
            screeningTime={required ? screeningTime : null}
          />
        }
      >
        {getLocalizedName(poolSkill.skill.name, intl)}
      </Accordion.Trigger>
      <Accordion.Content>
        {poolSkill.skill.description && (
          <p className="mb-6">
            <span className="font-bold">
              {intl.formatMessage({
                defaultMessage: "Skill definition",
                id: "N44sQc",
                description: "Label for the definition of a specific skill",
              }) + intl.formatMessage(commonMessages.dividingColon)}
            </span>
            {getLocalizedName(poolSkill.skill.description, intl)}
          </p>
        )}
        {poolSkill.requiredLevel && (
          <p>
            <span className="font-bold">
              {intl.formatMessage({
                defaultMessage: "Level definition",
                id: "fqa45V",
                description:
                  "Label for the definition of a specific skill level",
              }) + intl.formatMessage(commonMessages.dividingColon)}
            </span>
            {definitionAndLevel
              ? intl.formatMessage(definitionAndLevel.definition)
              : intl.formatMessage(commonMessages.notFound)}
          </p>
        )}
      </Accordion.Content>
    </Accordion.Item>
  );
};

export default PoolSkillAccordion;
