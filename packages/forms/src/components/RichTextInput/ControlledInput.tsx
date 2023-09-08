import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CharacterCount from "@tiptap/extension-character-count";
import Link from "@tiptap/extension-link";
import {
  ControllerRenderProps,
  FieldValues,
  UseFormStateReturn,
} from "react-hook-form";

import useCommonInputStyles from "../../hooks/useCommonInputStyles";
import MenuBar from "./MenuBar";
import Footer from "./Footer";
import useFieldStateStyles from "../../hooks/useFieldStateStyles";
import { FieldState } from "../../types";

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
  inputProps?: {
    [name: string]: string;
  };
}

const ControlledInput = ({
  field: { onChange, name },
  formState: { defaultValues },
  fieldState,
  inputProps,
  editable,
  wordLimit,
  trackUnsaved,
}: ControlledInputProps) => {
  const inputStyles = useCommonInputStyles();
  const stateStyles = useFieldStateStyles(name, !trackUnsaved);
  const content = defaultValues ? defaultValues[name] : undefined;
  const extensions = [
    // REF: https://tiptap.dev/api/extensions/starter-kit
    StarterKit.configure({
      // Disabled Nodes
      blockquote: false,
      bold: false,
      code: false,
      codeBlock: false,
      heading: false,
      italic: false,
      orderedList: false,
      strike: false,

      // Customize existing nodes
      bulletList: {
        keepMarks: false,
        keepAttributes: false,
      },
    }),
    CharacterCount,
    Link.configure({
      openOnClick: false,
    }),
  ];
  const editorProps = React.useMemo(
    () => ({
      attributes: {
        role: "textbox",
        "aria-multiline": "true",
        contenteditable: editable ? "true" : "false",
        ...inputStyles,
        "data-h2-color":
          "base:children[a](secondary.darker) base:children:hover[a](secondary.darkest)",
        "data-h2-radius": "base(0 0 rounded rounded)",
        "data-h2-margin-top": "base:children[:not(:first-child):not(li)](x.5)",
        "data-h2-margin-bottom":
          "base:children[:not(:last-child):not(li)](x.5)",
        "data-h2-min-height": "base(8rem)",
        "data-h2-max-height": "base(24rem)",
        "data-h2-overflow": "base(auto)",
        ...(!editable && {
          "data-h2-cursor": "base(not-allowed)",
          "data-h2-color": "base(black.light)",
        }),
        ...inputProps,
        ...stateStyles,
      },
    }),
    [editable, inputStyles, inputProps, stateStyles],
  );

  const editor = useEditor({
    extensions,
    content,
    editorProps,
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

  React.useEffect(() => {
    editor?.setOptions({ editorProps });
  }, [editor, editorProps, fieldState]);

  return (
    <div>
      <MenuBar {...{ editor }} />
      <EditorContent {...{ content, editor }} />
      <Footer {...{ editor, wordLimit, name }} />
    </div>
  );
};

export default ControlledInput;
