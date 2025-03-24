import { ChangeEventHandler, KeyboardEvent, useId, useState } from "react";
import {
  ControllerRenderProps,
  FieldValues,
  UseFormStateReturn,
} from "react-hook-form";
import { CombinedError, useClient } from "urql";
import MagnifyingGlassIcon from "@heroicons/react/20/solid/MagnifyingGlassIcon";
import { useIntl } from "react-intl";

import {
  FieldState,
  useCommonInputStyles,
  useInputDescribedBy,
} from "@gc-digital-talent/forms";
import { graphql, Maybe } from "@gc-digital-talent/graphql";
import { Button } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";
import { workEmailDomainRegex } from "@gc-digital-talent/helpers";

import Result from "./Result";
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
}: ControlledInputProps) => {
  const id = useId();
  const intl = useIntl();
  const client = useClient();
  const inputStyles = useCommonInputStyles();
  const defaultValue = getDefaultValue(defaultValues, name);
  const inputErrors = getErrors(formErrors, name);
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

  const handleKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query) {
      e.preventDefault();
      e.stopPropagation();
      await handleSearch();
    }
  };

  const hasErrors = !!error || (inputErrors && inputErrors.length > 0);
  const showContext = !fetching && !hasErrors && query === "" && !employee;

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
        <input
          name={`${name}-${id}`}
          id={`${name}-${id}`}
          type="text"
          defaultValue={defaultEmployee?.workEmail ?? undefined}
          aria-describedby={ariaDescribedBy}
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
        <Button
          type="button"
          mode="solid"
          color="secondary"
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
          <Result employee={employee} id={descriptionIds.context} />
        )}
        {!fetching && hasErrors && (
          <ErrorMessage
            email={currentQuery}
            error={error}
            messages={errorMessages}
            severities={errorSeverities}
          />
        )}
      </div>
    </div>
  );
};

export default ControlledInput;
