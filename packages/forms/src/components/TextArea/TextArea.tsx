import { useFormContext } from "react-hook-form";
import { useIntl } from "react-intl";
import { DetailedHTMLProps, TextareaHTMLAttributes, FocusEvent } from "react";
import { tv } from "tailwind-variants";

import { errorMessages } from "@gc-digital-talent/i18n";

import Field from "../Field";
import WordCounter from "../WordCounter";
import type { CommonInputProps } from "../../types";
import { countNumberOfWords } from "../../utils";
import useFieldState from "../../hooks/useFieldState";
import useInputDescribedBy from "../../hooks/useInputDescribedBy";
import { inputStyles } from "../../styles";
export type TextAreaProps = DetailedHTMLProps<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
> &
  CommonInputProps & {
    // Whether to trim leading/ending whitespace upon blurring of an input, default on
    whitespaceTrim?: boolean;
    /** Sets a limit on how many words can be submitted with this input */
    wordLimit?: number;
  };

const textArea = tv({
  extend: inputStyles,
  base: "w-full resize-y",
  variants: {
    readonly: {
      true: "bg-gray-100",
    },
    wordLimit: {
      true: "pb-12",
    },
  },
});

const TextArea = ({
  id,
  context,
  label,
  name,
  wordLimit,
  rules = {},
  readOnly,
  rows = 4,
  trackUnsaved = true,
  whitespaceTrim = true,
  "aria-labelledby": labelledBy,
  "aria-describedby": describedBy,
  ...rest
}: TextAreaProps) => {
  const {
    register,
    formState: { errors },
    setValue,
  } = useFormContext();
  const intl = useIntl();
  const fieldState = useFieldState(id, !trackUnsaved);
  const isUnsaved = fieldState === "dirty" && trackUnsaved;
  const isInvalid = fieldState === "invalid";
  const [descriptionIds, ariaDescribedBy] = useInputDescribedBy({
    id,
    describedBy,
    show: {
      error: isInvalid,
      unsaved: trackUnsaved && isUnsaved,
      context,
    },
  });

  const normalizeInput = (e: FocusEvent<HTMLTextAreaElement>) => {
    let inputValue = e.target.value;
    if (whitespaceTrim) {
      inputValue = inputValue.trim();
    }
    setValue(name, inputValue);
  };

  let wordLimitRule = {};
  if (wordLimit) {
    wordLimitRule = {
      wordCount: (value: string) =>
        countNumberOfWords(value) <= wordLimit ||
        intl.formatMessage(errorMessages.overWordLimit, {
          value: wordLimit,
        }),
    };
  }

  return (
    <Field.Wrapper>
      <Field.Label id={`${id}-label`} htmlFor={id} required={!!rules.required}>
        {label}
      </Field.Label>
      <div className="relative z-1">
        <textarea
          id={id}
          aria-describedby={ariaDescribedBy}
          aria-required={!!rules.required}
          aria-invalid={isInvalid}
          className={textArea({
            readonly: readOnly,
            wordLimit: !!wordLimit,
            state: fieldState,
          })}
          rows={rows}
          {...register(name, {
            ...rules,
            validate: {
              ...rules.validate,
              ...wordLimitRule,
            },
            onBlur: normalizeInput,
          })}
          {...(readOnly
            ? {
                readOnly: true,
              }
            : {})}
          {...(labelledBy && {
            "aria-labelledby": `${labelledBy} ${id}-label`,
          })}
          {...rest}
        />
        {wordLimit && (
          <div className="text-right">
            <WordCounter name={name} wordLimit={wordLimit} />
          </div>
        )}
      </div>
      <Field.Descriptions ids={descriptionIds} {...{ errors, name, context }} />
    </Field.Wrapper>
  );
};

export default TextArea;
