import MagnifyingGlassPlusIcon from "@heroicons/react/24/outline/MagnifyingGlassPlusIcon";
import { forwardRef, Fragment, ReactElement, ReactNode } from "react";
import { tv } from "tailwind-variants";

import BaseButton, {
  IconButtonProps as BaseButtonProps,
  IconButtonProps,
} from "../Button/IconButton";
import BaseLink, { IconLinkProps as BaseLinkProps } from "../Link/IconLink";
import Chip, { ChipProps } from "../Chip/Chip";
import Heading, { HeadingLevel } from "../Heading";
import { BaseIconButtonLinkProps } from "../../utils/btnStyles";
import { UNICODE_CHAR } from "../../utils/unicode";

type ItemMode = "default" | "experience-card";

const listItem = tv({
  base: "group/item relative flex items-start justify-between gap-3 not-last:border-b not-last:border-b-gray-100 not-last:pb-6 first:border-t first:border-t-gray-100 first:pt-6 xs:items-center",
  variants: {
    mode: {
      default: "",
      "experience-card": "",
    },
  },
});

const heading = tv({
  base: "m-0 mb-0.5 inline-block text-base underline group-has-[a:focus-visible,button:focus-visible]/item:bg-focus group-has-[a:focus-visible,button:focus-visible]/item:text-black lg:text-base",
  variants: {
    mode: {
      default:
        "font-bold group-has-[a:hover,button:hover]/item:text-primary-600 dark:group-has-[a:hover,button:hover]/item:text-primary-200",
      "experience-card":
        // packages/ui/src/utils/btnStyles.ts text->primary
        "text-primary-600 group-has-[a:hover,button:hover]/item:text-primary-700 dark:text-primary-200 dark:group-has-[a:hover,button:hover]/item:text-primary-100",
    },
  },
});

const root = tv({
  base: "flex flex-col pl-0!",
  variants: {
    mode: {
      default: "gap-y-6",
      timeline: "gap-0",
    },
  },
});

const timelineWrapper = tv({
  base: "relative ml-1.5 pl-3 not-last:pb-6",
  variants: {
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
  className:
    "after:content-[''] after:absolute after:inset-0 justify-self-end mr-6 xs:mr-9",
} satisfies IconButtonProps;

interface ButtonProps extends Omit<BaseButtonProps, "icon"> {
  onClick?: BaseButtonProps["onClick"];
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
  icon?: BaseIconButtonLinkProps["icon"];
  children?: ReactNode;
}

const Link = ({ href, icon, label }: LinkProps) => (
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
  mode: ItemMode;
}

const Item = ({
  title,
  headingAs = "h3",
  metaData,
  action,
  children,
  mode,
}: ItemProps) => {
  return (
    <li className={listItem({ mode })}>
      <div className="flex flex-col">
        <Heading level={headingAs} className={heading({ mode })}>
          {title}
        </Heading>
        {children && <div>{children}</div>}
        <div className="mt-4.5 flex flex-col flex-nowrap items-start gap-y-3 text-sm xs:flex-row xs:flex-wrap xs:items-center">
          {metaData.map((data, index) => {
            const { key, ...rest } = data;
            return (
              <Fragment key={data.key}>
                {index > 0 && (
                  <span
                    className="mx-3 hidden text-gray-300 xs:inline-block dark:text-gray-200"
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
    </li>
  );
};

type PreviewItemElement = ReactElement<ItemProps>;

export interface RootProps {
  mode?: "default" | "timeline";
  children: PreviewItemElement | PreviewItemElement[];
}

const Root = ({ mode = "default", children, ...rest }: RootProps) => {
  return (
    <ul className={root({ mode })} {...rest}>
      {children}
    </ul>
  );
};

interface TimelineWrapperProps {
  placement: "top" | "middle" | "bottom" | "single";
  children: React.ReactNode;
}

const TimelineWrapper = ({ placement, children }: TimelineWrapperProps) => {
  return (
    <div className={timelineWrapper({ placement })}>
      <svg className="absolute top-1.75 -left-1.25 h-2.5 w-2.5">
        <circle
          className="fill-primary-600 dark:fill-primary-200"
          style={{
            cx: "calc(var(--spacing)*1.25)",
            cy: "calc(var(--spacing)*1.25)",
            r: "calc(var(--spacing)*1.25)",
          }}
        />
      </svg>
      {children}
    </div>
  );
};

export default {
  Root,
  Item,
  Button,
  Link,
  TimelineWrapper,
};
