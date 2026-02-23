import { useIntl } from "react-intl";

import {
  ApplicationStatus,
  FragmentType,
  getFragment,
  graphql,
  ScreeningStage,
} from "@gc-digital-talent/graphql";

import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";
import UpdateAssessmentStageDialog from "~/components/UpdateAssessmentStageDialog/UpdateAssessmentStageDialog";
import UpdateScreeningStageDialog from "~/components/UpdateScreeningStageDialog/UpdateScreeningStageDialog";
import applicationMessages from "~/messages/applicationMessages";

const ToAssessStatusMeta_Fragment = graphql(/** GraphQL */ `
  fragment ToAssessStatusMeta on PoolCandidate {
    status {
      value
    }

    screeningStage {
      value
    }

    ...UpdateScreeningStageDialog
    ...UpdateAssessmentStageDialog
  }
`);

interface ToAssessStatusMetaProps {
  query: FragmentType<typeof ToAssessStatusMeta_Fragment>;
}

const ToAssessStatusMeta = ({ query }: ToAssessStatusMetaProps) => {
  const intl = useIntl();
  const application = getFragment(ToAssessStatusMeta_Fragment, query);

  if (application.status?.value !== ApplicationStatus.ToAssess) return null;

  return (
    <>
      <FieldDisplay
        label={intl.formatMessage(applicationMessages.screeningStage)}
      >
        <UpdateScreeningStageDialog query={application} />
      </FieldDisplay>
      <FieldDisplay
        label={intl.formatMessage(applicationMessages.assessmentStage)}
      >
        {application.screeningStage?.value ===
        ScreeningStage.UnderAssessment ? (
          <UpdateAssessmentStageDialog query={application} />
        ) : (
          <p className="text-gray-500 dark:text-gray-200">
            {intl.formatMessage({
              defaultMessage: "(Available after screening stage)",
              id: "NadegW",
              description:
                "Message for assessment stage when application is not under assessment",
            })}
          </p>
        )}
      </FieldDisplay>
    </>
  );
};

export default ToAssessStatusMeta;
