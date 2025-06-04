import MagnifyingGlassPlusIcon from "@heroicons/react/24/outline/MagnifyingGlassPlusIcon";
import { forwardRef, Fragment, ReactElement, ReactNode } from "react";

import BaseButton, { ButtonProps as BaseButtonProps } from "../Button";
import BaseLink, { LinkProps as BaseLinkProps } from "../Link";
import Chip, { ChipProps } from "../Chip/Chip";
import { ButtonLinkProps, IconType } from "../../types";
import Heading, { HeadingLevel } from "../Heading";

interface MetaDataBase {
  children: ReactNode;
  key: string;
}

interface MetaDataText extends MetaDataBase {
  type: "text";
}

interface MetaDataChip extends MetaDataBase {
  type: "chip";
  color?: ChipProps["color"];
}

export type MetaDataProps = MetaDataChip | MetaDataText;

const MetaData = (props: MetaDataProps) => {
  switch (props.type) {
    case "text":
      return (
        <span className="text-gray-600 dark:text-gray-200">
          {props.children}
        </span>
      );
    case "chip":
      return (
        <span>
          <Chip color={props.color} className="font-normal">
            {props.children}
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
  // NOTE: Should be safe to uncomment and remove specific className when #13689 merged
  // className: "after:absolute inset-0 justify-self-end mr-6 xs:mr-9",
} satisfies ButtonLinkProps;

interface ButtonProps extends BaseButtonProps {
  onClick?: BaseButtonProps["onClick"];
  label: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ onClick, label, ...rest }: ButtonProps, ref) => (
    <BaseButton
      ref={ref}
      {...actionProps}
      className="mr-6 justify-self-end after:absolute after:inset-0 xs:mr-9"
      onClick={onClick}
      {...rest}
    >
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
  <BaseLink
    {...actionProps}
    className="mr-6 justify-self-end after:absolute after:inset-0 xs:mr-9"
    href={href}
    icon={icon ?? actionProps.icon}
  >
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
    <li className="group relative flex items-start justify-between gap-3 not-last:border-b not-last:border-b-gray-100 not-last:pb-6 first:border-t first:border-t-gray-100 first:pt-6 xs:items-center">
      <div className="flex flex-col">
        <Heading
          level={headingAs}
          className="m-0 mb-0.5 inline-block text-base font-bold underline group-has-[a:focus-visible,button:focus-visible]:bg-focus group-has-[a:focus-visible,button:focus-visible]:text-black group-has-[a:hover,button:hover]:text-primary-600 dark:group-has-[a:hover,button:hover]:text-primary-200"
        >
          {title}
        </Heading>
        {children && <div>{children}</div>}
        <div className="mt-4.5 flex flex-col flex-nowrap items-start gap-y-3 text-sm xs:flex-row xs:flex-wrap xs:items-center">
          {metaData.map((data, index) => (
            <Fragment key={data.key}>
              {index > 0 && (
                <span
                  aria-hidden="true"
                  className="mx-3 hidden text-gray-300 xs:inline-block dark:text-gray-200"
                  // eslint-disable-next-line formatjs/no-literal-string-in-jsx
                >
                  &bull;
                </span>
              )}
              <MetaData {...data} />
            </Fragment>
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
    <ul className="flex flex-col gap-y-6 pl-0!" {...rest}>
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
