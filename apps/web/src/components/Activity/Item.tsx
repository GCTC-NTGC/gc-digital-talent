import { JSX } from "react";

import { Activity, FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";

import PoolActivityItem, { PoolActivityItemProps } from "./PoolActivityItem";
import PoolSkillItem, { PoolSkillItemProps } from "./PoolSkillItem";

type SubComponentProps = PoolActivityItemProps | PoolSkillItemProps;

const itemMap = new Map<Activity["subjectType"], (props: SubComponentProps) => JSX.Element | null>([
  ["App\\Models\\Pool", PoolActivityItem],
  ["App\\Models\\PoolSkill", PoolSkillItem],
]);

const ActivityItem_Fragment = graphql(/** GraphQL */`
  fragment ActivityItem on Activity {
    subjectType
    ...BaseActivityItem
  }
`);

interface ItemProps extends Omit<SubComponentProps, "query"> {
  query: FragmentType<typeof ActivityItem_Fragment>;
}

const Item = ({ query, ...rest }: ItemProps) => {
  const item = getFragment(ActivityItem_Fragment, query);
  const El = itemMap.get(item.subjectType);

  return El ? <El query={item} {...rest} /> : null;

}

export default Item;

