import Checkbox, { type CheckboxProps } from "~/components/Checkbox";
import CheckButton, { CheckButtonProps } from "~/components/CheckButton";
import Checklist, { type ChecklistProps } from "~/components/Checklist";
import Combobox, { ComboboxProps } from "~/components/Combobox";
import Fieldset, { type FieldsetProps } from "~/components/Fieldset";
import Input, { type InputProps } from "~/components/Input";
import InputContext, {
  type InputContextProps,
} from "~/components/InputContext";
import InputError, {
  type InputErrorProps,
  type InputFieldError,
} from "~/components/InputError";
import InputLabel, { type InputLabelProps } from "~/components/InputLabel";
import InputUnsaved, {
  type InputUnsavedProps,
} from "~/components/InputUnsaved";
import InputWrapper, {
  type InputWrapperProps,
} from "~/components/InputWrapper";
import MultiSelectField from "~/components/MultiSelect/MultiSelectField";
import RadioGroup, { type RadioGroupProps } from "~/components/RadioGroup";
import Select, {
  SelectFieldV2,
  type SelectFieldV2Props,
  type SelectProps,
} from "~/components/Select";
import Submit, { type SubmitProps } from "~/components/Submit";
import TextArea, { type TextAreaProps } from "~/components/TextArea";
import WordCounter, { type WordCounterProps } from "~/components/WordCounter";

import BasicForm, {
  type BasicFormProps,
  type FieldLabels,
} from "~/components/BasicForm";
import ErrorSummary from "~/components/ErrorSummary";
import UnsavedChanges from "~/components/UnsavedChanges";

import {
  unpackMaybes,
  unpackIds,
  currentDate,
  enumToOptions,
  getValues,
  escapeAString,
  matchStringCaseDiacriticInsensitive,
  matchStringsCaseDiacriticInsensitive,
  countNumberOfWords,
  objectsToSortedOptions,
} from "./utils";

export {
  Checkbox,
  CheckButton,
  Checklist,
  Combobox,
  Fieldset,
  Input,
  InputContext,
  InputError,
  InputLabel,
  InputUnsaved,
  InputWrapper,
  MultiSelectField,
  RadioGroup,
  Select,
  SelectFieldV2,
  Submit,
  TextArea,
  WordCounter,
  BasicForm,
  ErrorSummary,
  UnsavedChanges,
};

export type {
  CheckboxProps,
  CheckButtonProps,
  ChecklistProps,
  ComboboxProps,
  FieldsetProps,
  InputProps,
  InputContextProps,
  InputErrorProps,
  InputFieldError,
  InputLabelProps,
  InputUnsavedProps,
  InputWrapperProps,
  RadioGroupProps,
  SelectProps,
  SelectFieldV2Props,
  SubmitProps,
  TextAreaProps,
  WordCounterProps,
  BasicFormProps,
  FieldLabels,
};

export {
  unpackMaybes,
  unpackIds,
  currentDate,
  enumToOptions,
  getValues,
  escapeAString,
  matchStringCaseDiacriticInsensitive,
  matchStringsCaseDiacriticInsensitive,
  countNumberOfWords,
  objectsToSortedOptions,
};
