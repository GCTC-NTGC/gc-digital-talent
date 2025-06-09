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
import { tv } from "tailwind-variants";

import {
  FieldState,
  useFieldState,
  inputStyles,
  useInputDescribedBy,
  inputStateStyles,
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

const wrapper = tv({
  extend: inputStateStyles,
  base: "flex flex-col rounded-md border-1 focus-visible:border-focus",
});

const emailInput = tv({
  extend: inputStyles,
  base: "grow rounded-none rounded-tl-md border-none",
});

const content = tv({
  extend: inputStateStyles,
  base: "relative z-[1] rounded-b-md border-t p-6 text-black dark:text-white",
});

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
  const defaultValue = getDefaultValue(defaultValues, name);
  const inputErrors = getErrors(formErrors, name);
  const fieldState = useFieldState(name, true);
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
    <div className={wrapper({ state: fieldState })}>
      <div className="relative z-[2] flex">
        <div className="relative flex w-full grow">
          <input
            ref={inputRef}
            name={`${name}-${id}`}
            id={`${name}-${id}`}
            type="text"
            defaultValue={defaultEmployee?.workEmail ?? undefined}
            aria-describedby={ariaDescribedBy}
            {...inputProps}
            className={emailInput({ state: fieldState })}
            readOnly={fetching}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
          {(currentQuery || query || employee) && (
            <button
              type="button"
              className="absolute inset-1.5 left-auto flex shrink-0 cursor-pointer items-center rounded-md border-2 border-transparent bg-transparent px-2 outline-none hover:bg-gray-100 focus-visible:border-primary dark:hover:bg-gray-700"
              onClick={handleReset}
            >
              <XMarkIcon className="size-4 text-gray" />
            </button>
          )}
        </div>
        <Button
          type="button"
          mode="solid"
          color="secondary"
          className="rounded-none! rounded-tr-md!"
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
          <span className="flex items-center">
            <MagnifyingGlassIcon className="size-4.5" />
          </span>
        </Button>
      </div>
      <div className={content({ state: fieldState })}>
        {showContext && (
          <p className="text-center" id={descriptionIds.context}>
            {intl.formatMessage({
              defaultMessage:
                "Enter a work email and use the search button to find a user.",
              id: "Z+n7lE",
              description: "Instructions to search for a government employee",
            })}
          </p>
        )}
        {fetching && (
          <p className="text-center">
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
