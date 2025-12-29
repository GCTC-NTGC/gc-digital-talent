import { JSX } from "react";

import {
  Activity,
  FragmentType,
  getFragment,
  graphql,
} from "@gc-digital-talent/graphql";

import AssessmentStepActivityItem from "./Items/AssessmentStepActivityItem";
import PoolActivityItem, {
  PoolActivityItemProps,
} from "./Items/PoolActivityItem";
import PoolCandidateActivityItem from "./Items/PoolCandidateActivityItem";
import PoolSkillActivityItem from "./Items/PoolSkillActivityItem";
import { CommonItemProps } from "./Items/BaseActivityItem";

type SubComponentProps = Omit<PoolActivityItemProps, "query"> & CommonItemProps;

const itemMap = new Map<
  Activity["subjectType"],
  (props: SubComponentProps) => JSX.Element | null
>([
  ["App\\Models\\AssessmentStep", AssessmentStepActivityItem],
  ["App\\Models\\Pool", PoolActivityItem],
  ["App\\Models\\PoolCandidate", PoolCandidateActivityItem],
  ["App\\Models\\PoolSkill", PoolSkillActivityItem],
]);

const ActivityItem_Fragment = graphql(/** GraphQL */ `
  fragment ActivityItem on Activity {
    subjectType
    ...BaseActivityItem
  }
`);

interface ItemProps {
  query: FragmentType<typeof ActivityItem_Fragment>;
  itemProps?: SubComponentProps;
}

const Item = ({ query, itemProps }: ItemProps) => {
  const item = getFragment(ActivityItem_Fragment, query);
  const El = itemMap.get(item.subjectType);

  return El ? <El query={item} {...itemProps} /> : null;
};

export default Item;
