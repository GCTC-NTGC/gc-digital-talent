import React from "react";
import StarIcon from "@heroicons/react/24/solid/StarIcon";
import { useIntl } from "react-intl";

import { Accordion, HeadingRank, Link } from "@gc-digital-talent/ui";
import { getAwardedTo, getAwardedScope } from "@gc-digital-talent/i18n";
import { StandardTrigger as StandardAccordionTrigger } from "@gc-digital-talent/ui/src/components/Accordion/StandardTrigger";

import { AwardExperience } from "~/api/generated";

import SkillList from "../SkillList";

import { getDateRange } from "../../accordionUtils";

export const AwardContent = ({
  title,
  issuedBy,
  details,
  awardedTo,
  awardedScope,
  skills,
}: AwardExperience) => {
  const intl = useIntl();
  return (
    <>
      <p>
        {intl.formatMessage(
          {
            defaultMessage: "{title} issued by {issuedBy}",
            id: "4BpFoX",
            description: "The award title is issued by some group",
          },
          { title, issuedBy },
        )}
      </p>
      <p>
        {intl.formatMessage({
          defaultMessage: "Awarded to: ",
          id: "3JL02L",
          description: "The award was given to",
        })}{" "}
        {awardedTo ? intl.formatMessage(getAwardedTo(awardedTo)) : ""}
      </p>
      <p>
        {intl.formatMessage({
          defaultMessage: "Scope: ",
          id: "FAOzjP",
          description: "The scope of the award given",
        })}{" "}
        {awardedScope ? intl.formatMessage(getAwardedScope(awardedScope)) : ""}
      </p>
      <hr
        data-h2-background-color="base(gray.lighter)"
        data-h2-height="base(1px)"
        data-h2-width="base(100%)"
        data-h2-border="base(none)"
        data-h2-margin="base(x1, 0)"
      />
      <SkillList skills={skills} />
      <hr
        data-h2-background-color="base(gray.lighter)"
        data-h2-height="base(1px)"
        data-h2-width="base(100%)"
        data-h2-border="base(none)"
        data-h2-margin="base(x1, 0)"
      />
      <p>
        {intl.formatMessage(
          {
            defaultMessage: "Additional information: {details}",
            id: "OvJwG6",
            description: "Additional information if provided",
          },
          { details },
        )}
      </p>
    </>
  );
};

interface AwardAccordionProps extends AwardExperience {
  headingLevel?: HeadingRank;
  editUrl?: string; // A link to edit the experience will only appear if editUrl is defined.
}

const AwardAccordion = ({
  editUrl,
  headingLevel = "h2",
  ...rest
}: AwardAccordionProps) => {
  const intl = useIntl();
  const { id, title, awardedDate, issuedBy, skills } = rest;

  return (
    <Accordion.Item value={id}>
      <StandardAccordionTrigger
        subtitle={getDateRange({
          endDate: undefined,
          startDate: awardedDate,
          intl,
        })}
        headerAs={headingLevel}
        context={
          skills?.length === 1
            ? intl.formatMessage({
                defaultMessage: "1 Skill",
                id: "A2KwTw",
                description: "Pluralization for one skill",
              })
            : intl.formatMessage(
                {
                  defaultMessage: "{skillsLength} Skills",
                  id: "l27ekQ",
                  description: "Pluralization for zero or multiple skills",
                },
                { skillsLength: skills?.length },
              )
        }
        Icon={StarIcon}
      >
        {title || ""} - {issuedBy || ""}
      </StandardAccordionTrigger>
      <Accordion.Content>
        <AwardContent {...rest} />
        {editUrl && (
          <div>
            <hr
              data-h2-background-color="base(gray.lighter)"
              data-h2-height="base(1px)"
              data-h2-width="base(100%)"
              data-h2-border="base(none)"
              data-h2-margin="base(x1, 0)"
            />
            <Link href={editUrl} color="primary" mode="outline" type="button">
              {intl.formatMessage({
                defaultMessage: "Edit Experience",
                id: "phbDSx",
                description: "Edit Experience button label",
              })}
            </Link>
          </div>
        )}
      </Accordion.Content>
    </Accordion.Item>
  );
};

export default AwardAccordion;
