import React from "react";
import { useIntl } from "react-intl";

import Well from "../../Well";
import messages from "../../../messages/commonMessages";
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

  return !experiences || experiences?.length === 0 ? (
    <Well>
      <div data-h2-flex-grid="base(flex-start, x2, x1)">
        <div data-h2-flex-item="base(1of1)">
          <p>
            {intl.formatMessage({
              defaultMessage: "You haven't added any information here yet.",
              id: "SCCX7B",
              description: "Message for when no data exists for the section",
            })}
          </p>
        </div>
        <div data-h2-flex-item="base(1of1)">
          <p>
            {intl.formatMessage(messages.requiredFieldsMissing)}{" "}
            <a href={editPath}>
              {intl.formatMessage({
                defaultMessage: "Edit your skill and experience options.",
                id: "hDupu9",
                description:
                  "Link text for editing skills and experiences on profile.",
              })}
            </a>
          </p>
        </div>
      </div>
    </Well>
  ) : (
    <div data-h2-padding="base(x1)" data-h2-radius="base(s)">
      <ExperienceSection
        experiences={experiences?.filter(notEmpty)}
        experienceEditPaths={experienceEditPaths as ExperiencePaths}
      />
    </div>
  );
};

export default SkillExperienceSection;
