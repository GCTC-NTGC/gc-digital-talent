import { useIntl } from "react-intl";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { Accordion, PreviewList, Well } from "@gc-digital-talent/ui";

import { hasAllEmptyFields as hasAllEmptyFieldsNextRole } from "~/validators/employeeProfile/nextRole";
import { hasAllEmptyFields as hasAllEmptyFieldsCareerObjective } from "~/validators/employeeProfile/careerObjective";

import NextRolePreview from "./NextRolePreview";
import CareerObjectivePreview from "./CareerObjectivePreview";
import { CareerObjectiveInfo_Fragment, NextRoleInfo_Fragment } from "./utils";

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
}

const NextRoleAndCareerObjective = ({
  nextRoleAndCareerObjectiveQuery,
  sectionKey,
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

  return (
    <>
      <Accordion.Item value={sectionKey}>
        <Accordion.Trigger
          as="h3"
          subtitle={intl.formatMessage({
            defaultMessage:
              "The next role the nominee intends to achieve and their primary career objective, including classification, work streams, and departments.",
            id: "iwDEuu",
            description: "Subtitle for next role and career objective section",
          })}
        >
          <span data-h2-font-weight="base(400)">
            {intl.formatMessage({
              defaultMessage: "Next role and career objective",
              id: "QhFxW1",
              description: "Title for next role and career objective section",
            })}
          </span>
        </Accordion.Trigger>
        <Accordion.Content>
          <PreviewList.Root>
            {/* If the employee hasn't filled out this section then display null message */}
            {hasAllEmptyFieldsNextRole({ ...nextRole }) ? (
              <Well>
                <p>
                  {intl.formatMessage({
                    defaultMessage:
                      "The nominee has not provided information about the next role they’d like to achieve.",
                    id: "wYka/g",
                    description:
                      "Message displayed if nominee hasn't filled out next role info",
                  })}
                </p>
              </Well>
            ) : (
              <NextRolePreview
                nextRolePreviewQuery={nextRoleAndCareerObjective}
              />
            )}
            {hasAllEmptyFieldsCareerObjective({ ...careerObjective }) ? (
              <Well data-h2-padding-bottom="base(x1)">
                <p>
                  {intl.formatMessage({
                    defaultMessage:
                      "The nominee has not provided information about their final career objective.",
                    id: "zXgAWv",
                    description:
                      "Message displayed if nominee hasn't filled out career objective info",
                  })}
                </p>
              </Well>
            ) : (
              <CareerObjectivePreview
                careerObjectivePreviewQuery={nextRoleAndCareerObjective}
              />
            )}
          </PreviewList.Root>
        </Accordion.Content>
      </Accordion.Item>
    </>
  );
};

export default NextRoleAndCareerObjective;
