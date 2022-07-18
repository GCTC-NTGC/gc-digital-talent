import React from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { Input } from "../../form";

export interface SearchBarProps {
  handleSearch: (searchQuery: string) => Promise<void>;
}

interface FormValues {
  query: string;
}

export const SearchBar: React.FunctionComponent<SearchBarProps> = ({
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

  return (
    <section>
      <FormProvider {...methods}>
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
              setValue("query", e.target.value);
              if (e.target.value.length >= 2) handleSubmit(onSubmit)();
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
              } else {
                onSubmit({ query: watchSearch });
              }
            }}
            errorPosition="top"
          />
        </div>
      </FormProvider>
    </section>
  );
};

export default SearchBar;
