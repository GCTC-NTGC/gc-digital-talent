import ArrowRightIcon from "@heroicons/react/16/solid/ArrowRightIcon";
import { FormProvider, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { tv } from "tailwind-variants";

import { Maybe } from "@gc-digital-talent/graphql";
import { Field, inputStyles } from "@gc-digital-talent/forms";
import { Button } from "@gc-digital-talent/ui";

import adminMessages from "~/messages/adminMessages";

import ResetButton from "../Table/ResetButton";

const input = tv({
  extend: inputStyles,
  base: "w-full grow rounded-r-none border-r-transparent md:w-auto",
});

interface FormValues {
  term?: Maybe<string>;
}

interface SearchFormProps {
  onSearch?: (term?: Maybe<string>) => void;
  onReset?: () => void;
  defaultValue?: Maybe<string>;
}

const SearchForm = ({ onSearch, onReset, defaultValue }: SearchFormProps) => {
  const intl = useIntl();

  const methods = useForm<FormValues>({
    defaultValues: {
      term: defaultValue,
    },
  });

  const term = methods.watch("term");

  const handleSubmit = (values: FormValues) => {
    onSearch?.(values.term);
  };

  const handleReset = () => {
    methods.reset({ term: "" });
    // Small delay to wait for reset re-render
    setTimeout(() => {
      methods.setFocus("term");
    }, 10);
    onReset?.();
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
              className={input()}
              {...methods.register("term")}
            />
            {term && (
              <div className="absolute inset-3 left-auto flex items-stretch">
                <ResetButton onClick={handleReset} />
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
