import Checkbox, { type CheckboxProps } from "./components/Checkbox";
import CheckButton, { CheckButtonProps } from "./components/CheckButton";
import Checklist, {
  type ChecklistProps,
  type CheckboxOption,
} from "./components/Checklist";
import Combobox, { ComboboxProps } from "./components/Combobox";
import DateInput, { DateInputProps } from "./components/DateInput/DateInput";
import { DateSegment, DATE_SEGMENT } from "./components/DateInput/types";
import Field, {
  ContextProps,
  DescriptionsProps,
  LabelProps,
  LegendProps,
  RequiredProps,
  WrapperProps,
} from "./components/Field";
import Input, { type InputProps } from "./components/Input";
import MultiSelectField from "./components/MultiSelect/MultiSelectField";
import RadioGroup, { type RadioGroupProps } from "./components/RadioGroup";
import Repeater from "./components/Repeater/Repeater";
import Select, {
  SelectFieldV2,
  type SelectFieldV2Props,
  type SelectProps,
  type Option,
} from "./components/Select";
import Submit, { type SubmitProps } from "./components/Submit";
import TextArea, { type TextAreaProps } from "./components/TextArea";
import WordCounter, { type WordCounterProps } from "./components/WordCounter";

import BasicForm, {
  type BasicFormProps,
  type FieldLabels,
} from "./components/BasicForm";
import ErrorSummary from "./components/ErrorSummary";
import UnsavedChanges from "./components/UnsavedChanges";

import {
  unpackMaybes,
  unpackIds,
  enumToOptions,
  enumToOptionsWorkRegionSorted,
  getValues,
  escapeAString,
  matchStringCaseDiacriticInsensitive,
  matchStringsCaseDiacriticInsensitive,
  countNumberOfWords,
  objectsToSortedOptions,
} from "./utils";

import useCommonInputStyles from "./hooks/useCommonInputStyles";

export {
  DATE_SEGMENT,
  DateInput,
  Checkbox,
  CheckButton,
  Checklist,
  Combobox,
  Field,
  Input,
  MultiSelectField,
  Repeater,
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
  DateInputProps,
  DateSegment,
  CheckboxProps,
  CheckboxOption,
  CheckButtonProps,
  ChecklistProps,
  ComboboxProps,
  InputProps,
  RadioGroupProps,
  SelectProps,
  SelectFieldV2Props,
  Option,
  SubmitProps,
  TextAreaProps,
  WordCounterProps,
  BasicFormProps,
  FieldLabels,
  ContextProps,
  DescriptionsProps,
  LabelProps,
  LegendProps,
  RequiredProps,
  WrapperProps,
};

export {
  unpackMaybes,
  unpackIds,
  enumToOptions,
  enumToOptionsWorkRegionSorted,
  getValues,
  escapeAString,
  matchStringCaseDiacriticInsensitive,
  matchStringsCaseDiacriticInsensitive,
  countNumberOfWords,
  objectsToSortedOptions,
  useCommonInputStyles,
};
