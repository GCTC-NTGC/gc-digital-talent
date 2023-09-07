import React from "react";
import { EditorProvider } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CharacterCount from "@tiptap/extension-character-count";
import {
  ControllerRenderProps,
  FieldValues,
  UseFormStateReturn,
} from "react-hook-form";

import useCommonInputStyles from "../../hooks/useCommonInputStyles";
import MenuBar from "./MenuBar";
import Footer from "./Footer";
import useFieldStateStyles from "../../hooks/useFieldStateStyles";

interface ControlledInputProps {
  field: ControllerRenderProps<FieldValues, string>;
  formState: UseFormStateReturn<FieldValues>;
  editable?: boolean;
  /** Sets a limit on how many words can be submitted with this input */
  wordLimit?: number;
  /** Determine if it should track unsaved changes and render it */
  trackUnsaved?: boolean;
  inputProps?: {
    [name: string]: string;
  };
}

const ControlledInput = ({
  field: { onChange, name },
  formState: { defaultValues },
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
    }),
    CharacterCount,
  ];

  const editorProps = {
    attributes: {
      role: "textbox",
      "aria-multiline": "true",
      contenteditable: editable ? "true" : "false",
      ...inputStyles,
      "data-h2-radius": "base(0 0 rounded rounded)",
      "data-h2-margin-top": "base:children[:not(:first-child):not(li)](x.5)",
      "data-h2-margin-bottom": "base:children[:not(:last-child):not(li)](x.5)",
      ...(!editable && {
        "data-h2-cursor": "base(not-allowed)",
        "data-h2-color": "base(black.light)",
      }),
      ...inputProps,
      ...stateStyles,
    },
  };

  return (
    <EditorProvider
      {...{ extensions, content, editorProps }}
      onUpdate={({ editor }) => onChange(editor.getHTML())}
      slotBefore={<MenuBar />}
      slotAfter={<Footer wordLimit={wordLimit} name={name} />}
    >
      {null}
    </EditorProvider>
  );
};

export default ControlledInput;
