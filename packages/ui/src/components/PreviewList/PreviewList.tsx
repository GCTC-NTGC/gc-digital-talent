import MagnifyingGlassPlusIcon from "@heroicons/react/24/outline/MagnifyingGlassPlusIcon";
import { ReactElement, ReactNode } from "react";

import Button from "../Button";
import Separator from "../Separator";
import Chip from "../Chip/Chip";
import { Color } from "../../types";

export type Detail = { type: "text" | "chip"; color?: Color; value: ReactNode };

interface ItemProps {
  title: string;
  details: Detail[];
  buttonName: string;
  buttonAriaLabel?: string;
}

const Item = ({ title, details, buttonName, buttonAriaLabel }: ItemProps) => {
  const getDetail = (detail: Detail) => {
    switch (detail.type) {
      case "text":
        return (
          <span
            data-h2-font-size="base(caption)"
            data-h2-color="base(gray.darker)"
          >
            {detail.value}
          </span>
        );
      case "chip":
        return <Chip color={detail.color || "primary"}>{detail.value}</Chip>;
      default:
        return null;
    }
  };
  return (
    <div
      data-h2-position="base(relative)"
      data-h2-display="base(grid)"
      data-h2-grid-template-columns="base(3fr 1fr)"
      data-h2-align-items="base(flex-start) p-tablet(center)"
      data-h2-background-color="base(foreground)"
      data-h2-padding="base(x1)"
      data-h2-border-bottom="base:selectors[:not(:last-child)](1px solid)"
      data-h2-border-bottom-color="base:selectors[:not(:last-child)](gray.lighter)"
    >
      <div>
        <p
          data-h2-font-weight="base(bold)"
          data-h2-text-decoration="base(underline)"
          data-h2-margin-bottom="base(x.5)"
        >
          {title}
        </p>
        <div
          data-h2-display="base(flex)"
          data-h2-flex-direction="base(column) p-tablet(row)"
          data-h2-flex-wrap="base(nowrap) p-tablet(wrap)"
          data-h2-align-items="base(flex-start) p-tablet(center)"
          data-h2-gap="base(x.25, x.5)"
        >
          {details.map((detail, index) => {
            const last = details.length;
            return (
              <>
                {getDetail(detail)}
                {index + 1 !== last && (
                  <span
                    aria-hidden
                    data-h2-font-size="base(caption)"
                    data-h2-color="base(gray.darker)"
                    data-h2-display="base(none) p-tablet(block)"
                  >
                    &bull;
                  </span>
                )}
              </>
            );
          })}
        </div>
      </div>
      <Button
        mode="icon_only"
        color="black"
        icon={MagnifyingGlassPlusIcon}
        data-h2-position="base:selectors[::after](absolute)"
        data-h2-content="base:selectors[::after](' ')"
        data-h2-inset="base:selectors[::after](0)"
        data-h2-justify-self="base(end)"
        aria-label={buttonAriaLabel}
      >
        {buttonName}
      </Button>
    </div>
  );
};

type PreviewItemElement = ReactElement<ItemProps>;

export interface RootProps {
  children: PreviewItemElement | Array<PreviewItemElement>;
}

const Root = ({ children, ...rest }: RootProps) => {
  return (
    <div data-h2-margin="base(x1, 0)" {...rest}>
      {Array.isArray(children)
        ? children.map((child) => (
            <>
              {child}
              <Separator space="sm" />
            </>
          ))
        : children}
    </div>
  );
};

export default {
  Root,
  Item,
};
