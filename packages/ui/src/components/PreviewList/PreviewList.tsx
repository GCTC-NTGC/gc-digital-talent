import MagnifyingGlassPlusIcon from "@heroicons/react/24/outline/MagnifyingGlassPlusIcon";
import { forwardRef, ReactElement, ReactNode } from "react";

import BaseButton, { ButtonProps as BaseButtonProps } from "../Button";
import BaseLink, { LinkProps as BaseLinkProps } from "../Link";
import Chip from "../Chip/Chip";
import { ButtonLinkProps, Color, IconType } from "../../types";
import Heading, { HeadingLevel } from "../Heading";

export interface MetaDataProps {
  children: ReactNode;
  color?: Color;
  key: string;
  type: "text" | "chip";
}

const MetaData = ({ children, type, color }: MetaDataProps) => {
  switch (type) {
    case "text":
      return <span data-h2-color="base(black.light)">{children}</span>;
    case "chip":
      return (
        <span>
          <Chip color={color ?? "primary"} data-h2-font-weight="base(400)">
            {children}
          </Chip>
        </span>
      );
    default:
      return null;
  }
};

const actionProps = {
  mode: "icon_only",
  color: "black",
  fontSize: "h5",
  icon: MagnifyingGlassPlusIcon,
  "data-h2-position": "base:selectors[::after](absolute)",
  "data-h2-content": "base:selectors[::after](' ')",
  "data-h2-inset": "base:selectors[::after](0)",
  "data-h2-justify-self": "base(end)",
  "data-h2-margin-right": "base(x1) p-tablet(x1.5)",
} satisfies ButtonLinkProps;

interface ButtonProps extends BaseButtonProps {
  onClick?: BaseButtonProps["onClick"];
  label: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ onClick, label, ...rest }: ButtonProps, ref) => (
    <BaseButton ref={ref} {...actionProps} onClick={onClick} {...rest}>
      {label}
    </BaseButton>
  ),
);

interface LinkProps {
  href: BaseLinkProps["href"];
  label: string;
  icon?: IconType;
}

const Link = ({ href, label, icon }: LinkProps) => (
  <BaseLink {...actionProps} href={href} icon={icon ?? actionProps.icon}>
    {label}
  </BaseLink>
);

interface ItemProps {
  title: React.ReactNode;
  metaData: MetaDataProps[];
  headingAs?: HeadingLevel;
  children?: ReactNode;
  action?: ReactElement<ButtonProps> | ReactElement<LinkProps> | null;
}

const Item = ({
  title,
  headingAs = "h3",
  metaData,
  action,
  children,
}: ItemProps) => {
  return (
    <li
      data-h2-position="base(relative)"
      data-h2-display="base(flex)"
      data-h2-justify-content="base(space-between)"
      data-h2-align-items="base(flex-start) p-tablet(center)"
      data-h2-gap="base(x.5)"
      data-h2-padding-top="base:all:selectors[:first-child](x1)"
      data-h2-border-top="base:all:selectors[:first-child](1px solid gray.light)"
      data-h2-border-bottom="base:all:selectors[:not(:last-child)](1px solid)"
      data-h2-border-bottom-color="base:all:selectors[:not(:last-child)](gray.light)"
      data-h2-transition="base:children[.PreviewList__Heading](transform 200ms ease)"
      data-h2-color="base:selectors[:has(:is(button, a):hover) .PreviewList__Heading](secondary.darker) base:all:selectors[:has(:is(button, a):focus-visible) .PreviewList__Heading](black)"
      data-h2-background-color="base:selectors[:has(:is(button, a):focus-visible) .PreviewList__Heading](focus)"
    >
      <div data-h2-display="base(flex)" data-h2-flex-direction="base(column)">
        <Heading
          className="PreviewList__Heading"
          level={headingAs}
          data-h2-font-size="base(body)"
          data-h2-font-weight="base(700)"
          data-h2-text-decoration="base(underline)"
          data-h2-margin="base(0)"
          data-h2-display="base(inline-block)"
          data-h2-margin-bottom="base(x.15)"
        >
          {title}
        </Heading>
        {children && <div>{children}</div>}
        <div
          data-h2-display="base(flex)"
          data-h2-flex-direction="base(column) p-tablet(row)"
          data-h2-flex-wrap="base(nowrap) p-tablet(wrap)"
          data-h2-align-items="base(flex-start) p-tablet(center)"
          data-h2-gap="base(x.5 0)"
          data-h2-content='p-tablet:children[:not(:last-child)::after]("•")'
          data-h2-color="p-tablet:children[::after](black.lighter)"
          data-h2-margin="p-tablet:children[:not(:last-child)::after](0 x.5)"
          data-h2-margin-top="base(x.75)"
          data-h2-font-size="base(caption)"
        >
          {metaData.map((data) => (
            <MetaData {...data} key={data.key} />
          ))}
        </div>
      </div>
      {action}
    </li>
  );
};

type PreviewItemElement = ReactElement<ItemProps>;

export interface RootProps {
  children: PreviewItemElement | PreviewItemElement[];
}

const Root = ({ children, ...rest }: RootProps) => {
  return (
    <ul
      data-h2-display="base(flex)"
      data-h2-flex-direction="base(column)"
      data-h2-row-gap="base(x1)"
      data-h2-padding-left="base(0)"
      data-h2-padding-bottom="base:children[>:last-child](0) base:children[>](x1)"
      {...rest}
    >
      {children}
    </ul>
  );
};

export default {
  Root,
  Item,
  Button,
  Link,
};
