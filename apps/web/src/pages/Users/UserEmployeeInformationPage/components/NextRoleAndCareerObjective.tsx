import { useIntl } from "react-intl";

import { FragmentType, getFragment } from "@gc-digital-talent/graphql";
import { Notice } from "@gc-digital-talent/ui";

import { hasAllEmptyFields as hasAllEmptyFieldsNextRole } from "~/validators/employeeProfile/nextRole";
import { hasAllEmptyFields as hasAllEmptyFieldsCareerObjective } from "~/validators/employeeProfile/careerObjective";
import NextRolePreview from "~/components/NextRoleAndCareerObjective/NextRolePreview";
import CareerObjectivePreview from "~/components/NextRoleAndCareerObjective/CareerObjectivePreview";
import {
  CareerObjectiveInfo_Fragment,
  NextRoleInfo_Fragment,
} from "~/components/NextRoleAndCareerObjective/utils";
import { NextRoleAndCareerObjective_Fragment } from "~/components/NextRoleAndCareerObjective/NextRoleAndCareerObjective";

interface NextRoleAndCareerObjectiveProps {
  nextRoleAndCareerObjectiveQuery: FragmentType<
    typeof NextRoleAndCareerObjective_Fragment
  >;
  sectionKey: string;
  nextRoleDialogSubtitle?: string;
  dialogSubtitle?: string;
}

const NextRoleAndCareerObjective = ({
  nextRoleAndCareerObjectiveQuery,
  nextRoleDialogSubtitle,
  dialogSubtitle,
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
      <Notice.Root>
        <Notice.Content>
          <p>
            {intl.formatMessage({
              defaultMessage:
                "The employee hasn't added any information about their next role or career objective to their profile",
              id: "ctOBXo",
              description:
                "Message displayed if employee hasn't filled out next role or career objective",
            })}
          </p>
        </Notice.Content>
      </Notice.Root>
    );
  }
  return (
    <div className="space-y-6">
      {hasNextRole ? (
        <NextRolePreview
          nextRolePreviewQuery={nextRoleAndCareerObjective}
          dialogSubtitle={nextRoleDialogSubtitle}
        />
      ) : (
        <Notice.Root>
          <Notice.Content>
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "The employee has not provided information about the next role they'd like to achieve.",
                id: "U5plJQ",
                description:
                  "Message displayed if employee hasn't filled out next role",
              })}
            </p>
          </Notice.Content>
        </Notice.Root>
      )}

      {/* Career Objective Section */}

      {hasCareerObjective ? (
        <CareerObjectivePreview
          careerObjectivePreviewQuery={nextRoleAndCareerObjective}
          dialogSubtitle={dialogSubtitle}
        />
      ) : (
        <Notice.Root>
          <Notice.Content>
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "The employee has not provided information about their ultimate career objective.",
                id: "ZhccbH",
                description:
                  "Message displayed if employee hasn't filled out career objective",
              })}
            </p>
          </Notice.Content>
        </Notice.Root>
      )}
    </div>
  );
};

export default NextRoleAndCareerObjective;
