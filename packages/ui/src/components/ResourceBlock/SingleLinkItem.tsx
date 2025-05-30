import ArrowSmallRightIcon from "@heroicons/react/20/solid/ArrowSmallRightIcon";
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
  return <Heading data-h2-font-size="base(body)">{children}</Heading>;
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
          // yuck, style exception 😞
          // TO DO: Should be able to remove the bang in #13562
          className="font-bold!"
          // eslint-disable-next-line @typescript-eslint/no-deprecated
          utilityIcon={ArrowSmallRightIcon}
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
