import { useIntl } from "react-intl";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { Accordion, PreviewList } from "@gc-digital-talent/ui";

import NextRolePreview from "./NextRolePreview";
import CareerObjectivePreview from "./CareerObjectivePreview";

export const NextRoleAndCareerObjective_Fragment = graphql(/* GraphQL */ `
  fragment NextRoleAndCareerObjective on User {
    ...NextRolePreview
    ...CareerObjectivePreview
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
          {intl.formatMessage({
            defaultMessage: "Next role and career objective",
            id: "QhFxW1",
            description: "Title for next role and career objective section",
          })}
        </Accordion.Trigger>
        <Accordion.Content>
          <PreviewList.Root>
            <NextRolePreview
              nextRolePreviewQuery={nextRoleAndCareerObjective}
            />
            <CareerObjectivePreview
              careerObjectivePreviewQuery={nextRoleAndCareerObjective}
            />
          </PreviewList.Root>
        </Accordion.Content>
      </Accordion.Item>
    </>
  );
};

export default NextRoleAndCareerObjective;
