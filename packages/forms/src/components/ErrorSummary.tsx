import { useIntl } from "react-intl";
import type { FieldErrors, FieldValues } from "react-hook-form";
import { useFormState } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import type { ReactNode, ComponentRef } from "react";
import { forwardRef, useLayoutEffect, useRef } from "react";

import type { ScrollLinkClickFunc } from "@gc-digital-talent/ui";
import { Notice, ScrollToLink, Link, Ul } from "@gc-digital-talent/ui";
import {
  commonMessages,
  errorMessages,
  getLocale,
} from "@gc-digital-talent/i18n";

import type { FieldLabels } from "../types";
import { flattenErrors } from "../utils";
import { useFormLabels } from "./FormLabelsProvider";

interface FieldNameWithLabel {
  label: ReactNode;
  name: string;
  index?: string;
}

const numberRegex = /(\d+)/g;

/**
 * Get Field Label
 *
 * Use the field name to extract the associated label
 *
 * @param {string} name - The name property of the field
 * @param {FieldLabels} labels - Available labels
 * @returns {FieldNameWithLabel | null}
 */
const getFieldLabel = (
  name: string,
  labels: FieldLabels,
): FieldNameWithLabel | null => {
  let labelKey = name;
  let index: undefined | string;

  // This is a root error for a field array
  if (name.includes(".root")) {
    labelKey = name.replace(".root", "");
  } else if (numberRegex.test(name)) {
    // If a number exists in the field name, replace it with an asterisk
    labelKey = name.replace(numberRegex, "*");
    // Get the number and assign it to the index so we can show it in the link
    const indices = name.match(numberRegex);
    if (indices) {
      index = indices.map((i) => ` (${Number(i) + 1})`).join(" ");
    }
  }

  if (labelKey in labels) {
    return {
      name,
      index,
      label: labels[labelKey],
    };
  }

  return null;
};

/**
 * Add labels to errors
 *
 * Transform the errors to associate them with labels
 * so they can be used as the link name
 *
 * @param {FieldErrors<FieldValues> } errors - from form state
 * @param {FieldLabels} labels - Available labels
 * @returns {FieldNameWithLabel}
 */
const addLabelsToErrors = (
  errors: FieldErrors<FieldValues>,
  labels: FieldLabels,
): FieldNameWithLabel[] => {
  const invalidFieldNames = flattenErrors(errors);
  let fieldNamesWithLabels: FieldNameWithLabel[] = [];
  invalidFieldNames.forEach((fieldName) => {
    const fieldNameWithLabel = getFieldLabel(fieldName, labels);
    if (fieldNameWithLabel) {
      fieldNamesWithLabels = [...fieldNamesWithLabels, fieldNameWithLabel];
    }
  });

  return fieldNamesWithLabels;
};

interface ErrorSummaryProps {
  labels?: FieldLabels;
  show: boolean;
}

const supportLink = (chunks: ReactNode, locale: string) => (
  <Link
    href={`/${locale}/support`}
    state={{ referrer: window.location.href }}
    newTab
    color="error"
  >
    {chunks}
  </Link>
);

// False when something else scrolls this element, like a dialog. Scrolling the page would then move the wrong thing.
const isInPageFlow = (el: HTMLElement): boolean => {
  for (let n = el.parentElement; n; n = n.parentElement) {
    const { overflow, position } = getComputedStyle(n);
    if (position === "fixed" || /(auto|scroll)/.test(overflow)) {
      return false;
    }
  }
  return true;
};

const measure = (el: HTMLElement | null) => ({
  scrollY: window.scrollY,
  outer: el
    ? el.getBoundingClientRect().height +
      parseFloat(getComputedStyle(el).marginBottom || "0")
    : 0,
  docTop: el ? el.getBoundingClientRect().top + window.scrollY : 0,
  scrollsWithPage: el ? isInPageFlow(el) : false,
});

const ErrorSummary = forwardRef<ComponentRef<"div">, ErrorSummaryProps>(
  ({ labels: labelsProp, show }, forwardedRef) => {
    const intl = useIntl();
    const locale = getLocale(intl);
    const { errors } = useFormState();
    const { labels: registeredLabels } = useFormLabels();
    const labels = { ...registeredLabels.current, ...labelsProp };
    const noticeRef = useRef<HTMLDivElement | null>(null);
    // Measure now, while the page still shows the old summary. Later is too late as
    // the browser may have moved the scroll, or a resize may have changed the summary's height.
    const before = useRef(measure(null));
    before.current = measure(noticeRef.current);

    // This summary sits above the fields, so when it gets shorter everything below jumps up. Scroll by the same amount to keep the page still.
    useLayoutEffect(() => {
      const { scrollY, outer, docTop, scrollsWithPage } = before.current;
      // Only count the part scrolled out of sight. If the user can watch it shrink, moving the page would be the jarring thing.
      const hiddenAbove = Math.min(
        Math.max(scrollY - docTop, 0),
        outer - measure(noticeRef.current).outer,
      );
      if (hiddenAbove > 0 && scrollsWithPage) {
        // An exact position, not an offset, so a browser fix can't double up
        window.scrollTo(0, scrollY - hiddenAbove);
      }
    });

    // Don't show if the form is valid
    if (!errors || !show || !labels) return null;

    // Flatten the error object and get the label
    const invalidFieldNames = addLabelsToErrors(errors, labels);

    const handleErrorClick: ScrollLinkClickFunc = (e, target) => {
      e.preventDefault();
      const singleInputTypes = ["input", "select", "textarea"];
      if (target) {
        // The input is not part of a group so just focus it directly
        if (singleInputTypes.includes(target.nodeName.toLocaleLowerCase())) {
          target.focus();
        } else {
          // Find the input in a RadioGroup or CheckList and focus it
          target.querySelector("input")?.focus();
        }
      }
    };

    return invalidFieldNames.length > 0 ? (
      <Notice.Root
        color="error"
        mode="card"
        role="alert"
        ref={(node: HTMLDivElement | null) => {
          noticeRef.current = node;
          if (typeof forwardedRef === "function") forwardedRef(node);
          else if (forwardedRef) forwardedRef.current = node;
        }}
        tabIndex={-1}
        className="mb-6"
      >
        <Notice.Title defaultIcon>
          {intl.formatMessage(errorMessages.summaryTitle)}
        </Notice.Title>
        <Notice.Content>
          <p>{intl.formatMessage(errorMessages.summaryDescription)}</p>
          <Ul className="mt-3">
            {invalidFieldNames.map((field) => {
              return (
                <li key={field.name}>
                  <ScrollToLink
                    to={field.name}
                    onScrollTo={handleErrorClick}
                    mode="text"
                    color="error"
                  >
                    <>
                      {field.label}
                      {field.name.endsWith(".en") &&
                        ` ${intl.formatMessage(commonMessages.englishLabel)}`}
                      {field.name.endsWith(".fr") &&
                        ` ${intl.formatMessage(commonMessages.frenchLabel)}`}
                      {field.index && ` ${field.index}`}
                    </>
                  </ScrollToLink>
                  {intl.formatMessage(commonMessages.dividingColon)}
                  <ErrorMessage name={field.name} />
                </li>
              );
            })}
          </Ul>
        </Notice.Content>
        <Notice.Footer>
          <p>
            {intl.formatMessage(errorMessages.summaryContact, {
              a: (chunks: ReactNode) => supportLink(chunks, locale),
            })}
          </p>
        </Notice.Footer>
      </Notice.Root>
    ) : null;
  },
);

export default ErrorSummary;
