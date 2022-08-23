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
  const { handleSubmit, setValue } = methods;

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
              // Prevent enter key from submitting form
              if (e.key === "Enter") {
                e.preventDefault();
              }
            }}
            errorPosition="top"
            data-h2-margin="base(0)"
          />
        </div>
      </FormProvider>
    </section>
  );
};

export default SearchBar;
