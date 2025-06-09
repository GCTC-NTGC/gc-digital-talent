import { useMemo, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import {
  ControllerRenderProps,
  FieldValues,
  UseFormStateReturn,
} from "react-hook-form";
import { tv } from "tailwind-variants";

import MenuBar from "./MenuBar";
import Footer from "./Footer";
import { FieldState } from "../../types";
import { buildExtensions } from "./utils";
import { inputStyles } from "../../styles";

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

const controlledInput = tv({
  extend: inputStyles,
  base: "max-h-96 min-h-32 overflow-auto rounded-t-none border-1 border-gray bg-white text-black *:not-[:first-child]:not-[li]:mt-3 *:not-[:last-child]:not-[li]:mb-3 dark:bg-gray-600 iap:hover:text-primary-300 iap:dark:focus-visible:text-black [&_a]:text-primary-700 [&_a]:underline [&_a]:outline-offset-4 [&_a]:transition-all [&_a]:duration-50 [&_a]:ease-initial [&_a]:hover:text-primary [&_a]:focus-visible:text-black dark:[&_a]:text-primary-200 dark:[&_a]:hover:text-primary-100 dark:[&_a]:focus-visible:text-black *:[&_a:hover]:no-underline [&_h2]:text-3xl [&_h3]:text-2xl [&_h4]:text-xl [&_h5]:text-lg [&_ul]:list-disc [&_ul]:pl-8 [&_ul_ul]:list-[circle]",
  variants: {
    editable: {
      false: "cursor-not-allowed opacity-60",
    },
  },
});

const ControlledInput = ({
  field: { onChange, name },
  formState: { defaultValues },
  allowHeadings,
  fieldState,
  inputProps,
  editable,
  wordLimit,
}: ControlledInputProps) => {
  const content = defaultValues?.[name]
    ? String(defaultValues[name])
    : undefined;

  const editorProps = useMemo(
    () => ({
      attributes: {
        role: "textbox",
        "aria-multiline": "true",
        contenteditable: editable ? "true" : "false",
        class: controlledInput({ editable, state: fieldState }),
        ...inputProps,
      },
    }),
    [editable, fieldState, inputProps],
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
      <div className="text-black">
        <EditorContent {...{ content, editor }} />
      </div>
      <Footer {...{ wordLimit, name }} />
    </div>
  );
};

export default ControlledInput;
