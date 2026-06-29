import type { JSX } from "react";

import type { Activity, FragmentType } from "@gc-digital-talent/graphql";
import { getFragment, graphql } from "@gc-digital-talent/graphql";

import AssessmentStepActivityItem from "./Items/AssessmentStepActivityItem";
import type { PoolActivityItemProps } from "./Items/PoolActivityItem";
import PoolActivityItem from "./Items/PoolActivityItem";
import PoolCandidateActivityItem from "./Items/PoolCandidateActivityItem";
import PoolSkillActivityItem from "./Items/PoolSkillActivityItem";
import type { CommonItemProps } from "./Items/BaseActivityItem";

type SubComponentProps = Omit<PoolActivityItemProps, "query"> & CommonItemProps;
type SubComponent = (props: SubComponentProps) => JSX.Element | null;

const COMPONENT_MAP: Record<
  NonNullable<Activity["subjectType"]>,
  SubComponent
> = {
  "App\\Models\\AssessmentStep": AssessmentStepActivityItem,
  "App\\Models\\Pool": PoolActivityItem,
  "App\\Models\\PoolCandidate": PoolCandidateActivityItem,
  "App\\Models\\PoolSkill": PoolSkillActivityItem,
};

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
  if (!item.subjectType || !(item.subjectType in COMPONENT_MAP)) return null;

  const El = COMPONENT_MAP[item.subjectType];

  return El ? <El query={item} {...itemProps} /> : null;
};

export default Item;
