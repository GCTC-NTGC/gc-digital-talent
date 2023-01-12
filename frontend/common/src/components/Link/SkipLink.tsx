import React from "react";
import { useIntl } from "react-intl";

interface SkipLinkProps {
  href?: string;
}

const SkipLink = ({ href = "#main" }: SkipLinkProps) => {
  const intl = useIntl();

  return (
    <a
      href={href}
      data-h2-background-color="base:focus-visible(white)"
      data-h2-border="base(0) base:focus-visible(medium, dashed, black)"
      data-h2-height="base(1px) base:focus-visible(auto)"
      data-h2-location="base:focus-visible(0, auto, auto, x1)"
      data-h2-overflow="base(hidden) base:focus-visible(visible)"
      data-h2-margin="base(-1px) base:focus-visible(0)"
      data-h2-padding="base(0) base:focus-visible(x.25, x.5)"
      data-h2-position="base:(absolute) base:focus-visible(fixed)"
      data-h2-white-space="base(nowrap)"
      data-h2-width="base(1px) base:focus-visible(auto)"
      data-h2-z-index="base:focus-visible(9999)"
    >
      {intl.formatMessage({
        defaultMessage: "Skip to main content",
        id: "Srs7a4",
        description: "Assistive technology skip link",
      })}
    </a>
  );
};

export default SkipLink;
