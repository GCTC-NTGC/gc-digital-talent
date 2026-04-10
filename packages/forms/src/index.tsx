import { ErrorMessage } from "@hookform/error-message";

import CardOptionGroup, {
  type CardOption,
  type CardOptionGroupProps,
} from "./components/CardOptionGroup/CardOptionGroup";
import Checkbox, { type CheckboxProps } from "./components/Checkbox/Checkbox";
import CheckButton, {
  type CheckButtonProps,
} from "./components/CheckButton/CheckButton";
import Checklist, {
  type ChecklistProps,
  type CheckboxOption,
} from "./components/Checklist/Checklist";
import Combobox, { type ComboboxProps } from "./components/Combobox/Combobox";
import { type Option as ComboboxOption } from "./components/Combobox/types";
import DateInput, {
  type DateInputProps,
} from "./components/DateInput/DateInput";
import { type DateSegment, DATE_SEGMENT } from "./components/DateInput/types";
import Field, {
  type DescriptionsProps,
  type LabelProps,
  type LegendProps,
  type RequiredProps,
  type WrapperProps,
} from "./components/Field";
import HiddenInput, {
  type HiddenInputProps,
} from "./components/HiddenInput/HiddenInput";
import Input, { type InputProps } from "./components/Input/Input";
import RadioGroup, {
  type RadioGroupProps,
  type Radio,
} from "./components/RadioGroup/RadioGroup";
import Repeater from "./components/Repeater/Repeater";
import RichTextInput from "./components/RichTextInput/RichTextInput";
import RichTextRenderer from "./components/RichTextInput/RichTextRenderer";
import Select, { type SelectProps } from "./components/Select/Select";
import Submit, { type SubmitProps } from "./components/Submit";
import SwitchInput, {
  type SwitchInputProps,
} from "./components/SwitchInput/SwitchInput";
import TextArea, { type TextAreaProps } from "./components/TextArea/TextArea";
import WordCounter, { type WordCounterProps } from "./components/WordCounter";
import BasicForm, { type BasicFormProps } from "./components/BasicForm";
import ErrorSummary from "./components/ErrorSummary";
import UnsavedChanges from "./components/UnsavedChanges";
import {
  unpackIds,
  enumToOptions,
  localizedEnumToOptions,
  getValues,
  escapeAString,
  matchStringCaseDiacriticInsensitive,
  countNumberOfWords,
  objectsToSortedOptions,
  htmlToRichTextJSON,
  flattenErrors,
  alphaSortOptions,
} from "./utils";
import useFieldState from "./hooks/useFieldState";
import useInputDescribedBy from "./hooks/useInputDescribedBy";
import { inputStyles, inputStateStyles } from "./styles";
import {
  type Option,
  type OptGroup,
  type OptGroupOrOption,
  type FieldLabels,
  type FieldState,
  type CommonInputProps,
} from "./types";

export {
  DATE_SEGMENT,
  DateInput,
  CardOptionGroup,
  Checkbox,
  CheckButton,
  Checklist,
  Combobox,
  ErrorMessage,
  Field,
  HiddenInput,
  Input,
  Repeater,
  RadioGroup,
  RichTextInput,
  RichTextRenderer,
  Select,
  Submit,
  SwitchInput,
  TextArea,
  WordCounter,
  BasicForm,
  ErrorSummary,
  UnsavedChanges,
};

export type {
  DateInputProps,
  DateSegment,
  CardOption,
  CardOptionGroupProps,
  CheckboxProps,
  CheckboxOption,
  CheckButtonProps,
  ChecklistProps,
  CommonInputProps,
  ComboboxProps,
  ComboboxOption,
  HiddenInputProps,
  InputProps,
  Radio,
  RadioGroupProps,
  SelectProps,
  Option,
  OptGroup,
  OptGroupOrOption,
  SubmitProps,
  SwitchInputProps,
  TextAreaProps,
  WordCounterProps,
  BasicFormProps,
  FieldLabels,
  FieldState,
  DescriptionsProps,
  LabelProps,
  LegendProps,
  RequiredProps,
  WrapperProps,
};

export {
  unpackIds,
  enumToOptions,
  localizedEnumToOptions,
  getValues,
  escapeAString,
  matchStringCaseDiacriticInsensitive,
  countNumberOfWords,
  objectsToSortedOptions,
  useInputDescribedBy,
  useFieldState,
  htmlToRichTextJSON,
  flattenErrors,
  alphaSortOptions,
  inputStyles,
  inputStateStyles,
};
