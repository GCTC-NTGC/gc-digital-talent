import ArrowTopRightOnSquareIcon from "@heroicons/react/20/solid/ArrowTopRightOnSquareIcon";
import { useIntl } from "react-intl";

import { uiMessages } from "@gc-digital-talent/i18n";

import { BaseCTAProps, cta } from "./utils";
import BaseLink, { BaseLinkProps } from "../Link/BaseLink";

type NewTabWrapperProps = Pick<BaseLinkProps, "newTab" | "children">;

const NewTabWrapper = ({ newTab = false, children }: NewTabWrapperProps) => {
  const intl = useIntl();
  if (!newTab) {
    return <>{children}</>;
  }

  return (
    <span className="flex items-center gap-x-1.5">
      <span>{children}</span>
      <ArrowTopRightOnSquareIcon
        aria-label={intl.formatMessage(uiMessages.newTab)}
        className="size-5"
      />
    </span>
  );
};

export interface CTALinkProps
  extends BaseCTAProps,
    Omit<BaseLinkProps, "color"> {}

const CTALink = ({
  icon,
  color = "primary",
  block = false,
  newTab = false,
  className,
  children,
  ...rest
}: CTALinkProps) => {
  const Icon = icon;
  const { base, icon: iconStyles, text } = cta({ color, block });
  return (
    <BaseLink className={base({ class: className })} {...rest}>
      <span className={iconStyles()}>
        <Icon className="size-5" />
      </span>
      <span className={text()}>
        <NewTabWrapper newTab={newTab}>{children}</NewTabWrapper>
      </span>
    </BaseLink>
  );
};

export default CTALink;
