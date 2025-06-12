import { ReactNode } from "react";
import { useIntl } from "react-intl";

interface SkipLinkProps {
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
      className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:z-[9999] focus-visible:w-auto focus-visible:border-3 focus-visible:border-dashed focus-visible:border-black focus-visible:bg-white focus-visible:px-3 focus-visible:py-1.5 dark:focus-visible:border-white dark:focus-visible:bg-gray-700"
    >
      {children ??
        intl.formatMessage({
          defaultMessage: "Skip to main content",
          id: "A2ycww",
          description: "Default Skip to main content message.",
        })}
    </a>
  );
};

export default SkipLink;
