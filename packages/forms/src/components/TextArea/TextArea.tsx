import { useFormContext } from "react-hook-form";
import { useIntl } from "react-intl";
import { DetailedHTMLProps, TextareaHTMLAttributes, FocusEvent } from "react";

import { errorMessages } from "@gc-digital-talent/i18n";

import Field from "../Field";
import WordCounter from "../WordCounter";
import type { CommonInputProps } from "../../types";
import { countNumberOfWords } from "../../utils";
import useFieldState from "../../hooks/useFieldState";
import useFieldStateStyles from "../../hooks/useFieldStateStyles";
import useInputDescribedBy from "../../hooks/useInputDescribedBy";
import useInputStyles from "../../hooks/useInputStyles";

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
  const baseStyles = useInputStyles();
  const stateStyles = useFieldStateStyles(name, !trackUnsaved);
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
  let wordLimitStyles = {};
  if (wordLimit) {
    wordLimitRule = {
      wordCount: (value: string) =>
        countNumberOfWords(value) <= wordLimit ||
        intl.formatMessage(errorMessages.overWordLimit, {
          value: wordLimit,
        }),
    };

    wordLimitStyles = {
      "data-h2-padding-bottom": "base(x2)",
    };
  }

  return (
    <Field.Wrapper>
      <Field.Label id={`${id}-label`} htmlFor={id} required={!!rules.required}>
        {label}
      </Field.Label>
      <div data-h2-position="base(relative)" data-h2-z-index="base(1)">
        <textarea
          id={id}
          aria-describedby={ariaDescribedBy}
          aria-required={!!rules.required}
          aria-invalid={isInvalid}
          data-h2-width="base(100%)"
          data-h2-resize="base(vertical)"
          rows={rows}
          {...baseStyles}
          {...stateStyles}
          {...wordLimitStyles}
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
                "data-h2-background-color": "base(background.dark)",
              }
            : {})}
          {...(labelledBy && {
            "aria-labelledby": `${labelledBy} ${id}-label`,
          })}
          {...rest}
        />
        {wordLimit && (
          <div data-h2-text-align="base(right)">
            <WordCounter name={name} wordLimit={wordLimit} />
          </div>
        )}
      </div>
      <Field.Descriptions ids={descriptionIds} {...{ errors, name, context }} />
    </Field.Wrapper>
  );
};

export default TextArea;
