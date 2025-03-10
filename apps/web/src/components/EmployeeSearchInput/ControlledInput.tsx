import { ChangeEventHandler, useEffect, useId, useState } from "react";
import {
  ControllerRenderProps,
  FieldValues,
  get,
  UseFormStateReturn,
} from "react-hook-form";
import { useQuery } from "urql";
import MagnifyingGlassIcon from "@heroicons/react/20/solid/MagnifyingGlassIcon";
import { useIntl } from "react-intl";

import {
  FieldState,
  useCommonInputStyles,
  useFieldStateStyles,
} from "@gc-digital-talent/forms";
import { graphql } from "@gc-digital-talent/graphql";
import { Button } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";

import Result from "./Result";
import { ErrorMessage, ErrorTitle } from "./Error";
import { getDefaultValue } from "./utils";

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
  /** Determine if it should track unsaved changes and render it */
  trackUnsaved?: boolean;
  /** Current field state (to update styles) */
  fieldState: FieldState;
  inputProps?: Record<string, string>;
  buttonLabel?: string;
}

const ControlledInput = ({
  field: { onChange, name },
  formState: { defaultValues },
  inputProps,
  buttonLabel,
  trackUnsaved,
}: ControlledInputProps) => {
  const id = useId();
  const intl = useIntl();
  const inputStyles = useCommonInputStyles();
  const stateStyles = useFieldStateStyles(name, !trackUnsaved);
  const rawDefaultValue: unknown = get(defaultValues, name);
  const defaultValue = getDefaultValue(rawDefaultValue);
  const [query, setQuery] = useState<string>(defaultValue?.workEmail ?? "");
  const [currentQuery, setCurrentQuery] = useState<string>(
    defaultValue?.workEmail ?? "",
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
    executeQuery();
  };

  useEffect(() => {
    if (defaultValue?.workEmail) {
      executeQuery();
    }
    // NOTE: Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const employeeId = data?.govEmployeeProfile?.id;

  useEffect(() => {
    onChange({ id: employeeId, workEmail: query });
    // Note: Only update when employee ID changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeId]);

  return (
    <div
      data-h2-display="base(flex)"
      data-h2-flex-direction="base(column)"
      data-h2-radius="base(rounded)"
      data-h2-border-style="base(solid)"
      data-h2-border-width="base(1px)"
      {...stateStyles}
    >
      <div data-h2-display="base(flex)">
        <input
          name={`${name}-${id}`}
          id={`${name}-${id}`}
          type="text"
          defaultValue={defaultValue?.workEmail ?? undefined}
          {...inputProps}
          {...inputStyles}
          readOnly={fetching}
          data-h2-flex-grow="base(1)"
          data-h2-border-width="base(0)"
          data-h2-radius="base(rounded 0 0 rounded)"
          onChange={handleChange}
        />
        <Button
          type="button"
          mode="solid"
          color="primary"
          data-h2-radius="base(0 rounded 0 0)"
          aria-label={buttonLabel}
          onClick={handleSearch}
        >
          <span data-h2-display="base(flex)" data-h2-align-items="base(cener)">
            <MagnifyingGlassIcon data-h2-width="base(x.75)" />
          </span>
        </Button>
      </div>
      <div
        data-h2-border-radius="base(0 0 rounded rounded)"
        data-h2-border-top="base(solid 1px gray)"
        data-h2-padding="base(x1)"
      >
        {typeof data === "undefined" && !fetching && (
          <p data-h2-text-align="base(center)">
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
        {!fetching && data?.govEmployeeProfile && (
          <Result resultQuery={data?.govEmployeeProfile} />
        )}
        {!fetching && data?.govEmployeeProfile === null && !error && (
          <>
            <ErrorTitle>
              {intl.formatMessage(
                {
                  defaultMessage:
                    "We couldn't find a matching profile for “{email}”",
                  id: "D8FjlJ",
                  description:
                    "Error message when an employee could not be found",
                },
                { email: currentQuery },
              )}
            </ErrorTitle>
          </>
        )}
        {!fetching && error && (
          <ErrorMessage email={currentQuery} error={error} />
        )}
      </div>
    </div>
  );
};

export default ControlledInput;
