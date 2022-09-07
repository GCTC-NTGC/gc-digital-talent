import React from "react";
import { useIntl } from "react-intl";
import { XMarkIcon } from "@heroicons/react/24/outline";

import Overlay from "./Overlay";
import Content from "./Content";

import "@reach/dialog/styles.css";
import "./dialog.css";

export type Color =
  | "ts-primary"
  | "ts-secondary"
  | "ia-primary"
  | "ia-secondary";

export const colorMap: Record<Color, Record<string, string>> = {
  "ts-primary": {
    "data-h2-background-color": "base(dt-linear)",
    "data-h2-color": "base(dt-white)",
  },
  "ts-secondary": {
    "data-h2-background-color": "base(dt-secondary.light)",
    "data-h2-color": "base(dt-white)",
  },
  "ia-primary": {
    "data-h2-background-color": "base(ia-linear-secondary)",
    "data-h2-color": "base(ia-white)",
  },
  "ia-secondary": {
    "data-h2-background-color": "base(ia-secondary)",
    "data-h2-color": "base(ia-white)",
  },
};

type HeaderProps = Pick<
  DialogProps,
  "title" | "subtitle" | "onDismiss" | "confirmation" | "color"
>;

const Header = ({
  title,
  subtitle,
  onDismiss,
  confirmation = false,
  color = "ia-primary",
}: HeaderProps) => {
  const intl = useIntl();
  return (
    <div
      className={`dialog__header ${
        confirmation ? `dialog__header--confirmation` : null
      }`}
      data-h2-radius="base(s, s, none, none)"
      data-h2-padding="base(x1)"
      data-h2-position="base(relative)"
      {...(!confirmation
        ? { ...colorMap[color] }
        : {
            "data-h2-background-color": "base(dt-white)",
          })}
    >
      <button
        type="button"
        onClick={onDismiss}
        className="dialog-close"
        data-h2-padding="base(x.5)"
        data-h2-position="base(absolute)"
        data-h2-offset="base(x.5, x.5, auto, auto)"
        {...(confirmation
          ? {
              "data-h2-color": "base(dt-black)",
            }
          : {
              "data-h2-color": "base(dt-white)",
            })}
      >
        <span data-h2-visibility="base(invisible)">
          {intl.formatMessage({
            defaultMessage: "Close dialog",
            description: "Text for the button to close a modal dialog.",
          })}
        </span>
        <XMarkIcon className="dialog-close__icon" />
      </button>
      <div
        className="dialog__title dialog__title--standard"
        data-h2-position="base(relative)"
      >
        <h1
          id="dialog-title"
          data-h2-font-weight="base(700)"
          data-h2-font-size="base(h3, 1.1)"
          data-h2-margin="base(0)"
        >
          {title}
        </h1>
        {subtitle && (
          <p
            data-h2-margin="base(x.25, 0, 0, 0)"
            {...(confirmation
              ? {
                  "data-h2-color": "base(dt-primary)",
                }
              : null)}
          >
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

interface FooterProps {
  children: React.ReactNode;
}
const Footer = ({ children }: FooterProps) => (
  <div
    className="dialog__footer"
    data-h2-margin="base(x1.5, 0, 0, 0)"
    data-h2-padding="base(x1.5, 0, 0, 0)"
    data-h2-border="base(top, 1px, solid, dt-gray)"
  >
    {children}
  </div>
);

export interface DialogProps {
  isOpen: boolean;
  color?: Color;
  onDismiss: (e: React.MouseEvent | React.KeyboardEvent) => void;
  title: string;
  subtitle?: string;
  confirmation?: boolean;
  centered?: boolean;
  children: React.ReactNode;
  id?: string;
}

const Dialog = ({
  title,
  subtitle,
  onDismiss,
  isOpen,
  color = "ia-primary",
  confirmation = false,
  centered = false,
  children,
  id,
}: DialogProps) => {
  return (
    <Overlay {...{ isOpen, onDismiss, id }} data-h2-font-family="base(sans)">
      <Content
        aria-labelledby="dialog-title"
        className={centered ? `dialog--centered` : undefined}
      >
        <Header {...{ title, subtitle, onDismiss, confirmation, color }} />
        <div className="dialog__content">{children}</div>
      </Content>
    </Overlay>
  );
};

Dialog.Overlay = Overlay;
Dialog.Content = Content;
Dialog.Header = Header;
Dialog.Footer = Footer;
export default Dialog;
