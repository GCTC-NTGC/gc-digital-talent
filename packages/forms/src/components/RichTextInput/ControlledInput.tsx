import { useMemo, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import {
  ControllerRenderProps,
  FieldValues,
  UseFormStateReturn,
} from "react-hook-form";

import { useInputStylesDeprecated } from "../../hooks/useInputStyles";
import MenuBar from "./MenuBar";
import Footer from "./Footer";
import useFieldStateStyles from "../../hooks/useFieldStateStyles";
import { FieldState } from "../../types";
import { buildExtensions, contentStyles } from "./utils";

interface ControlledInputProps {
  field: ControllerRenderProps<FieldValues, string>;
  formState: UseFormStateReturn<FieldValues>;
  editable?: boolean;
  /** Sets a limit on how many words can be submitted with this input */
  wordLimit?: number;
  /** Determine if it should track unsaved changes and render it */
  trackUnsaved?: boolean;
  /** Current field state (to update styles) */
  fieldState: FieldState;
  inputProps?: Record<string, string>;
  allowHeadings?: boolean;
}

const ControlledInput = ({
  field: { onChange, name },
  formState: { defaultValues },
  allowHeadings,
  fieldState,
  inputProps,
  editable,
  wordLimit,
  trackUnsaved,
}: ControlledInputProps) => {
  const inputStyles = useInputStylesDeprecated();
  const stateStyles = useFieldStateStyles(name, !trackUnsaved);
  const content = defaultValues?.[name]
    ? String(defaultValues[name])
    : undefined;

  const editorProps = useMemo(
    () => ({
      attributes: {
        role: "textbox",
        "aria-multiline": "true",
        contenteditable: editable ? "true" : "false",
        ...inputStyles,
        ...contentStyles,
        ...(!editable && {
          "data-h2-cursor": "base(not-allowed)",
          "data-h2-opacity": "base(.6)",
        }),
        ...inputProps,
        ...stateStyles,
      },
    }),
    [editable, inputStyles, inputProps, stateStyles],
  );

  const editor = useEditor({
    extensions: buildExtensions(allowHeadings),
    content,
    editorProps,
    editable,
    onUpdate: ({ editor: submittedEditor }) => {
      let html = submittedEditor.getHTML();
      // If you remove existing comment, editor leaves behind
      // empty paragraph causing required rule to fail
      if (html === `<p></p>`) {
        html = "";
      }
      onChange(html);
    },
  });

  useEffect(() => {
    editor?.setOptions({ editorProps });
  }, [editor, editorProps, fieldState]);

  return (
    <div>
      <MenuBar allowHeadings={allowHeadings} {...{ editor }} />
      <div data-h2-color="base(black)">
        <EditorContent {...{ content, editor }} />
      </div>
      <Footer {...{ wordLimit, name }} />
    </div>
  );
};

export default ControlledInput;
