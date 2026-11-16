import { Extension } from "@tiptap/react";

const Anchor = Extension.create({
  name: "anchorId",
  addGlobalAttributes() {
    return [
      {
        types: ["heading", "link"],
        attributes: {
          id: {
            default: null,
            parseHTML: (element) => element.getAttribute("id"),
          },
        },
      },
    ];
  },
});

export default Anchor;
