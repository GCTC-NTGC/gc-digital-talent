import { useIntl } from "react-intl";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { Accordion } from "@gc-digital-talent/ui";

import Display from "./Display";

export const GoalsAndWorkStyle_Fragment = graphql(/* GraphQL */ `
  fragment GoalsAndWorkStyle on EmployeeProfile {
    ...GoalsAndWorkStyleDisplay
  }
`);

interface GoalsAndWorkStyleProps {
  goalsAndWorkStyleQuery: FragmentType<typeof GoalsAndWorkStyle_Fragment>;
  sectionKey: string;
}

const GoalsAndWorkStyle = ({
  goalsAndWorkStyleQuery,
  sectionKey,
}: GoalsAndWorkStyleProps) => {
  const intl = useIntl();
  const goalsAndWorkStyle = getFragment(
    GoalsAndWorkStyle_Fragment,
    goalsAndWorkStyleQuery,
  );

  return (
    <>
      <Accordion.Item value={sectionKey}>
        <Accordion.Trigger
          as="h3"
          subtitle={intl.formatMessage({
            defaultMessage:
              "The nominee’s opportunity to describe themself, how they approach their career, and how they work best.",
            id: "Ega1Nj",
            description: "Subtitle for goals and work style section",
          })}
        >
          <span className="font-normal">
            {intl.formatMessage({
              defaultMessage: "Goals and work style",
              id: "GDCKBX",
              description: "Title for goals and work style section",
            })}
          </span>
        </Accordion.Trigger>
        <Accordion.Content>
          <Display goalsAndWorkStyleQuery={goalsAndWorkStyle} />
        </Accordion.Content>
      </Accordion.Item>
    </>
  );
};

export default GoalsAndWorkStyle;
