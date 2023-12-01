import CardOptionGroup, {
  type CardOption,
  type CardOptionGroupProps,
} from "./components/CardOptionGroup";
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
  DescriptionsProps,
  LabelProps,
  LegendProps,
  RequiredProps,
  WrapperProps,
} from "./components/Field";
import Input, { type InputProps } from "./components/Input";
import MultiSelectField from "./components/MultiSelect/MultiSelectField";
import RadioGroup, {
  type RadioGroupProps,
  type Radio,
} from "./components/RadioGroup";
import Repeater from "./components/Repeater/Repeater";
import RichTextInput from "./components/RichTextInput/RichTextInput";
import RichTextRenderer from "./components/RichTextInput/RichTextRenderer";
import Select, {
  MultiSelectFieldBase,
  type MultiSelectFieldBaseProps,
  type SelectProps,
  type Option,
} from "./components/Select";
import Submit, { type SubmitProps } from "./components/Submit";
import SwitchInput, {
  type SwitchInputProps,
} from "./components/SwitchInput/SwitchInput";
import TextArea, { type TextAreaProps } from "./components/TextArea";
import WordCounter, { type WordCounterProps } from "./components/WordCounter";
import BasicForm, {
  type BasicFormProps,
  type FieldLabels,
} from "./components/BasicForm";
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
} from "./utils";
import useInputStyles from "./hooks/useInputStyles";

export {
  DATE_SEGMENT,
  DateInput,
  CardOptionGroup,
  Checkbox,
  CheckButton,
  Checklist,
  Combobox,
  Field,
  Input,
  MultiSelectField,
  Repeater,
  RadioGroup,
  RichTextInput,
  RichTextRenderer,
  Select,
  MultiSelectFieldBase,
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
  InputProps,
  Radio,
  RadioGroupProps,
  SelectProps,
  MultiSelectFieldBaseProps,
  Option,
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
};
