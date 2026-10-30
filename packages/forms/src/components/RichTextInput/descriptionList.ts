import { Node, mergeAttributes } from "@tiptap/react";

const DescriptionList = Node.create({
  name: "descriptionList",
  group: "block",
  content: "(descriptionTerm descriptionDetails)+",

  parseHTML() {
    return [{ tag: "dl" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["dl", mergeAttributes(HTMLAttributes), 0];
  },
});

const DescriptionTerm = Node.create({
  name: "descriptionTerm",
  group: "block",
  content: "inline*", // Only text/inline
  defining: true,

  parseHTML() {
    return [{ tag: "dt" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["dt", mergeAttributes(HTMLAttributes), 0];
  },
});

const DescriptionDetails = Node.create({
  name: "descriptionDetails",
  group: "block",
  content: "block+", // Allows paragraphs, lists, etc., inside the description
  defining: true,

  parseHTML() {
    return [{ tag: "dd" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["dd", mergeAttributes(HTMLAttributes), 0];
  },
});

export default [DescriptionList, DescriptionTerm, DescriptionDetails];
