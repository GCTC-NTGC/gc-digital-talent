import CardOptionGroup, {
  type CardOption,
  type CardOptionGroupProps,
} from "./components/CardOptionGroup/CardOptionGroup";
import Checkbox, { type CheckboxProps } from "./components/Checkbox/Checkbox";
import CheckButton, {
  CheckButtonProps,
} from "./components/CheckButton/CheckButton";
import Checklist, {
  type ChecklistProps,
  type CheckboxOption,
} from "./components/Checklist/Checklist";
import Combobox, { ComboboxProps } from "./components/Combobox/Combobox";
import DateInput, { DateInputProps } from "./components/DateInput/DateInput";
import { DateSegment, DATE_SEGMENT } from "./components/DateInput/types";
import Field, {
  DescriptionsProps,
  LabelProps,
  LegendProps,
  RequiredProps,
  WrapperProps,
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
import Submit, { type SubmitProps } from "./components/Submit/Submit";
import SwitchInput, {
  type SwitchInputProps,
} from "./components/SwitchInput/SwitchInput";
import TextArea, { type TextAreaProps } from "./components/TextArea/TextArea";
import WordCounter, {
  type WordCounterProps,
} from "./components/WordCounter/WordCounter";
import BasicForm, { type BasicFormProps } from "./components/BasicForm";
import ErrorSummary from "./components/ErrorSummary";
import UnsavedChanges from "./components/UnsavedChanges";
import {
  unpackIds,
  enumToOptions,
  enumToOptionsWorkRegionSorted,
  getValues,
  escapeAString,
  matchStringCaseDiacriticInsensitive,
  matchStringsCaseDiacriticInsensitive,
  countNumberOfWords,
  objectsToSortedOptions,
  htmlToRichTextJSON,
  flattenErrors,
  alphaSortOptions,
} from "./utils";
import useInputStyles from "./hooks/useInputStyles";
import { Option, OptGroup, OptGroupOrOption, FieldLabels } from "./types";

export {
  DATE_SEGMENT,
  DateInput,
  CardOptionGroup,
  Checkbox,
  CheckButton,
  Checklist,
  Combobox,
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
  ComboboxProps,
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
  DescriptionsProps,
  LabelProps,
  LegendProps,
  RequiredProps,
  WrapperProps,
};

export {
  unpackIds,
  enumToOptions,
  enumToOptionsWorkRegionSorted,
  getValues,
  escapeAString,
  matchStringCaseDiacriticInsensitive,
  matchStringsCaseDiacriticInsensitive,
  countNumberOfWords,
  objectsToSortedOptions,
  useInputStyles as useCommonInputStyles,
  htmlToRichTextJSON,
  flattenErrors,
  alphaSortOptions,
};
