import React from "react";
import { useIntl } from "react-intl";

import TableOfContentsAnchor from "./TableOfContentsAnchor";

import useTableOfContentsSections from "../../hooks/useTableOfContentsSections";

const TableOfContents: React.FC = () => {
  const intl = useIntl();
  const items = useTableOfContentsSections();

  return (
    <>
      <p data-h2-font-size="b(h5)" data-h2-font-weight="b(800)">
        {intl.formatMessage({
          defaultMessage: "On this page",
          description: "Title for  pages table of contents.",
        })}
      </p>
      <nav
        aria-label={intl.formatMessage({
          defaultMessage: "Table of contents",
          description:
            "Label for pages table of contents (used by assistive technology).",
        })}
        data-h2-display="b(flex)"
        data-h2-flex-direction="b(column)"
        data-h2-align-items="b(flex-end)"
      >
        {items.map((item) => (
          <TableOfContentsAnchor key={item.id} id={item.id}>
            {item.text}
          </TableOfContentsAnchor>
        ))}
      </nav>
    </>
  );
};

export default TableOfContents;
