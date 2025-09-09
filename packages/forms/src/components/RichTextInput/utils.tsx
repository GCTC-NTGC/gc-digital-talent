import { CharacterCount } from "@tiptap/extensions";
import { Heading } from "@tiptap/extension-heading";
import { StarterKit } from "@tiptap/starter-kit";

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
    link: {
      openOnClick: false,
    },
  }),
  CharacterCount,
];

export const buildExtensions = (allowHeadings?: boolean) => [
  ...extensions,
  ...(allowHeadings ? [Heading.configure({ levels: [3] })] : []),
];
