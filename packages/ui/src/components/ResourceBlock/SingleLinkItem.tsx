import ArrowLongRightIcon from "@heroicons/react/16/solid/ArrowLongRightIcon";
import { ReactNode } from "react";

import Link, { LinkProps } from "../Link";
import BaseItem, { BaseItemProps } from "./BaseItem";
import { HeadingRank } from "../../types";

interface WrapperProps {
  as?: HeadingRank;
  children: ReactNode;
}

const Wrapper = ({ as, children }: WrapperProps) => {
  if (!as) return <>{children}</>;

  const Heading = as;
  return <Heading className="text-base">{children}</Heading>;
};

interface SingleLinkItemProps {
  title: string;
  as?: HeadingRank;
  accessibleLabel?: BaseItemProps["accessibleLabel"];
  href: LinkProps["href"];
  description: BaseItemProps["description"];
  state?: BaseItemProps["state"];
}

const SingleLinkItem = ({
  title,
  accessibleLabel,
  href,
  description,
  state,
  as,
}: SingleLinkItemProps) => (
  <BaseItem
    title={
      <Wrapper as={as}>
        <Link
          href={href}
          color="black"
          className="font-bold"
          utilityIcon={ArrowLongRightIcon}
        >
          {title}
        </Link>
      </Wrapper>
    }
    accessibleLabel={accessibleLabel ?? title}
    description={description}
    state={state}
  />
);

export default SingleLinkItem;
