import { Input } from "@common/components/form";
import { debounce } from "debounce";
import React, { useCallback } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useIntl } from "react-intl";

export interface SearchBarProps {
  handleSearch: (searchQuery: string) => Promise<void>;
}

interface FormValues {
  query: string;
}

const SearchBar: React.FunctionComponent<SearchBarProps> = ({
  handleSearch,
}) => {
  const intl = useIntl();
  const methods = useForm<FormValues>({
    defaultValues: { query: "" },
  });
  const { handleSubmit, setValue, watch, setError } = methods;
  const watchSearch = watch("query");

  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    return handleSearch(data.query);
  };

  const submitDebounced = useCallback(
    debounce((query: string) => {
      if (query.length >= 2) handleSubmit(onSubmit)();
    }, 1000),
    [],
  );

  const setQuery = async (query: string) => setValue("query", query);

  return (
    <section>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div role="search">
            <Input
              id="search-skills"
              type="search"
              name="query"
              label={intl.formatMessage({
                defaultMessage: "Search for specific skill...",
                description: "Label for the skills search bar.",
              })}
              placeholder={intl.formatMessage({
                defaultMessage: "e.g. Python, JavaScript, etc.",
                description: "Placeholder for the skills search bar.",
              })}
              onChange={(e) => {
                const query = e.target.value;
                setQuery(query).then(() => {
                  submitDebounced(query);
                });
              }}
              onKeyPress={(e) => {
                // If user tries to enter invalid string then setError on keypress
                if (e.key === "Enter" && watchSearch.length < 2) {
                  e.preventDefault();
                  setError(
                    "query",
                    {
                      type: "minLength",
                      message: intl.formatMessage({
                        defaultMessage:
                          "You must enter a search term before pressing enter",
                        description:
                          "Error message displayed when the search term length is less then 2 characters.",
                      }),
                    },
                    { shouldFocus: true },
                  );
                }
              }}
              errorPosition="top"
            />
          </div>
        </form>
      </FormProvider>
    </section>
  );
};

export default SearchBar;
