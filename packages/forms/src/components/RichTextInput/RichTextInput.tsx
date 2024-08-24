import { useFormContext, Controller } from "react-hook-form";
import { useIntl } from "react-intl";
import get from "lodash/get";
import { DetailedHTMLProps, HTMLAttributes } from "react";

import { errorMessages } from "@gc-digital-talent/i18n";

import { CommonInputProps } from "../../types";
import Field from "../Field";
import ControlledInput from "./ControlledInput";
import { countNumberOfWords } from "../../utils";
import useFieldState from "../../hooks/useFieldState";
import useInputDescribedBy from "../../hooks/useInputDescribedBy";

type RichTextInputProps = Omit<
  DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
  "ref"
> &
  CommonInputProps & {
    /** Sets a limit on how many words can be submitted with this input */
    wordLimit?: number;
    /** Set this component to be read only */
    readOnly?: boolean;
  };

const RichTextInput = ({
  id,
  context,
  label,
  name,
  wordLimit,
  rules = {},
  readOnly,
  trackUnsaved = true,
  "aria-describedby": describedBy,
  "aria-labelledby": labelledBy,
}: RichTextInputProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const intl = useIntl();
  const fieldState = useFieldState(id, !trackUnsaved);
  const isUnsaved = fieldState === "dirty" && trackUnsaved;
  // To grab errors in nested objects we need to use lodash's get helper.
  const error = get(errors, name)?.message?.toString();
  const [descriptionIds, ariaDescribedBy] = useInputDescribedBy({
    id,
    describedBy,
    show: {
      error,
      unsaved: trackUnsaved && isUnsaved,
      context,
    },
  });

  const labelId = `${id}-label`;
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
      <Field.Label id={labelId} htmlFor={id} required={!!rules.required}>
        {label}
      </Field.Label>
      <Controller
        control={control}
        name={name}
        rules={{
          ...rules,
          validate: {
            ...rules.validate,
            ...wordLimitRule,
          },
        }}
        render={(props) => (
          <ControlledInput
            {...props}
            editable={!readOnly}
            wordLimit={wordLimit}
            trackUnsaved={trackUnsaved}
            fieldState={fieldState}
            inputProps={{
              id,
              ...wordLimitStyles,
              "aria-labelledBy": `${labelId}${
                labelledBy ? ` ${labelledBy}` : ``
              }`,
              ...(ariaDescribedBy && {
                "aria-describedby": ariaDescribedBy,
              }),
            }}
          />
        )}
      />
      <Field.Descriptions
        ids={descriptionIds}
        error={error}
        context={context}
      />
    </Field.Wrapper>
  );
};

export default RichTextInput;
