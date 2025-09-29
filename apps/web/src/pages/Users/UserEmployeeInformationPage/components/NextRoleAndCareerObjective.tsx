import { useIntl } from "react-intl";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { Well } from "@gc-digital-talent/ui";

import { hasAllEmptyFields as hasAllEmptyFieldsNextRole } from "~/validators/employeeProfile/nextRole";
import { hasAllEmptyFields as hasAllEmptyFieldsCareerObjective } from "~/validators/employeeProfile/careerObjective";
import NextRolePreview from "~/components/NextRoleAndCareerObjective/NextRolePreview";
import CareerObjectivePreview from "~/components/NextRoleAndCareerObjective/CareerObjectivePreview";
import {
  CareerObjectiveInfo_Fragment,
  NextRoleInfo_Fragment,
} from "~/components/NextRoleAndCareerObjective/utils";

export const NextRoleAndCareerObjective_Fragment = graphql(/* GraphQL */ `
  fragment NextRoleAndCareerObjective on User {
    ...NextRolePreview
    ...CareerObjectivePreview
    employeeProfile {
      ...NextRoleInfo
      ...CareerObjectiveInfo
    }
  }
`);

interface NextRoleAndCareerObjectiveProps {
  nextRoleAndCareerObjectiveQuery: FragmentType<
    typeof NextRoleAndCareerObjective_Fragment
  >;
  sectionKey: string;
  nextRoleDialogSubtitle?: string;
  careerObjectiveDialogSubtitle?: string;
}

const NextRoleAndCareerObjective = ({
  nextRoleAndCareerObjectiveQuery,
  nextRoleDialogSubtitle,
  careerObjectiveDialogSubtitle,
}: NextRoleAndCareerObjectiveProps) => {
  const intl = useIntl();
  const nextRoleAndCareerObjective = getFragment(
    NextRoleAndCareerObjective_Fragment,
    nextRoleAndCareerObjectiveQuery,
  );

  const nextRole = getFragment(
    NextRoleInfo_Fragment,
    nextRoleAndCareerObjective.employeeProfile,
  );

  const careerObjective = getFragment(
    CareerObjectiveInfo_Fragment,
    nextRoleAndCareerObjective.employeeProfile,
  );

  const hasNextRole = !hasAllEmptyFieldsNextRole({ ...nextRole });
  const hasCareerObjective = !hasAllEmptyFieldsCareerObjective({
    ...careerObjective,
  });

  if (!hasNextRole && !hasCareerObjective) {
    return (
      <Well>
        <p>
          {/* TODO: Add translations */}
          {intl.formatMessage({
            defaultMessage:
              "The employee hasn't added any information about their next role or career objective to their profile",
            id: "ctOBXo",
            description:
              "Message displayed if employee hasn't filled out next role or career objective",
          })}
        </p>
      </Well>
    );
  }
  return (
    <div className="space-y-6">
      {hasNextRole ? (
        <NextRolePreview
          nextRolePreviewQuery={nextRoleAndCareerObjective}
          nextRoleDialogSubtitle={nextRoleDialogSubtitle}
        />
      ) : (
        <Well>
          <p>
            {/* TODO: Add translations */}
            {intl.formatMessage({
              defaultMessage:
                "The employee has not provided information about the next role they'd like to achieve.",
              id: "U5plJQ",
              description:
                "Message displayed if employee hasn't filled out next role",
            })}
          </p>
        </Well>
      )}

      {/* Career Objective Section */}

      {hasCareerObjective ? (
        <CareerObjectivePreview
          careerObjectivePreviewQuery={nextRoleAndCareerObjective}
          careerObjectiveDialogSubtitle={careerObjectiveDialogSubtitle}
        />
      ) : (
        <Well>
          <p>
            {/* TODO: Add translations */}
            {intl.formatMessage({
              defaultMessage:
                "The employee has not provided information about their ultimate career objective.",
              id: "ZhccbH",
              description:
                "Message displayed if employee hasn't filled out career objective",
            })}
          </p>
        </Well>
      )}
    </div>
  );
};

export default NextRoleAndCareerObjective;
