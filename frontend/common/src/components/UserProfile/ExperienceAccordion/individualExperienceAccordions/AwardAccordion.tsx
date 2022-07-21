import React from "react";
import StarIcon from "@heroicons/react/solid/StarIcon";
import { useIntl } from "react-intl";
import Accordion from "../../../accordion/Accordion";
import { Link } from "../../..";
import {
  getAwardedTo,
  getAwardedScope,
} from "../../../../constants/localizedConstants";
import { getLocale } from "../../../../helpers/localize";
import { getDateRange } from "../../../../helpers/dateUtils";
import { AwardExperience } from "../../../../api/generated";

type AwardAccordionProps = AwardExperience & {
  editUrl?: string; // A link to edit the experience will only appear if editUrl is defined.
  defaultOpen?: boolean;
};

const AwardAccordion: React.FunctionComponent<AwardAccordionProps> = ({
  title,
  awardedDate,
  issuedBy,
  details,
  awardedTo,
  awardedScope,
  skills,
  editUrl,
  defaultOpen = false,
}) => {
  const intl = useIntl();
  const locale = getLocale(intl);

  // create unordered list element of skills DOM Element
  const skillsList = skills
    ? skills.map((skill, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <ul key={index}>
          <li>
            <p>
              {skill.name?.[locale]}
              <br />
              {skill.description?.[locale]}
            </p>
          </li>
        </ul>
      ))
    : "";

  return (
    <Accordion
      title={`${title || ""} - ${issuedBy || ""}`}
      subtitle={getDateRange({
        endDate: undefined,
        startDate: awardedDate,
        intl,
        locale,
      })}
      context={
        skills?.length === 1
          ? intl.formatMessage({
              defaultMessage: "1 Skill",
              description: "Pluralization for one skill",
            })
          : intl.formatMessage(
              {
                defaultMessage: "{skillsLength} Skills",
                description: "Pluralization for zero or multiple skills",
              },
              { skillsLength: skills?.length },
            )
      }
      Icon={StarIcon}
      defaultOpen={defaultOpen}
    >
      <div data-h2-padding="b(left, l)">
        <p>
          {intl.formatMessage(
            {
              defaultMessage: "{title} issued by {issuedBy}",
              description: "The award title is issued by some group",
            },
            { title, issuedBy },
          )}
        </p>
        <p>
          {intl.formatMessage({
            defaultMessage: "Awarded to : ",
            description: "The award was given to",
          })}{" "}
          {awardedTo ? intl.formatMessage(getAwardedTo(awardedTo)) : ""}
        </p>
        <p>
          {intl.formatMessage({
            defaultMessage: "Scope : ",
            description: "The scope of the award given",
          })}{" "}
          {awardedScope
            ? intl.formatMessage(getAwardedScope(awardedScope))
            : ""}
        </p>
      </div>
      <hr />
      <div data-h2-padding="b(left, l)">{skillsList}</div>
      <div data-h2-padding="b(left, l)">
        <p>
          {intl.formatMessage(
            {
              defaultMessage: "Additional information: {details}",
              description: "Additional information if provided",
            },
            { details },
          )}
        </p>
      </div>
      {editUrl && (
        <div data-h2-padding="b(left, l)">
          <Link href={editUrl} color="primary" mode="outline" type="button">
            {intl.formatMessage({
              defaultMessage: "Edit Experience",
              description: "Edit Experience button label",
            })}
          </Link>
        </div>
      )}
    </Accordion>
  );
};

export default AwardAccordion;
