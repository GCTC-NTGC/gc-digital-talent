import ArrowSmallRightIcon from "@heroicons/react/20/solid/ArrowSmallRightIcon";

import Link, { LinkProps } from "../Link";
import BaseItem, { BaseItemProps } from "./BaseItem";

interface SingleLinkItemProps {
  title: string;
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
}: SingleLinkItemProps) => {
  return (
    <BaseItem
      title={
        <Link
          href={href}
          color="black"
          // yuck, style exception 😞
          data-h2-font-weight="base(bold)"
        >
          {title}
          {/* issue #11284 */}
          {/* eslint-disable-next-line @typescript-eslint/no-deprecated */}
          <ArrowSmallRightIcon
            data-h2-width="base(auto)"
            data-h2-height="base(x0.75)"
            data-h2-color="base(black.light)"
            data-h2-margin="base(x0.15)"
            data-h2-vertical-align="base(top)"
            aria-hidden
          />
        </Link>
      }
      accessibleLabel={accessibleLabel ?? title}
      description={description}
      state={state}
    />
  );
};

export default SingleLinkItem;
