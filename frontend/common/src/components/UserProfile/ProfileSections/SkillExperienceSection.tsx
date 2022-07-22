import React from "react";
import { useIntl } from "react-intl";
import { requiredFieldsMissing } from "../../../constants/localizedConstants";
import { notEmpty } from "../../../helpers/util";
import { Applicant } from "../../../api/generated";
import ExperienceSection from "../ExperienceSection";

import type { ExperiencePaths } from "../ExperienceAccordion/ExperienceAccordion";

export type PathFunc = (path: void | string, id: void | string) => string;

const SkillExperienceSection: React.FunctionComponent<{
  applicant: Pick<Applicant, "experiences">;
  editPath?: string;
  applicantPaths?: Record<string, PathFunc>;
}> = ({ applicant, editPath, applicantPaths }) => {
  const intl = useIntl();
  const { experiences } = applicant;

  const experienceEditPaths = applicantPaths
    ? {
        awardUrl: (id: string) => applicantPaths.editExperience("award", id),
        communityUrl: (id: string) =>
          applicantPaths.editExperience("community", id),
        educationUrl: (id: string) =>
          applicantPaths.editExperience("education", id),
        personalUrl: (id: string) =>
          applicantPaths.editExperience("personal", id),
        workUrl: (id: string) => applicantPaths.editExperience("work", id),
      }
    : null;

  return (
    <div>
      {" "}
      {!experiences || experiences?.length === 0 ? (
        <div
          data-h2-bg-color="b(lightgray)"
          data-h2-padding="b(all, m)"
          data-h2-radius="b(s)"
        >
          <p>
            {intl.formatMessage({
              defaultMessage: "You haven't added any information here yet.",
              description:
                "Message that the user hasn't filled out the section yet",
            })}
          </p>
          <p>
            {intl.formatMessage(requiredFieldsMissing)}{" "}
            <a href={editPath}>
              {intl.formatMessage({
                defaultMessage: "Edit your skill and experience options.",
                description:
                  "Link text for editing skills and experiences on profile.",
              })}
            </a>
          </p>
        </div>
      ) : (
        <div data-h2-padding="b(all, m)" data-h2-radius="b(s)">
          <ExperienceSection
            experiences={experiences?.filter(notEmpty)}
            experienceEditPaths={experienceEditPaths as ExperiencePaths}
          />
        </div>
      )}
    </div>
  );
};

export default SkillExperienceSection;
