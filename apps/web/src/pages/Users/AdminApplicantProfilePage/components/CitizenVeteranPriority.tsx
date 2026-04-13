import type { FragmentType } from "@gc-digital-talent/graphql";
import { getFragment, graphql } from "@gc-digital-talent/graphql";
import { TableOfContents } from "@gc-digital-talent/ui";

import Display from "~/components/Profile/components/CitizenVeteranPriority/Display";

const CitizenVeteranPriority_Fragment = graphql(/** GraphQL */ `
  fragment CitizenVeteranPriority on User {
    ...CitizenVeteranPriorityDisplay
  }
`);

interface CitizenVeteranPriorityProps {
  query: FragmentType<typeof CitizenVeteranPriority_Fragment>;
}

export const CITIZEN_VETERAN_PRIORITY_ID = "citizen-veteran-priority";

const CitizenVeteranPriority = ({ query }: CitizenVeteranPriorityProps) => {
  const user = getFragment(CitizenVeteranPriority_Fragment, query);

  return (
    <TableOfContents.Section id={CITIZEN_VETERAN_PRIORITY_ID}>
      <Display query={user} />
    </TableOfContents.Section>
  );
};

export default CitizenVeteranPriority;
