/* eslint-disable formatjs/no-literal-string-in-jsx */
import XCircleIcon from "@heroicons/react/20/solid/XCircleIcon";
import { useIntl } from "react-intl";
import {
  createContext,
  ComponentPropsWithoutRef,
  forwardRef,
  ElementRef,
  useState,
  useMemo,
  HTMLProps,
  ReactNode,
  useContext,
} from "react";

import { uiMessages } from "@gc-digital-talent/i18n";

import Separator from "../Separator";
import {
  styleMap,
  iconStyleMap,
  iconMap,
  dismissStyleMap,
  getAlertLevelTitle,
} from "./utils";
import { AlertHeadingLevel, AlertType } from "./types";

interface AlertContextValue {
  type: AlertType;
}

const AlertContext = createContext<AlertContextValue | undefined>(undefined);

/**
 * Props that can be passed to an `<Alert.Root />`
 *
 * @interface AlertProps
 * @member {AlertType} type the category of information displayed in the alert
 * @member {boolean} dismissible controls if the user can dismiss the alert or not
 * @member {boolean} live adds [role="alert"] forcing the alert to be read out to assistive technology
 * @member {function} onDismiss execute code when the alert is dismissed
 */
export interface AlertProps extends ComponentPropsWithoutRef<"div"> {
  type: AlertType;
  dismissible?: boolean;
  live?: boolean; // REF: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/alert_role
  onDismiss?: () => void;
}

const Alert = forwardRef<ElementRef<"div">, AlertProps>(
  (
    { type, onDismiss, live = true, dismissible = false, children, ...rest },
    forwardedRef,
  ) => {
    const intl = useIntl();
    const [isOpen, setIsOpen] = useState(true);
    const Icon = iconMap[type];

    const close = () => {
      setIsOpen((currentIsOpen) => !currentIsOpen);
      if (onDismiss) {
        onDismiss();
      }
    };

    const state = useMemo(
      () => ({
        type,
      }),
      [type],
    );

    return (
      <AlertContext.Provider value={state}>
        {isOpen ? (
          <div
            ref={forwardedRef}
            className={`Alert Alert--${type}`}
            data-h2-display="base(flex)"
            data-h2-flex-direction="base(column) p-tablet(row)"
            data-h2-background-color="base(foreground)"
            data-h2-color="base(black)"
            data-h2-position="base(relative)"
            data-h2-radius="base(rounded)"
            data-h2-shadow="base(larger)"
            data-h2-overflow="base(hidden)"
            data-h2-margin="base(0, 0, x1, 0)"
            {...(live ? { role: "alert" } : {})}
            {...styleMap[type]}
            {...rest}
          >
            <div
              data-h2-display="base(flex)"
              data-h2-align-items="base(flex-start)"
              data-h2-justify-content="base(flex-start)"
              data-h2-flex-shrink="base(0)"
              data-h2-position="base(relative) p-tablet:selectors[::after](absolute)"
              data-h2-padding="base(x1) p-tablet(x.5, x1)"
              data-h2-border-style="p-tablet:selectors[::after](solid)"
              data-h2-border-width="p-tablet:selectors[::after](10px 0 10px 10px)"
              data-h2-bottom="p-tablet:selectors[::after](auto)"
              data-h2-height="p-tablet:selectors[::after](0)"
              data-h2-left="p-tablet:selectors[::after](100%)"
              data-h2-top="p-tablet:selectors[::after](calc((1 * var(--h2-base-whitespace)) * 1rem))"
              data-h2-transform="p-tablet:selectors[::after](translate(0))"
              data-h2-width="p-tablet:selectors[::after](0)"
              data-h2-content="p-tablet:selectors[::after]('')"
              {...iconStyleMap[type]}
            >
              <Icon
                data-h2-margin="p-tablet(x.2, 0, 0, 0)"
                data-h2-width="base(x1.5)"
                strokeWidth="2px"
              />
            </div>
            <div
              style={{ flexGrow: 1 }}
              data-h2-align-self="base(center)"
              {...(dismissible
                ? {
                    "data-h2-padding": "base(x1) p-tablet(x1, x2.5, x1, x1.5)",
                  }
                : {
                    "data-h2-padding": "base(x1) p-tablet(x1, x1, x1, x1.5)",
                  })}
            >
              {children}
            </div>
            {dismissible && (
              <button
                type="button"
                data-h2-outline="base(none)"
                data-h2-radius="base(9999px)"
                data-h2-position="base(absolute)"
                data-h2-display="base(flex)"
                data-h2-align-items="base(center)"
                data-h2-location="base(x1.15, x.5, auto, auto) p-tablet(x.5, x.5, auto, auto)"
                data-h2-cursor="base(pointer)"
                data-h2-padding="base(x.25)"
                data-h2-transition="base(100ms ease-in)"
                data-h2-z-index="base(9)"
                {...dismissStyleMap[type]}
                onClick={close}
              >
                <XCircleIcon
                  data-h2-width="base(x1)"
                  data-h2-height="base(x1)"
                  strokeWidth="2px"
                />
                <span data-h2-visually-hidden="base(invisible)">
                  {intl.formatMessage(uiMessages.closeAlert)}
                </span>
              </button>
            )}
          </div>
        ) : null}
      </AlertContext.Provider>
    );
  },
);

/**
 * Props that can be passed to an `<Alert.Title />`
 *
 * @interface AlertTitleProps
 * @member {AlertHeadingLevel} as is the semantic heading level to render the title in
 */
interface AlertTitleProps
  extends HTMLProps<HTMLHeadingElement | HTMLParagraphElement> {
  children: ReactNode;
  as?: AlertHeadingLevel;
}

const Title = ({ as = "h2", children, ...rest }: AlertTitleProps) => {
  const intl = useIntl();
  const ctx = useContext(AlertContext);
  const alertLevelTitle = getAlertLevelTitle(ctx?.type ?? "info", intl);
  const Heading = as;

  return (
    <Heading
      data-h2-font-size="base(h6)"
      data-h2-font-weight="base(700)"
      data-h2-margin="base(0, 0, x.5, 0)"
      {...rest}
    >
      {alertLevelTitle && (
        <span data-h2-visually-hidden="base(invisible)">
          {alertLevelTitle}{" "}
        </span>
      )}
      {children}
    </Heading>
  );
};
interface AlertFooterProps {
  children: ReactNode;
}

const Footer = ({ children }: AlertFooterProps) => (
  <>
    <Separator space="sm" />
    {children}
  </>
);

export default {
  Root: Alert,
  Title,
  Footer,
};
