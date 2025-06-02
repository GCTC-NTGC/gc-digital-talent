/**
 * Documentation: https://www.radix-ui.com/docs/primitives/components/accordion
 */
import ChevronRightIcon from "@heroicons/react/24/solid/ChevronRightIcon";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import {
  ComponentPropsWithoutRef,
  forwardRef,
  ElementRef,
  ReactNode,
  Fragment,
} from "react";

import { assertUnreachable } from "@gc-digital-talent/helpers";

import type { Color, HeadingRank, IconType } from "../../types";
import { AccordionMode } from "./types";
import Chip, { ChipVariants } from "../Chip/Chip";
import Link from "../Link";
import Button, { ButtonProps } from "../Button";
import MetaDataStatusItem, {
  AccordionMetaDataStatusItemProps,
} from "./MetaDataStatusItem";

type RootProps = ComponentPropsWithoutRef<typeof AccordionPrimitive.Root> & {
  mode?: AccordionMode;
  size?: "sm" | "md" | "lg";
};

const Root = forwardRef<ElementRef<typeof AccordionPrimitive.Root>, RootProps>(
  ({ mode = "simple", size = "md", ...rest }, forwardedRef) => {
    let baseStyles: Record<string, string> = {
      "data-h2-height":
        "base:selectors[>.Accordion__Item > .Accordion__Header .Accordion__Icon](x.8)",
      "data-h2-width":
        "base:selectors[>.Accordion__Item > .Accordion__Header .Accordion__Icon](x.8)",
      "data-h2-stroke-width":
        "base:selectors[>.Accordion__Item > .Accordion__Header .Accordion__Icon path](1.5)",
      "data-h2-font-size":
        "base:selectors[>.Accordion__Item > .Accordion__Header .Accordion__Heading](h6, 1)",
    };

    let paddingStyles: Record<string, string> =
      mode === "card"
        ? {
            "data-h2-padding": `
              base:selectors[>.Accordion__Item > .Accordion__Header .Accordion__Trigger](x1)
              base:selectors[>.Accordion__Item > .Accordion__Content](0 x1 x1 x2.3)
          `,
            "data-h2-margin": `
              base:selectors[>.Accordion__Item > .Accordion__MetaData](-x.5 0 x1 x2.3)
              p-tablet:selectors[>.Accordion__Item > .Accordion__MetaData](-x1 0 x1 x2.3)
              base:selectors[>.Accordion__Item > .Accordion__Header .Accordion__Context](x.5 0 0 x1.3)
              p-tablet:selectors[>.Accordion__Item > .Accordion__Header .Accordion__Context](0 0 0 0)
          `,
          }
        : {
            "data-h2-padding": `
              base:selectors[>.Accordion__Item > .Accordion__Header .Accordion__Trigger](x.5 0)
              base:selectors[>.Accordion__Item > .Accordion__Content](0 x1 x1 x1.3)
          `,
          };

    if (size === "sm") {
      baseStyles = {
        "data-h2-height":
          "base:selectors[>.Accordion__Item > .Accordion__Header .Accordion__Icon](x.75)",
        "data-h2-width":
          "base:selectors[>.Accordion__Item > .Accordion__Header .Accordion__Icon](x.75)",
        "data-h2-stroke-width":
          "base:selectors[>.Accordion__Item > .Accordion__Header .Accordion__Icon path](1)",
        "data-h2-font-size":
          "base:selectors[>.Accordion__Item > .Accordion__Header .Accordion__Heading](body, 1)",
      };

      paddingStyles =
        mode === "card"
          ? {
              "data-h2-padding": `
              base:selectors[>.Accordion__Item > .Accordion__Header .Accordion__Trigger](x1)
              base:selectors[>.Accordion__Item > .Accordion__Content](0 x1 x1 x2.25)
          `,
              "data-h2-margin": `
              base:selectors[>.Accordion__Item > .Accordion__MetaData](-x.5 0 x1 x2.25)
              p-tablet:selectors[>.Accordion__Item > .Accordion__MetaData](-x1 0 x1 x2.25)
              base:selectors[>.Accordion__Item > .Accordion__Header .Accordion__Context](x.5 0 0 x1.25)
              p-tablet:selectors[>.Accordion__Item > .Accordion__Header .Accordion__Context](0 0 0 0)
          `,
            }
          : {
              "data-h2-padding": `
              base:selectors[>.Accordion__Item > .Accordion__Header .Accordion__Trigger](x.5 0)
              base:selectors[>.Accordion__Item > .Accordion__Content](0 x1 x1 x1.25)
          `,
            };
    }

    if (size === "lg") {
      baseStyles = {
        "data-h2-height":
          "base:selectors[>.Accordion__Item > .Accordion__Header .Accordion__Icon](x.95)",
        "data-h2-width":
          "base:selectors[>.Accordion__Item > .Accordion__Header .Accordion__Icon](x.95)",
        "data-h2-stroke-width":
          "base:selectors[>.Accordion__Item > .Accordion__Header .Accordion__Icon path](1)",
        "data-h2-font-size":
          "base:selectors[>.Accordion__Item > .Accordion__Header .Accordion__Heading](h5, 1)",
      };

      paddingStyles =
        mode === "card"
          ? {
              "data-h2-padding": `
              base:selectors[>.Accordion__Item > .Accordion__Header .Accordion__Trigger](x1)
              base:selectors[>.Accordion__Item > .Accordion__Content](0 x1 x1 x2.45)
            `,
              "data-h2-margin": `
              base:selectors[>.Accordion__Item > .Accordion__MetaData](-x.5 0 x1 x2.45)
              p-tablet:selectors[>.Accordion__Item > .Accordion__MetaData](-x1 0 x1 x2.45)
              base:selectors[>.Accordion__Item > .Accordion__Header .Accordion__Context](x.5 0 0 x1.45)
              p-tablet:selectors[>.Accordion__Item > .Accordion__Header .Accordion__Context](0 0 0 0)
            `,
            }
          : {
              "data-h2-padding": `
          base:selectors[>.Accordion__Item > .Accordion__Header .Accordion__Trigger](x.5 0)
          base:selectors[>.Accordion__Item > .Accordion__Content](0 x1 x1 x1.45)
      `,
            };
    }

    if (mode === "card") {
      baseStyles = {
        ...baseStyles,
        // custom out-of-system colour used for even dark items: Colors/Background/Manual/Dark-30:Foreground-Light-50
        "data-h2-background-color": `
          base:selectors[>.Accordion__Item:nth-child(odd)](foreground)

          base:selectors[>.Accordion__Item:nth-child(even)](background.dark.3)
          base:dark:selectors[>.Accordion__Item:nth-child(even)](rgba(53, 57, 75, .5))
        `,
        "data-h2-border-top": `
          base:selectors[>.Accordion__Item + .Accordion__Item](thin solid black.darkest.2)
          base:dark:selectors[>.Accordion__Item + .Accordion__Item](thin solid black.darkest.5)
        `,
        "data-h2-overflow": "base(hidden)",
        "data-h2-radius": "base(s)",
        "data-h2-shadow": "base(l)",
      };
    }

    return (
      <AccordionPrimitive.Root
        ref={forwardedRef}
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column)"
        {...baseStyles}
        {...paddingStyles}
        {...rest}
      />
    );
  },
);

const Item = forwardRef<
  ElementRef<typeof AccordionPrimitive.Item>,
  ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>((props, forwardedRef) => (
  <AccordionPrimitive.Item
    className="Accordion__Item"
    data-h2-overflow="base(hidden)"
    ref={forwardedRef}
    {...props}
  />
));

interface AccordionHeaderProps
  extends ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> {
  as?: HeadingRank | "p";
  icon?: IconType;
  subtitle?: ReactNode;
  context?: ReactNode;
  titleProps?: ComponentPropsWithoutRef<typeof AccordionPrimitive.Header>;
}

const Trigger = forwardRef<
  ElementRef<typeof AccordionPrimitive.Trigger>,
  AccordionHeaderProps
>(
  (
    { as = "h2", subtitle, icon, context, titleProps, children, ...rest },
    forwardedRef,
  ) => {
    const Heading = as;
    const Icon = icon;

    return (
      <AccordionPrimitive.Header asChild {...titleProps}>
        <div className="Accordion__Header">
          <AccordionPrimitive.Trigger
            ref={forwardedRef}
            className="Accordion__Trigger"
            data-h2-align-items="base(flex-start)"
            data-h2-background-color="base(transparent) base:focus-visible(focus)"
            data-h2-color="base(black) base:focus-visible(black) base:children[.Accordion__Subtitle](black.light) base:all:focus-visible:children[*](black) base:children[.Accordion__Chevron](black.light) base:focus-visible:children[.Accordion__Chevron](black)"
            data-h2-cursor="base(pointer)"
            data-h2-display="base(flex)"
            data-h2-flex-wrap="base(wrap) p-tablet(nowrap)"
            data-h2-gap="base(0, x.5)"
            data-h2-outline="base(none)"
            data-h2-justify-content="base(flex-start)"
            data-h2-text-align="base(left)"
            data-h2-width="base(100%)"
            data-h2-shadow="base:focus-visible:children[.Accordion__Chevron](focus)"
            data-h2-transform="
            base:children[.Accordion__Icon--chevron](rotate(0deg))
            base:selectors[[data-state='open']]:children[.Accordion__Icon--chevron](rotate(90deg))"
            {...rest}
          >
            <span
              data-h2-align-items="base(flex-start)"
              data-h2-display="base(flex)"
              data-h2-gap="base(0, x.5)"
              data-h2-flex-grow="base(1)"
              {...(context
                ? { "data-h2-margin-bottom": "base(x.5) p-tablet(0)" }
                : {})}
            >
              <span
                className="Accordion__Chevron"
                data-h2-display="base(flex)"
                data-h2-align-items="base(center)"
                data-h2-flex-shrink="base(0)"
              >
                <ChevronRightIcon
                  className="Accordion__Icon Accordion__Icon--chevron"
                  data-h2-transition="base(transform 150ms ease)"
                />
              </span>

              <span
                data-h2-flex-grow="base(1)"
                data-h2-display="base(flex)"
                data-h2-flex-direction="base(column)"
                data-h2-gap="base(x.15 0)"
              >
                <Heading
                  className="Accordion__Heading"
                  data-h2-margin="base(0)"
                  data-h2-font-weight="base(700)"
                >
                  {children}
                </Heading>
                {subtitle && (
                  <span
                    className="Accordion__Subtitle"
                    data-h2-font-size="base(caption)"
                  >
                    {subtitle}
                  </span>
                )}
              </span>
            </span>

            {(!!Icon || !!context) && (
              <span
                className="Accordion__Context"
                data-h2-align-items="base(center)"
                data-h2-display="base(flex)"
                data-h2-gap="base(0 x.25)"
                data-h2-margin-left="base(x1.30) p-tablet(0)"
              >
                {context && (
                  <span data-h2-font-size="base(body)">{context}</span>
                )}
                {Icon && <Icon className="Accordion__Icon" />}
              </span>
            )}
          </AccordionPrimitive.Trigger>
        </div>
      </AccordionPrimitive.Header>
    );
  },
);

// every item must have a key and type
interface AccordionMetaDataText {
  key: string;
  children: ReactNode;
  type: "text";
}

interface AccordionMetaDataButton {
  key: string;
  type: "button";
  color?: ButtonProps["color"];
  onClick?: () => void;
  children: ReactNode;
}

interface AccordionMetaDataLink {
  key: string;
  type: "link";
  color?: Color;
  children: ReactNode;
  href?: string;
}

interface AccordionMetaDataChip {
  key: string;
  type: "chip";
  children: ReactNode;
  color?: ChipVariants["color"];
}

// status items have their own prop interface
interface AccordionMetaDataStatusItem extends AccordionMetaDataStatusItemProps {
  key: string;
  type: "status_item";
}

export interface AccordionMetaDataProps {
  metadata: (
    | AccordionMetaDataText
    | AccordionMetaDataButton
    | AccordionMetaDataLink
    | AccordionMetaDataChip
    | AccordionMetaDataStatusItem
  )[];
}

export type AccordionMetaData = AccordionMetaDataProps["metadata"];

const MetaData = ({ metadata }: AccordionMetaDataProps) => {
  const metadataLength = metadata.length;
  const separatorSpan = (
    <span
      data-h2-display="base(none) p-tablet(inline-block)"
      data-h2-color="base(black.lighter)"
      data-h2-margin="p-tablet(0 x.5)"
      // eslint-disable-next-line formatjs/no-literal-string-in-jsx
    >
      &bull;
    </span>
  );

  return (
    <div
      className="Accordion__MetaData"
      data-h2-display="base(flex)"
      data-h2-flex-direction="base(column) p-tablet(row)"
      data-h2-flex-wrap="base(nowrap) p-tablet(wrap)"
      data-h2-align-items="base(flex-start) p-tablet(center)"
      data-h2-gap="base(x.5 0)"
      data-h2-margin="base(0 0 x.5 x1.30) p-tablet(0 0 x.5 x1.30)"
      data-h2-font-size="base(caption)"
      data-h2-font-weight="base(bold)"
    >
      {metadata.map((datum, index) => {
        switch (datum.type) {
          case "text":
            return index + 1 === metadataLength ? (
              <span
                data-h2-color="base(black.light)"
                data-h2-font-weight="base(400)"
                key={datum.key}
              >
                {datum.children}
              </span>
            ) : (
              <Fragment key={datum.key}>
                <span
                  data-h2-color="base(black.light)"
                  data-h2-font-weight="base(400)"
                >
                  {datum.children}
                </span>
                {separatorSpan}
              </Fragment>
            );
          case "chip":
            return index + 1 === metadataLength ? (
              <span key={datum.key}>
                <Chip color={datum?.color}>{datum.children}</Chip>
              </span>
            ) : (
              <Fragment key={datum.key}>
                <span>
                  <Chip color={datum?.color}>{datum.children}</Chip>
                </span>
                {separatorSpan}
              </Fragment>
            );
          case "button":
            return index + 1 === metadataLength ? (
              <Button
                mode="text"
                color={datum.color ?? "primary"}
                fontSize="caption"
                data-h2-font-weight="base(bold)"
                onClick={datum.onClick}
                key={datum.key}
              >
                {datum.children}
              </Button>
            ) : (
              <Fragment key={datum.key}>
                <Button
                  mode="text"
                  color={datum.color ?? "primary"}
                  size="sm"
                  data-h2-font-weight="base(bold)"
                  onClick={datum.onClick}
                >
                  {datum.children}
                </Button>
                {separatorSpan}
              </Fragment>
            );
          case "link":
            return index + 1 === metadataLength ? (
              <Link
                color={datum.color ?? "primary"}
                href={datum.href}
                fontSize="caption"
                data-h2-font-weight="base(bold)"
                key={datum.key}
              >
                {datum.children}
              </Link>
            ) : (
              <Fragment key={datum.key}>
                <Link
                  color={datum.color ?? "primary"}
                  href={datum.href}
                  fontSize="caption"
                  data-h2-font-weight="base(bold)"
                >
                  {datum.children}
                </Link>
                {separatorSpan}
              </Fragment>
            );
          // just wrap with a key and display "as-is"
          case "status_item":
            return (
              <Fragment key={datum.key}>
                <MetaDataStatusItem label={datum.label} status={datum.status} />
                {index + 1 < metadataLength ? separatorSpan : null}
              </Fragment>
            );
          default:
            return assertUnreachable(datum);
        }
      })}
    </div>
  );
};

const Content = forwardRef<
  ElementRef<typeof AccordionPrimitive.Content>,
  ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ children, ...rest }, forwardedRef) => (
  <AccordionPrimitive.Content
    className="Accordion__Content"
    data-h2-color="base(black)"
    ref={forwardedRef}
    {...rest}
  >
    {children}
  </AccordionPrimitive.Content>
));

/**
 * @name Accordion
 * @desc A vertically stacked set of interactive headings that each reveal an associated section of content.
 * @see [Documentation](https://www.radix-ui.com/docs/primitives/components/accordion)
 */
const Accordion = {
  /**
   * @name Root
   * @desc Contains all the parts of an accordion.
   * @see [Documentation](https://www.radix-ui.com/docs/primitives/components/accordion#root)
   */
  Root,
  /**
   * @name Item
   * @desc Contains all the parts of a collapsible section.
   * @see [Documentation](https://www.radix-ui.com/docs/primitives/components/accordion#item)
   */
  Item,
  /**
   * @name Trigger
   * @desc Toggles the collapsed state of its associated item. It should be nested inside of an Accordion.Header.
   * @see [Documentation](https://www.radix-ui.com/docs/primitives/components/accordion#trigger)
   */
  Trigger,
  /**
   * @name MetaData
   * @desc Adds metadata below trigger.
   */
  MetaData,
  /**
   * @name Content
   * @desc Contains the collapsible content for an item.
   * @see [Documentation](https://www.radix-ui.com/docs/primitives/components/accordion#content)
   */
  Content,
};

export default Accordion;
