import {
  ChangeEventHandler,
  KeyboardEventHandler,
  useEffect,
  useId,
  useState,
} from "react";
import {
  ControllerRenderProps,
  FieldValues,
  useFormContext,
  UseFormStateReturn,
} from "react-hook-form";
import { useQuery } from "urql";
import MagnifyingGlassIcon from "@heroicons/react/20/solid/MagnifyingGlassIcon";
import { useIntl } from "react-intl";

import {
  FieldState,
  useCommonInputStyles,
  useInputDescribedBy,
} from "@gc-digital-talent/forms";
import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { Button } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";
import { workEmailDomainRegex } from "@gc-digital-talent/helpers";

import Result from "./Result";
import ErrorMessage from "./Error";
import { getDefaultValue, getErrors } from "./utils";
import { ErrorMessages } from "./types";

export const EmployeeSearchDefaultValue_Fragment = graphql(/* GraphQL */ `
  fragment EmployeeSearchDefaultValue on BasicGovEmployeeProfile {
    id
    workEmail
    ...EmployeeSearchResult
  }
`);

export type DefaultValueFragmentType = FragmentType<
  typeof EmployeeSearchDefaultValue_Fragment
>;

const EmployeeSearch_Query = graphql(/* GraphQL */ `
  query EmployeeSearch($workEmail: String!) {
    govEmployeeProfile(workEmail: $workEmail) {
      id
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
  employeeQuery?: DefaultValueFragmentType;
}

const ControlledInput = ({
  field: { onChange, name },
  formState: { defaultValues, errors },
  inputProps,
  buttonLabel,
  describedBy,
  errorMessages,
  employeeQuery,
}: ControlledInputProps) => {
  const id = useId();
  const intl = useIntl();
  const inputStyles = useCommonInputStyles();
  const { setError } = useFormContext();
  const defaultValue = getDefaultValue(defaultValues, name);
  const inputErrors = getErrors(errors, name);
  const maybeEmployee = getFragment(
    EmployeeSearchDefaultValue_Fragment,
    employeeQuery,
  );
  const defaultEmployee =
    defaultValue && maybeEmployee?.id === defaultValue
      ? maybeEmployee
      : undefined;

  const [query, setQuery] = useState<string>(defaultEmployee?.workEmail ?? "");
  const [currentQuery, setCurrentQuery] = useState<string>(
    defaultEmployee?.workEmail ?? "",
  );
  const [{ data, fetching, error }, executeQuery] = useQuery({
    query: EmployeeSearch_Query,
    pause: true,
    variables: {
      workEmail: query,
    },
  });

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setQuery(e.target.value ?? "");
    return false;
  };

  const handleSearch = () => {
    setCurrentQuery(query);
    if (query && !workEmailDomainRegex.test(query)) {
      setError(name, {
        type: "isGovEmail",
      });
      return;
    }
    executeQuery();
  };

  const handleKeyDown: KeyboardEventHandler = (e) => {
    if (e.key === "Enter" && query) {
      e.preventDefault();
      e.stopPropagation();
      handleSearch();
    }
  };

  let resultQuery;
  if (data?.govEmployeeProfile) {
    resultQuery = data?.govEmployeeProfile;
  } else if (defaultEmployee) {
    resultQuery = defaultEmployee;
  }
  const employeeId = data?.govEmployeeProfile?.id;

  useEffect(() => {
    onChange(employeeId ?? defaultEmployee?.id);
    // Note: Only update when employee ID changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeId]);

  const isNullResponse = data?.govEmployeeProfile === null;
  const hasErrors =
    !!error || (inputErrors && inputErrors?.length > 0) || isNullResponse;
  const showContext = !fetching && !hasErrors;

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
        {showContext && typeof data === "undefined" && (
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
        {!fetching && resultQuery && !hasErrors && (
          <Result resultQuery={resultQuery} id={descriptionIds.context} />
        )}
        {!fetching && hasErrors && (
          <ErrorMessage
            email={currentQuery}
            error={error}
            isNullResponse={isNullResponse}
            messages={errorMessages}
          />
        )}
      </div>
    </div>
  );
};

export default ControlledInput;
