import React from "react";
import { useIntl } from "react-intl";

interface WithEllipsisPrefixProps {
  children: React.ReactNode;
}

/**
 * Helps prepend ellipses to other strings.
 * (Whitespace conventions for using the ellipsis varies between languages.)
 *
 * @see https://www.btb.termiumplus.gc.ca/tcdnstyl-chap?lang=eng&lettr=chapsect17&info0=17.07
 */
const WithEllipsisPrefix = ({ children }: WithEllipsisPrefixProps) => {
  const { formatMessage } = useIntl();
  const ellipsisPrefix = formatMessage({
    defaultMessage: "...",
    id: ".ellipsis",
  });

  return (
    <>
      {ellipsisPrefix}
      {children}
    </>
  );
};

export default WithEllipsisPrefix;
