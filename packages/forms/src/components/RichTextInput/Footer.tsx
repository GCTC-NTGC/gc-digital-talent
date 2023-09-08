import React from "react";
import { Editor } from "@tiptap/react";

import WordCounter from "../WordCounter";

interface FooterProps {
  name: string;
  wordLimit?: number;
  editor: Editor | null;
}

const Footer = ({ wordLimit, name, editor }: FooterProps) => {
  if (!wordLimit) return null;

  return (
    <div data-h2-text-align="base(right)">
      <WordCounter
        name={name}
        wordLimit={wordLimit}
        currentCount={editor?.storage.characterCount.words()}
      />
    </div>
  );
};

export default Footer;
