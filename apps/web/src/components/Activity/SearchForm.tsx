import ArrowRightIcon from "@heroicons/react/16/solid/ArrowRightIcon";
import { FormProvider, useForm } from "react-hook-form";
import { useSearchParams } from "react-router";
import { useIntl } from "react-intl";
import { tv } from "tailwind-variants";

import { Maybe } from "@gc-digital-talent/graphql";
import { Field, inputStyles } from "@gc-digital-talent/forms";
import { Button } from "@gc-digital-talent/ui";

import adminMessages from "~/messages/adminMessages";

import { SEARCH_PARAM_KEY } from "../Table/ResponsiveTable/constants";
import ResetButton from "../Table/ResetButton";

const input = tv({
  extend: inputStyles,
  base: "w-full grow rounded-r-none border-r-transparent md:w-auto",
});

interface FormValues {
  term?: Maybe<string>;
}

interface SearchFormProps {
  param?: string;
}

const SearchForm = ({ param }: SearchFormProps) => {
  const PARAM_KEY = param ?? SEARCH_PARAM_KEY.SEARCH_TERM;
  const intl = useIntl();
  const [searchParams, setSearchParams] = useSearchParams();

  const methods = useForm<FormValues>({
    defaultValues: {
      term: searchParams.get(PARAM_KEY),
    },
  });

  const term = methods.watch("term");

  const handleSubmit = (values: FormValues) => {
    const newParams = new URLSearchParams(searchParams);
    if (values.term) {
      newParams.set(PARAM_KEY, values.term);
    } else {
      newParams.delete(PARAM_KEY);
    }

    setSearchParams(newParams);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)} className="my-6">
        <Field.Label htmlFor="term">
          {intl.formatMessage(adminMessages.searchByKeyword)}
        </Field.Label>
        <div className="flex">
          <div className="relative flex w-full grow">
            <input
              id="term"
              {...methods.register("term")}
              className={input()}
            />
            {term && (
              <div className="absolute inset-3 left-auto flex items-stretch">
                <ResetButton onClick={() => handleSubmit({ term: null })} />
              </div>
            )}
          </div>
          <Button
            type="submit"
            utilityIcon={ArrowRightIcon}
            className="shrink-0 rounded rounded-l-none"
          >
            {intl.formatMessage({
              defaultMessage: "Search",
              id: "AuezIt",
              description: "Button text to submit a search",
            })}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default SearchForm;
