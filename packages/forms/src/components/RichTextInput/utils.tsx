import { CharacterCount } from "@tiptap/extension-character-count";
import { Heading } from "@tiptap/extension-heading";
import { Link } from "@tiptap/extension-link";
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
  }),
  CharacterCount,
  Link.configure({
    openOnClick: false,
  }),
];

export const buildExtensions = (allowHeadings?: boolean) => [
  ...extensions,
  ...(allowHeadings ? [Heading.configure({ levels: [3] })] : []),
];

export const contentStyles = {
  "data-h2-color":
    "base:children[a](secondary.darker) base:children[a:hover](secondary) base:children[a:focus-visible](black) base:dark:children[a](secondary.lighter) base:dark:hover:children[a](secondary.light) base:dark:focus-visible:children[a](black) base:iap:hover(secondary.light) base:iap:focus-visible(black) base:iap:dark:hover(secondary.light) base:iap:dark:focus-visible(black)",
  // NOTE: Headings actually do appear one level smaller in most places
  "data-h2-font-size":
    "base:children[h2](h3) base:children[h3](h4) base:children[h4](h5) base:children[h5](h6)",
  "data-h2-margin-top": "base:children[:not(:first-child):not(li)](x.5)",
  "data-h2-margin-bottom": "base:children[:not(:last-child):not(li)](x.5)",
  "data-h2-outline-offset": "base:children[a](4px)",
  "data-h2-text-decoration":
    "base:children[a](underline) base:children[a:hover](none)",
  "data-h2-transition":
    "base:children[a](all ease 50ms) base:children[a](all ease 50ms)",
  "data-h2-min-height": "base(8rem)",
  "data-h2-max-height": "base(24rem)",
  "data-h2-overflow": "base(auto)",
  "data-h2-radius": "base(0 0 rounded rounded)",
};
