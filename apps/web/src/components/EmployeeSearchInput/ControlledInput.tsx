import {
  ChangeEventHandler,
  KeyboardEvent,
  MouseEvent,
  useId,
  useRef,
  useState,
} from "react";
import {
  ControllerRenderProps,
  FieldValues,
  UseFormStateReturn,
} from "react-hook-form";
import { CombinedError, useClient } from "urql";
import MagnifyingGlassIcon from "@heroicons/react/20/solid/MagnifyingGlassIcon";
import { useIntl } from "react-intl";
import XMarkIcon from "@heroicons/react/20/solid/XMarkIcon";

import {
  FieldState,
  useCommonInputStyles,
  useFieldStateStyles,
  useInputDescribedBy,
} from "@gc-digital-talent/forms";
import { graphql, Maybe } from "@gc-digital-talent/graphql";
import { Button } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";
import { workEmailDomainRegex } from "@gc-digital-talent/helpers";

import Result, { SearchMessageCases } from "./Result";
import ErrorMessage from "./Error";
import { fragmentToEmployee, getDefaultValue, getErrors } from "./utils";
import { EmployeeSearchResult, ErrorMessages, ErrorSeverities } from "./types";

export { fragmentToEmployee };

const EmployeeSearch_Query = graphql(/* GraphQL */ `
  query EmployeeSearch($workEmail: String!) {
    govEmployeeProfile(workEmail: $workEmail) {
      ...EmployeeSearchResult
    }
  }
`);

interface ControlledInputProps {
  field: ControllerRenderProps<FieldValues, string>;
  formState: UseFormStateReturn<FieldValues>;
  /** Current field state (to update styles) */
  fieldState: FieldState;
  inputProps?: Record<string, string>;
  buttonLabel?: string;
  describedBy?: string;
  errorMessages?: Partial<ErrorMessages>;
  errorSeverities?: Partial<ErrorSeverities>;
  defaultEmployee?: Maybe<EmployeeSearchResult>;
  searchMessageCase?: SearchMessageCases;
}

const ControlledInput = ({
  field: { onChange, name },
  formState: { defaultValues, errors: formErrors },
  inputProps,
  buttonLabel,
  describedBy,
  errorMessages,
  errorSeverities,
  defaultEmployee,
  searchMessageCase,
}: ControlledInputProps) => {
  const id = useId();
  const intl = useIntl();
  const client = useClient();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const inputStyles = useCommonInputStyles();
  const defaultValue = getDefaultValue(defaultValues, name);
  const inputErrors = getErrors(formErrors, name);
  const stateStyles = useFieldStateStyles(name, true);
  const [query, setQuery] = useState<string>(defaultEmployee?.workEmail ?? "");
  const [currentQuery, setCurrentQuery] = useState<string>(
    defaultEmployee?.workEmail ?? "",
  );
  const [fetching, setFetching] = useState<boolean>(false);
  const [error, setError] = useState<CombinedError | string[] | null>(null);
  const [employee, setEmployee] = useState<EmployeeSearchResult | null>(
    defaultValue && defaultEmployee?.id === defaultValue
      ? defaultEmployee
      : null,
  );

  const updateState = (
    result?: EmployeeSearchResult | null,
    err?: CombinedError | string[] | null,
  ) => {
    setError(err ?? null);
    setEmployee(result ?? null);
    onChange(result?.id ?? null);
    setFetching(false);
  };

  const fetchEmployee = async () => {
    if (!query) {
      updateState(null);
      return;
    }

    if (!workEmailDomainRegex.test(query)) {
      updateState(null, ["NotGovernmentEmail"]);
      return;
    }

    setFetching(true);
    const res = await client
      .query(EmployeeSearch_Query, { workEmail: query })
      .toPromise();

    if (!res.data?.govEmployeeProfile) {
      updateState(null, res.error ?? ["NoProfile"]);
      return;
    }

    const employeeResult = fragmentToEmployee(res.data?.govEmployeeProfile);
    updateState(employeeResult, null);
  };

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setQuery(e.target.value ?? "");
    return false;
  };

  const handleSearch = async () => {
    setCurrentQuery(query);
    await fetchEmployee();
  };

  const handleReset = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentQuery("");
    setQuery("");
    setError(null);
    setEmployee(null);
    onChange(undefined);
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.focus();
    }
  };

  const handleKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query) {
      e.preventDefault();
      e.stopPropagation();
      await handleSearch();
    }
  };

  const hasErrors = !!error || (inputErrors && inputErrors.length > 0);
  const showContext =
    !fetching && !hasErrors && currentQuery === "" && !employee;

  const [descriptionIds, ariaDescribedBy] = useInputDescribedBy({
    id,
    describedBy,
    show: {
      error: hasErrors,
      context: showContext,
    },
  });

  return (
    <div
      data-h2-display="base(flex)"
      data-h2-flex-direction="base(column)"
      data-h2-radius="base(rounded)"
      data-h2-border-style="base(solid)"
      data-h2-border-width="base(1px)"
      data-h2-border-color="base(gray) base:focus-visible(focus)"
    >
      <div
        data-h2-display="base(flex)"
        data-h2-position="base(relative)"
        data-h2-z-index="base(2)"
      >
        <div
          data-h2-display="base(flex)"
          data-h2-flex-grow="base(1)"
          data-h2-width="base(100%)"
          data-h2-position="base(relative)"
        >
          <input
            ref={inputRef}
            name={`${name}-${id}`}
            id={`${name}-${id}`}
            type="text"
            defaultValue={defaultEmployee?.workEmail ?? undefined}
            aria-describedby={ariaDescribedBy}
            {...stateStyles}
            {...inputProps}
            {...inputStyles}
            readOnly={fetching}
            data-h2-background="base(foreground)"
            data-h2-flex-grow="base(1)"
            data-h2-border-width="base(0)"
            data-h2-radius="base(rounded 0 0 0)"
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
          {(currentQuery || query || employee) && (
            <button
              type="button"
              data-h2-background-color="base(transparent) base:hover(gray.lightest)"
              data-h2-border="base(2px solid transparent) base:focus-visible(2px solid secondary)"
              data-h2-display="base(flex)"
              data-h2-align-items="base(center)"
              data-h2-radius="base(input)"
              data-h2-cursor="base(pointer)"
              data-h2-location="base(x.25, x.25, x.25, auto)"
              data-h2-position="base(absolute)"
              data-h2-outline="base(none)"
              data-h2-flex-shrink="base(0)"
              onClick={handleReset}
            >
              <XMarkIcon
                data-h2-height="base(1rem)"
                data-h2-width="base(1rem)"
                data-h2-color="base(black.light)"
              />
            </button>
          )}
        </div>
        <Button
          type="button"
          mode="solid"
          color="primary"
          data-h2-radius="base(0 rounded 0 0)"
          aria-label={
            buttonLabel ??
            intl.formatMessage({
              defaultMessage: "Search work email",
              id: "pfwT4h",
              description:
                "Default button text to search for an employee by work email",
            })
          }
          onClick={handleSearch}
        >
          <span data-h2-display="base(flex)" data-h2-align-items="base(center)">
            <MagnifyingGlassIcon data-h2-width="base(x.75)" />
          </span>
        </Button>
      </div>
      <div
        data-h2-background="base(foreground)"
        {...stateStyles}
        data-h2-border-radius="base(0 0 rounded rounded)"
        data-h2-border-top="base(solid 1px gray)"
        data-h2-padding="base(x1)"
        data-h2-position="base(relative)"
        data-h2-z-index="base(1)"
      >
        {showContext && (
          <p data-h2-text-align="base(center)" id={descriptionIds.context}>
            {intl.formatMessage({
              defaultMessage:
                "Enter a work email and use the search button to find a user.",
              id: "Z+n7lE",
              description: "Instructions to search for a government employee",
            })}
          </p>
        )}
        {fetching && (
          <p data-h2-text-align="base(center)">
            {intl.formatMessage(commonMessages.searching)}
          </p>
        )}
        {!fetching && employee && !hasErrors && (
          <Result
            employee={employee}
            id={descriptionIds.context}
            searchMessageCase={searchMessageCase}
          />
        )}
        {!fetching && hasErrors && (
          <ErrorMessage
            id={descriptionIds.error}
            email={currentQuery}
            error={error}
            inputErrors={inputErrors}
            messages={errorMessages}
            severities={errorSeverities}
          />
        )}
      </div>
    </div>
  );
};

export default ControlledInput;
