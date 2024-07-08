import { useIntl } from "react-intl";

import { PoolCandidate } from "@gc-digital-talent/graphql";
import {
  commonMessages,
  getEducationRequirementOption,
} from "@gc-digital-talent/i18n";
import { TreeView } from "@gc-digital-talent/ui";
import { notEmpty } from "@gc-digital-talent/helpers";

import ExperienceTreeItems from "~/components/ExperienceTreeItems/ExperienceTreeItems";

interface EducationRequirementsDisplayProps {
  application?: PoolCandidate | null;
}

const EducationRequirementsDisplay = ({
  application,
}: EducationRequirementsDisplayProps) => {
  const intl = useIntl();

  const classificationGroup = application?.pool.classification?.group ?? "";

  return (
    <>
      <p>
        {intl.formatMessage(
          {
            defaultMessage:
              "Requirement selection: <strong>{educationRequirementOption}</strong>.",
            id: "J3Ud6R",
            description:
              "Application snapshot minimum experience section description",
          },
          {
            educationRequirementOption: intl.formatMessage(
              application?.educationRequirementOption
                ? getEducationRequirementOption(
                    application.educationRequirementOption.value,
                    classificationGroup,
                  )
                : commonMessages.notAvailable,
            ),
          },
        )}
      </p>
      {application?.educationRequirementExperiences?.length ? (
        <>
          <p data-h2-margin="base(x1 0)">
            {intl.formatMessage({
              defaultMessage: "Demonstrated with the following experiences:",
              id: "tpTntk",
              description:
                "Lead in text for experiences that demonstrate minimum education experience",
            })}
          </p>
          <TreeView.Root>
            <ExperienceTreeItems
              experiences={application?.educationRequirementExperiences.filter(
                notEmpty,
              )}
            />
          </TreeView.Root>
        </>
      ) : null}
    </>
  );
};

export default EducationRequirementsDisplay;
