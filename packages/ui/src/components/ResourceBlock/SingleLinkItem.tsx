import ArrowLongRightIcon from "@heroicons/react/16/solid/ArrowLongRightIcon";
import { ReactNode } from "react";
import { useIntl } from "react-intl";

import { commonMessages } from "@gc-digital-talent/i18n";

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
  href: LinkProps["href"];
  description: BaseItemProps["description"];
  state?: BaseItemProps["state"];
}

const SingleLinkItem = ({
  title,
  href,
  description,
  state,
  as,
}: SingleLinkItemProps) => {
  const intl = useIntl();
  let combinedLabel;
  switch (state) {
    case "incomplete":
      combinedLabel = `${title} (${intl.formatMessage(commonMessages.incomplete)})`;
      break;
    case "complete":
      combinedLabel = `${title} (${intl.formatMessage(commonMessages.complete)})`;
      break;
    default:
      combinedLabel = title;
  }
  return (
    <BaseItem
      title={
        <Wrapper as={as}>
          <Link
            href={href}
            color="black"
            className="font-bold"
            utilityIcon={ArrowLongRightIcon}
            aria-label={combinedLabel}
          >
            {title}
          </Link>
        </Wrapper>
      }
      description={description}
      state={state}
    />
  );
};

export default SingleLinkItem;
