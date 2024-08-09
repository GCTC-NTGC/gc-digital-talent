import MagnifyingGlassPlusIcon from "@heroicons/react/24/outline/MagnifyingGlassPlusIcon";
import { ReactNode } from "react";
import { CardBasic } from "../Card";
import Button from "../Button";

export interface PreviewItemProps {
  title: string;
  details: ReactNode[];
  buttonName: string;
}

const PreviewItem = ({ title, details, buttonName }: PreviewItemProps) => {
  return (
    <div
      data-h2-position="base(relative)"
      data-h2-display="base(grid)"
      data-h2-grid-template-columns="base(3fr 1fr)"
      data-h2-align-items="base(center)"
      data-h2-background-color="base(foreground)"
      data-h2-padding="base(x1)"
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
          data-h2-flex-wrap="base(wrap)"
          data-h2-align-items="base(center)"
          data-h2-gap="base(x.25, x.5)"
        >
          {details.map((detail, index) => {
            const last = details.length;
            return (
              <>
                <span
                  data-h2-font-size="base(caption)"
                  data-h2-color="base(grays)"
                >
                  {detail}
                </span>
                {index + 1 !== last && <span aria-hidden>&bull;</span>}
              </>
            );
          })}
        </div>
      </div>
      <Button
        mode="icon_only"
        icon={MagnifyingGlassPlusIcon}
        data-h2-position="base:selectors[::after](absolute)"
        data-h2-content="base:selectors[::after](' ')"
        data-h2-inset="base:selectors[::after](0)"
        data-h2-justify-self="base(end)"
      >
        {buttonName}
      </Button>
    </div>
  );
};

export default PreviewItem;
