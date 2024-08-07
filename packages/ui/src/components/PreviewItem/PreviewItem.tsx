import MagnifyingGlassPlusIcon from "@heroicons/react/24/outline/MagnifyingGlassPlusIcon";
import { ReactNode } from "react";
import { CardBasic } from "../Card";

interface PreviewItemProps {
  title: string;
  details: ReactNode[];
}

const PreviewItem = ({ title, details }: PreviewItemProps) => {
  return (
    <div
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
      <MagnifyingGlassPlusIcon
        data-h2-height="base(x.75)"
        data-h2-justify-self="base(end)"
      />
    </div>
  );
};

export default PreviewItem;
