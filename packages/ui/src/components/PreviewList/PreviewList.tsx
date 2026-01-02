import MagnifyingGlassPlusIcon from "@heroicons/react/24/outline/MagnifyingGlassPlusIcon";
import { forwardRef, Fragment, ReactElement, ReactNode } from "react";
import { tv, VariantProps } from "tailwind-variants";

import BaseButton, {
  IconButtonProps as BaseButtonProps,
  IconButtonProps,
} from "../Button/IconButton";
import BaseLink, { IconLinkProps as BaseLinkProps } from "../Link/IconLink";
import Chip, { ChipProps } from "../Chip/Chip";
import Heading, { HeadingLevel } from "../Heading";
import { BaseIconButtonLinkProps } from "../../utils/btnStyles";
import { UNICODE_CHAR } from "../../utils/unicode";
import { deriveTimelinePlacement } from "./utils";

const listItem = tv({
  base: "group/item not-last:pb-6",
  variants: {
    mode: {
      default:
        "pt-6 not-last:border-b not-last:border-b-gray-100 first:border-t first:border-t-gray-100",
      // dot radius is 1.2 so ml-2.7 = 1.5 + 1.2 and pl-4.2 = 3 + 1.2
      experience:
        "relative ml-[calc(var(--spacing)*2.7)] pl-[calc(var(--spacing)*4.2)]",
    },
    placement: {
      // transparent from 0 to space-3, primary from space-3 to 100%
      top: "border-l [border-image:linear-gradient(to_bottom,transparent_0_calc(var(--spacing)*3),var(--color-primary-600)_calc(var(--spacing)*3)_100%)_1_100%] dark:[border-image:linear-gradient(to_bottom,transparent_0_calc(var(--spacing)*3),var(--color-primary-200)_calc(var(--spacing)*3)_100%)_1_100%]",
      middle: "border-l border-l-primary-600 dark:border-l-primary-200",
      bottom:
        // primary from 0 to space-3, transparent from space-3 to 100%
        "border-l [border-image:linear-gradient(to_bottom,var(--color-primary-600)_0_calc(var(--spacing)*3),transparent_calc(var(--spacing)*3)_100%)_1_100%] dark:[border-image:linear-gradient(to_bottom,var(--color-primary-200)_0_calc(var(--spacing)*3),transparent_calc(var(--spacing)*3)_100%)_1_100%]",
      single: "",
    },
  },
});

const heading = tv({
  base: "m-0 inline-block text-base underline group-has-[a:focus-visible,button:focus-visible]/item:bg-focus group-has-[a:focus-visible,button:focus-visible]/item:text-black lg:text-base",
  variants: {
    mode: {
      default:
        "font-bold group-has-[a:hover,button:hover]/item:text-primary-600 dark:group-has-[a:hover,button:hover]/item:text-primary-200",
      experience:
        // packages/ui/src/utils/btnStyles.ts text->primary
        "text-primary-600 group-has-[a:hover,button:hover]/item:text-primary-700 dark:text-primary-200 dark:group-has-[a:hover,button:hover]/item:text-primary-100",
    },
  },
});

const actionBaseButton = tv({
  base: "justify-self-end after:absolute after:inset-0 after:content-['']",
  variants: {
    mode: {
      default: "mr-6 xs:mr-9",
      experience: "mr-6 xs:mr-12",
    },
  },
});

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
  color: "black",
  icon: MagnifyingGlassPlusIcon,
} satisfies IconButtonProps;

interface ButtonProps extends Omit<BaseButtonProps, "icon"> {
  onClick?: BaseButtonProps["onClick"];
  mode?: VariantProps<typeof actionBaseButton>["mode"];
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ onClick, label, mode = "default", ...rest }: ButtonProps, ref) => (
    <BaseButton
      ref={ref}
      className={actionBaseButton({ mode: mode })}
      {...actionProps}
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
  icon?: BaseIconButtonLinkProps["icon"];
  children?: ReactNode;
}

const Link = ({ href, icon, label }: LinkProps) => (
  <BaseLink {...actionProps} href={href} icon={icon ?? actionProps.icon}>
    {label}
  </BaseLink>
);

interface ContentProps {
  title: React.ReactNode;
  metaData: MetaDataProps[];
  headingAs?: HeadingLevel;
  children?: ReactNode;
  action?: ReactElement<ButtonProps> | ReactElement<LinkProps> | null;
  mode?: VariantProps<typeof heading>["mode"];
}

// An internal component responsible for displaying the content of each list item.
const Content = ({
  title,
  headingAs = "h3",
  metaData,
  action,
  children,
  mode = "default",
}: ContentProps) => {
  return (
    <div className="relative flex items-start justify-between gap-3 xs:items-center">
      <div className="flex flex-col gap-1.5">
        <Heading level={headingAs} className={heading({ mode })}>
          {title}
        </Heading>
        {children && <div>{children}</div>}
        <div className="flex flex-col flex-nowrap items-start gap-1.5 text-sm xs:flex-row xs:flex-wrap xs:items-center">
          {metaData.map((data, index) => {
            const { key, ...rest } = data;
            return (
              <Fragment key={data.key}>
                {index > 0 && (
                  <span
                    className="hidden text-gray-300 xs:inline-block dark:text-gray-200"
                    aria-hidden
                  >
                    {UNICODE_CHAR.BULLET}
                  </span>
                )}
                <MetaData key={key} {...rest} />
              </Fragment>
            );
          })}
        </div>
      </div>
      {action}
    </div>
  );
};

interface DefaultWrapperProps {
  children: React.ReactNode;
}

// The original list item decoration around each content item
const DefaultWrapper = ({ children }: DefaultWrapperProps) => {
  return <li className={listItem({ mode: "default" })}>{children}</li>;
};

interface TimelineWrapperProps {
  index: number;
  groupLength: number;
  children: React.ReactNode;
}

// The timeline list item decoration around each content item
const TimelineWrapper = ({
  index,
  groupLength,
  children,
}: TimelineWrapperProps) => {
  const placement = deriveTimelinePlacement(index, groupLength) ?? "single";
  return (
    <li className={listItem({ mode: "experience", placement: placement })}>
      {/* top 1.7 = 0.5 + 1.2, left negative 1.2 from radius + 0.5 px to go to middle of 1px border */}
      <svg className="absolute top-[calc(var(--spacing)*1.7)] -left-[calc((var(--spacing)*1.2)+0.5px)]">
        <circle
          className="fill-primary-600 dark:fill-primary-200"
          style={{
            cx: "calc(var(--spacing)*1.2)",
            cy: "calc(var(--spacing)*1.2)",
            r: "calc(var(--spacing)*1.2)",
          }}
        />
      </svg>
      {children}
    </li>
  );
};

// When mode is default, other props are not allowed
interface DefaultItemProps extends ContentProps {
  mode?: "default";
  index?: never;
  groupLength?: never;
}

// when mode is experience, index and groupLength are mandatory
interface ExperienceItemProps extends ContentProps {
  mode: "experience";
  index: number;
  groupLength: number;
}

type ItemProps = DefaultItemProps | ExperienceItemProps;

// Each individual list item composed of a list item wrapper containing a content item
const Item = ({ mode, index, groupLength, ...rest }: ItemProps) => {
  if (mode == "experience") {
    // for experience, wrap them with the timeline list item wrapper
    return (
      <TimelineWrapper index={index} groupLength={groupLength}>
        <Content mode={mode} {...rest} />
      </TimelineWrapper>
    );
  }

  // for everything else, wrap them with the default list item wrapper
  return (
    <DefaultWrapper>
      <Content mode={mode} {...rest} />
    </DefaultWrapper>
  );
};

type PreviewItemElement = ReactElement<ItemProps>;

export interface RootProps {
  children: PreviewItemElement | PreviewItemElement[];
}

const Root = ({ children, ...rest }: RootProps) => {
  return (
    <ul className="flex flex-col pl-0!" {...rest}>
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
