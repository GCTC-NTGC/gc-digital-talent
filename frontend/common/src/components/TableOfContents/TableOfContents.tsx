import React from "react";
import { useIntl } from "react-intl";

export interface TableOfContentsProps {
  items: {
    label: string;
    id: string;
  }[];
}

const TableOfContents: React.FC<TableOfContentsProps> = ({
  items,
  children,
}) => {
  const intl = useIntl();
  const arrayChildren = React.Children.toArray(children);

  if (arrayChildren.length !== items.length) {
    throw new Error(
      `There must be the same number of children and items. (${arrayChildren.length} children, ${items.length} items.)`,
    );
  }

  return (
    <div
      data-h2-position="b(relative)"
      data-h2-flex-grid="b(top, contained, flush, none)"
      data-h2-container="b(center, l)"
      data-h2-padding="b(right-left, s)"
    >
      <div
        data-h2-flex-item="b(1of1) s(1of4)"
        data-h2-position="b(sticky)"
        data-h2-text-align="b(right)"
        data-h2-visibility="b(hidden) s(visible)"
      >
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
            <a
              key={item.id}
              href={`#${item.id}`}
              data-h2-margin="b(bottom, xs)"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
      <div data-h2-flex-item="b(1of1) s(3of4)">
        <div data-h2-padding="b(left, l)">
          {React.Children.map(children, (child, index) => {
            const item = items[index];

            return item && child
              ? React.cloneElement(child as React.ReactElement, {
                  id: item.id,
                })
              : null;
          })}
        </div>
      </div>
    </div>
  );
};

export default TableOfContents;
