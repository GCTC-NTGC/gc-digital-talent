import { ReactNode } from "react";
import { useIntl } from "react-intl";

export interface SkipLinkProps {
  href?: string;
  children?: ReactNode;
}

const SkipLink = ({ href = "#main", children }: SkipLinkProps) => {
  const intl = useIntl();

  return (
    // NOTE: Skip to is a custom link,we do not want to use the Link component
    // eslint-disable-next-line react/forbid-elements
    <a
      href={href}
      className="z-90 sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:inline-block focus-visible:px-4 focus-visible:py-2"
      data-h2-background-color="base:focus-visible(white)"
      data-h2-border="base:focus-visible(medium, dashed, black)"
    >
      {children ||
        intl.formatMessage({
          defaultMessage: "Skip to main content",
          id: "A2ycww",
          description: "Default Skip to main content message.",
        })}
    </a>
  );
};

export default SkipLink;
