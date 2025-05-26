
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
import { tv, VariantProps } from "tailwind-variants";

import { uiMessages } from "@gc-digital-talent/i18n";

import Separator from "../Separator";
import { iconMap, getAlertLevelTitle } from "./utils";
import { AlertHeadingLevel, AlertType } from "./types";

interface AlertContextValue {
  type: AlertType;
}

const AlertContext = createContext<AlertContextValue | undefined>(undefined);

const alert = tv({
  slots: {
    base: "relative mb-6 flex flex-col overflow-hidden rounded border-3 bg-white text-black shadow-lg xs:flex-row dark:bg-gray-600 dark:text-white",
    iconWrapper: "relative flex shrink-0 items-start p-6 xs:py-3",
    triangle:
      "xs:absolute xs:top-6 xs:bottom-0 xs:left-full xs:h-0 xs:w-0 xs:border-[10px] xs:border-r-0",
    content: "grow-1 self-center p-6 xs:pl-9",
    dismiss:
      "transition-100 absolute top-6 right-3 z-10 flex cursor-pointer items-center rounded-full bg-transparent p-1 transition ease-in outline-none focus-visible:bg-focus focus-visible:text-black xs:top-3",
  },
  variants: {
    type: {
      info: {
        base: "border-primary-700 dark:border-primary-100",
        iconWrapper: "bg-primary-100 text-primary-700",
        triangle: "border-transparent border-l-primary-100",
        dismiss:
          "text-primary-700 hover:bg-primary-100 hover:text-primary-600 xs:text-inherit",
      },
      success: {
        base: "border-success-700 dark:border-success-100",
        iconWrapper: "bg-success-100 text-success-700",
        triangle: "border-transparent border-l-success-100",
        dismiss:
          "text-success-700 hover:bg-success-100 hover:text-success-600 xs:text-inherit",
      },
      warning: {
        base: "border-warning-700 dark:border-warning-100",
        iconWrapper: "bg-warning-100 text-warning-700",
        triangle: "border-transparent border-l-warning-100",
        dismiss:
          "text-warning-700 hover:bg-warning-100 hover:text-warning-600 xs:text-inherit",
      },
      error: {
        base: "border-error-700 dark:border-error-100",
        iconWrapper: "bg-error-100 text-error-700",
        triangle: "border-transparent border-l-error-100",
        dismiss:
          "text-error-700 hover:bg-error-100 hover:text-error-600 xs:text-inherit",
      },
    },
    dismissible: {
      true: { content: "xs:py-6 xs:pr-12" },
    },
  },
});

type AlertVariants = VariantProps<typeof alert>;

/**
 * Props that can be passed to an `<Alert.Root />`
 *
 * @interface AlertProps
 * @member {AlertType} type the category of information displayed in the alert
 * @member {boolean} dismissible controls if the user can dismiss the alert or not
 * @member {boolean} live adds [role="alert"] forcing the alert to be read out to assistive technology
 * @member {function} onDismiss execute code when the alert is dismissed
 */
export interface AlertProps
  extends Omit<AlertVariants, "type">,
    Required<Pick<AlertVariants, "type">>,
    ComponentPropsWithoutRef<"div"> {
  live?: boolean; // REF: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/alert_role
  onDismiss?: () => void;
}

const Alert = forwardRef<ElementRef<"div">, AlertProps>(
  (
    {
      type,
      onDismiss,
      live = true,
      dismissible = false,
      children,
      className,
      ...rest
    },
    forwardedRef,
  ) => {
    const intl = useIntl();
    const [isOpen, setIsOpen] = useState(true);
    const Icon = iconMap[type ?? "info"];
    const { base, iconWrapper, content, dismiss, triangle } = alert();

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
            className={base({ type, class: className })}
            {...(live ? { role: "alert" } : {})}
            {...rest}
          >
            <div className={iconWrapper({ type })}>
              <span aria-hidden="true" className={triangle({ type })}></span>
              <Icon className="size-9 stroke-[2px] xs:mt-1" />
            </div>
            <div className={content({ dismissible })}>{children}</div>
            {dismissible && (
              <button
                type="button"
                className={dismiss({ type })}
                onClick={close}
              >
                <XCircleIcon className="size-6 stroke-[2px]" />
                <span className="sr-only">
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
    <Heading className="mb-3 text-lg/[1] font-bold lg:text-xl/[1]" {...rest}>
      {alertLevelTitle && <span className="sr-only">{alertLevelTitle} </span>}
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
