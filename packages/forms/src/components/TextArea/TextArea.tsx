import * as React from "react";
import get from "lodash/get";
import { FieldError, useFormContext } from "react-hook-form";
import { useIntl } from "react-intl";

import { errorMessages } from "@gc-digital-talent/i18n";

import Base from "../Base";
import WordCounter from "../WordCounter";

import { CommonInputProps } from "../../types";
import { countNumberOfWords } from "../../utils";
import useFieldState from "../../hooks/useFieldState";
import useFieldStateStyles from "../../hooks/useFieldStateStyles";
import useInputDescribedBy from "../../hooks/useInputDescribedBy";
import useCommonInputStyles from "../../hooks/useCommonInputStyles";

export type TextAreaProps = React.DetailedHTMLProps<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
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
  const baseStyles = useCommonInputStyles();
  const stateStyles = useFieldStateStyles(name, !trackUnsaved);
  const fieldState = useFieldState(id, !trackUnsaved);
  const isUnsaved = fieldState === "dirty" && trackUnsaved;
  // To grab errors in nested objects we need to use lodash's get helper.
  const error = get(errors, name)?.message as FieldError;
  const [descriptionIds, ariaDescribedBy] = useInputDescribedBy({
    id,
    describedBy,
    show: {
      error,
      unsaved: trackUnsaved && isUnsaved,
      context,
    },
  });

  const whitespaceTrimmer = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    if (whitespaceTrim) {
      const value = e.target.value.trim();
      setValue(name, value);
    }
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
      "data-h2-scroll-padding-bottom": "base(x2.5)",
      "data-h2-padding-bottom": "base(x1.5)",
    };
  }

  return (
    <Base.Wrapper>
      <Base.Label id={`${id}-label`} htmlFor={id} required={!!rules.required}>
        {label}
      </Base.Label>
      <div data-h2-position="base(relative)" data-h2-z-index="base(1)">
        <textarea
          id={id}
          aria-describedby={ariaDescribedBy}
          required={!!rules.required}
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
            onBlur: whitespaceTrimmer,
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
          <div
            data-h2-position="base(absolute)"
            data-h2-bottom="base(x.5)"
            data-h2-right="base(x1.25)"
            data-h2-z-index="base(2)"
          >
            <WordCounter name={name} wordLimit={wordLimit} />
          </div>
        )}
      </div>
      {context && (
        <Base.Description id={descriptionIds?.context}>
          {context}
        </Base.Description>
      )}
      {error && (
        <Base.Error id={descriptionIds?.error}>{error?.toString()}</Base.Error>
      )}
    </Base.Wrapper>
  );
};

export default TextArea;
