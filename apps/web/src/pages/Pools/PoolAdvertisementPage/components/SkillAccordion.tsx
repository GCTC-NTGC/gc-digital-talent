import { useIntl } from "react-intl";

import { Accordion } from "@gc-digital-talent/ui";
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

interface ContextProps {
  required?: boolean;
}

const Context = ({ required }: ContextProps) => {
  const intl = useIntl();

  return (
    <span
      className="font-bold"
      {...(required
        ? {
            "data-h2-color": "base(primary.darker)",
          }
        : { "data-h2-color": "base(secondary.darker)" })}
    >
      {required
        ? intl.formatMessage({
            defaultMessage: "Required",
            id: "c70xDW",
            description: "Label for a required skill",
          })
        : intl.formatMessage({
            defaultMessage: "Optional",
            id: "iNUK3f",
            description: "Label for an optional skill",
          })}
    </span>
  );
};

interface AccordionSubtitleProps {
  skillLevelItem: string;
  screeningTime: string;
}

const AccordionSubtitle = ({
  skillLevelItem,
  screeningTime,
}: AccordionSubtitleProps) => (
  <span
    data-h2-align-items="base(flex-start) p-tablet(center)"
    data-h2-color="base(black.light)"
    data-h2-font-size="base(caption)"
    data-h2-margin-top="base(x.5)"
    data-h2-display="base(flex)"
    data-h2-flex-direction="base(column) p-tablet(row)"
    data-h2-gap="base(x.5)"
  >
    <span>{skillLevelItem}</span>
    <span data-h2-display="base(none) p-tablet(inline)">&bull;</span>
    <span>{screeningTime}</span>
  </span>
);

const PoolSkillAccordion_Fragment = graphql(/* GraphQL */ `
  fragment PoolSkillAccordion on PoolSkill {
    id
    requiredLevel
    skill {
      id
      key
      category
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

interface SkillAccordionProps {
  poolSkillQuery: FragmentType<typeof PoolSkillAccordion_Fragment>;
  required?: ContextProps["required"];
}

const SkillAccordion = ({ poolSkillQuery, required }: SkillAccordionProps) => {
  const intl = useIntl();
  const poolSkill = getFragment(PoolSkillAccordion_Fragment, poolSkillQuery);
  if (!poolSkill.skill) return null;

  const definitionAndLevel = poolSkill.requiredLevel
    ? getSkillLevelMessages(poolSkill.requiredLevel, poolSkill.skill.category)
    : null;

  const skillLevel = definitionAndLevel
    ? intl.formatMessage(definitionAndLevel.name)
    : intl.formatMessage(commonMessages.notFound);

  const skillLevelItem = `${`${
    intl.formatMessage({
      defaultMessage: "Level",
      id: "bVRixs",
      description: "Label displayed on the classification form level field.",
    }) + intl.formatMessage(commonMessages.dividingColon)
  } ${skillLevel}`}`;

  const screeningTime =
    poolSkill.skill.category === SkillCategory.Technical
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
        context={<Context required={required} />}
        subtitle={
          <AccordionSubtitle
            skillLevelItem={skillLevelItem}
            screeningTime={screeningTime}
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
        <p>
          <span className="font-bold">
            {intl.formatMessage({
              defaultMessage: "Level definition",
              id: "fqa45V",
              description: "Label for the definition of a specific skill level",
            }) + intl.formatMessage(commonMessages.dividingColon)}
          </span>
          {definitionAndLevel
            ? intl.formatMessage(definitionAndLevel.definition)
            : intl.formatMessage(commonMessages.notFound)}
        </p>
      </Accordion.Content>
    </Accordion.Item>
  );
};

export default SkillAccordion;
