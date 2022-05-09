import React from "react";
import Accordion from "@common/components/accordion/Accordion";
import BriefCaseIcon from "@heroicons/react/solid/BriefcaseIcon";
import { Link } from "@common/components";
import {
  getAwardedTo,
  getAwardedScope,
} from "@common/constants/localizedConstants";
import { useIntl } from "react-intl";
import { getLocale } from "@common/helpers/localize";
import { getDateRange } from "@common/helpers/dateUtils";
import { useApplicantProfileRoutes } from "../../../applicantProfileRoutes";
import { AwardExperience } from "../../../api/generated";

const AwardAccordion: React.FunctionComponent<AwardExperience> = ({
  id,
  title,
  awardedDate,
  issuedBy,
  details,
  awardedTo,
  awardedScope,
  skills,
}) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const profilePaths = useApplicantProfileRoutes();
  const editUrl = `${profilePaths.skillsAndExperiences()}/award/${id}/edit`;

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
      Icon={BriefCaseIcon}
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
      <div data-h2-padding="b(left, l)">
        <Link href={editUrl} color="primary" mode="outline" type="button">
          {intl.formatMessage({
            defaultMessage: "Edit Experience",
            description: "Edit Experience button label",
          })}
        </Link>
      </div>
    </Accordion>
  );
};

export default AwardAccordion;
