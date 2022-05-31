import React from "react";
import { useIntl } from "react-intl";
import { notEmpty } from "../../../helpers/util";
import { Applicant } from "../../../api/generated";
import ExperienceSection from "../ExperienceSection";

// styling a text bit with red colour within intls
function redText(msg: string) {
  return <span data-h2-font-color="b(red)">{msg}</span>;
}

const SkillExperienceSection: React.FunctionComponent<{
  applicant: Pick<Applicant, "experiences">;
  editPath?: string;
}> = ({ applicant, editPath }) => {
  const intl = useIntl();
  const { experiences } = applicant;

  const experienceEditPaths = {
    awardUrl: (id: string) => paths.editExperience("award", id),
    communityUrl: (id: string) => paths.editExperience("community", id),
    educationUrl: (id: string) => paths.editExperience("education", id),
    personalUrl: (id: string) => paths.editExperience("personal", id),
    workUrl: (id: string) => paths.editExperience("work", id),
  };

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
            {intl.formatMessage(
              {
                defaultMessage:
                  "There are <redText>required</redText> fields missing.",
                description:
                  "Message that there are required fields missing. Please ignore things in <> tags.",
              },
              {
                redText,
              },
            )}{" "}
            <a href={editPath}>
              {intl.formatMessage({
                defaultMessage: "Click here to get started.",
                description: "Message to click on the words to begin something",
              })}
            </a>
          </p>
        </div>
      ) : (
        <div data-h2-padding="b(all, m)" data-h2-radius="b(s)">
          <ExperienceSection
            experiences={experiences?.filter(notEmpty)}
            experienceEditPaths={experienceEditPaths}
          />
        </div>
      )}
    </div>
  );
};

export default SkillExperienceSection;
