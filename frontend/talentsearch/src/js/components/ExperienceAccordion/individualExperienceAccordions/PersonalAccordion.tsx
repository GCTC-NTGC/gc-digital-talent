import React from "react";
import { Accordion } from "@common/components/accordion/Accordion";
import BriefCaseIcon from "@heroicons/react/solid/BriefcaseIcon";
import { Button } from "@common/components";
import { useIntl } from "react-intl";
import { getLocale } from "@common/helpers/localize";
import { getDateRange } from "@common/helpers/dateUtils";
import { navigate } from "@common/helpers/router";
import { PersonalExperience } from "../../../api/generated";
import { useApplicantProfileRoutes } from "../../../applicantProfileRoutes";

const PersonalAccordion: React.FunctionComponent<PersonalExperience> = ({
  id,
  title,
  startDate,
  endDate,
  details,
  description,
  skills,
}) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const profilePaths = useApplicantProfileRoutes();
  const editUrl = `${profilePaths.skillsAndExperiences()}/personal/${id}/edit`;

  const skillsList = skills
    ? skills.map((skill, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <ul key={index}>
          <li>
            <p data-h2-font-color="b(lightpurple)">{skill.name?.[locale]}</p>
            <p>{skill.description?.[locale]}</p>
          </li>
        </ul>
      ))
    : "";

  return (
    <Accordion
      title={title || ""}
      subtitle={getDateRange({ endDate, startDate, intl, locale })}
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
        <p>{description}</p>
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
        <Button
          color="primary"
          mode="outline"
          onClick={(event) => {
            event.preventDefault();
            navigate(editUrl);
          }}
        >
          {intl.formatMessage({
            defaultMessage: "Edit Experience",
            description: "Edit Experience button label",
          })}
        </Button>
      </div>
    </Accordion>
  );
};

export default PersonalAccordion;
