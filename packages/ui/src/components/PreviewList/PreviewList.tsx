import MagnifyingGlassPlusIcon from "@heroicons/react/24/outline/MagnifyingGlassPlusIcon";
import { ReactElement, ReactNode } from "react";
import uniqueId from "lodash/uniqueId";

import Button from "../Button";
import Chip from "../Chip/Chip";
import { Color } from "../../types";
import Heading, { HeadingLevel } from "../Heading";

export type MetaDataProps = {
  type: "text" | "chip";
  color?: Color;
  children: ReactNode;
};

const MetaData = ({ children, type, color }: MetaDataProps) => {
  switch (type) {
    case "text":
      return <span data-h2-color="base(gray.darker)">{children}</span>;
    case "chip":
      return (
        <span>
          <Chip color={color || "primary"} data-h2-font-weight="base=(400)">
            {children}
          </Chip>
        </span>
      );
    default:
      return null;
  }
};

interface ItemProps {
  title: string;
  metaData: MetaDataProps[];
  buttonName: string;
  headingAs?: HeadingLevel;
  buttonAriaLabel?: string;
}

const Item = ({
  title,
  headingAs = "h3",
  metaData,
  buttonName,
  buttonAriaLabel,
}: ItemProps) => {
  return (
    <li
      data-h2-position="base(relative)"
      data-h2-display="base(flex)"
      data-h2-justify-content="base(space-between)"
      data-h2-align-items="base(flex-start) p-tablet(center)"
      data-h2-gap="base(x.25)"
      data-h2-padding="base(x1 0)"
      data-h2-border-bottom="base:all:selectors[:not(:last-child)](1px solid)"
      data-h2-border-bottom-color="base:all:selectors[:not(:last-child)](gray.lighter)"
    >
      <div>
        <Heading
          level={headingAs}
          data-h2-font-size="base(body)"
          data-h2-font-weight="base(700)"
          data-h2-text-decoration="base(underline)"
          data-h2-margin-bottom="base(x.5)"
          data-h2-margin-top="base(0)"
        >
          {title}
        </Heading>
        <div
          data-h2-display="base(flex)"
          data-h2-flex-direction="base(column) p-tablet(row)"
          data-h2-flex-wrap="base(nowrap) p-tablet(wrap)"
          data-h2-align-items="base(flex-start) p-tablet(center)"
          data-h2-gap="base(x.5 0)"
          data-h2-content='p-tablet:children[:not(:last-child)::after]("•")'
          data-h2-color="p-tablet:children[::after](gray.darker)"
          data-h2-margin="p-tablet:children[:not(:last-child)::after](0 x.5)"
          data-h2-font-size="base(caption)"
        >
          {metaData.map((data) => (
            <MetaData key={uniqueId()} {...data} />
          ))}
        </div>
      </div>
      <Button
        mode="icon_only"
        color="black"
        icon={MagnifyingGlassPlusIcon}
        data-h2-height="base(x.75)"
        data-h2-width="base(x.75)"
        data-h2-position="base:selectors[::after](absolute)"
        data-h2-content="base:selectors[::after](' ')"
        data-h2-inset="base:selectors[::after](0)"
        data-h2-justify-self="base(end)"
        aria-label={buttonAriaLabel}
      >
        {buttonName}
      </Button>
    </li>
  );
};

type PreviewItemElement = ReactElement<ItemProps>;

export interface RootProps {
  children: PreviewItemElement | Array<PreviewItemElement>;
}

const Root = ({ children, ...rest }: RootProps) => {
  return (
    <ul data-h2-margin="base(x1 0)" data-h2-padding="base(0 x1)" {...rest}>
      {children}
    </ul>
  );
};

export default {
  Root,
  Item,
};
