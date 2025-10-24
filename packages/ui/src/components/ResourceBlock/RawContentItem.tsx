import { ReactNode } from "react";

import BaseItem from "./BaseItem";
import { HeadingRank } from "../../types";

interface WrapperProps {
  as?: HeadingRank;
  children: ReactNode;
}

const Wrapper = ({ as, children }: WrapperProps) => {
  if (!as) return <>{children}</>;

  const Heading = as;
  return <Heading className="text-base font-bold">{children}</Heading>;
};

interface RawContentItemProps {
  title: string;
  as?: HeadingRank;
  children: ReactNode;
}

// Allows putting anything into the content section
const RawContentItem = ({ title, as, children }: RawContentItemProps) => {
  return (
    <BaseItem
      title={<Wrapper as={as}>{title}</Wrapper>}
      state={undefined}
      content={children}
    />
  );
};

export default RawContentItem;
