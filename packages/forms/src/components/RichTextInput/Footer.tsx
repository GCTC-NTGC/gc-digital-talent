import React from "react";
import { useCurrentEditor } from "@tiptap/react";

import WordCounter from "../WordCounter";

interface FooterProps {
  name: string;
  wordLimit?: number;
}

const Footer = ({ wordLimit, name }: FooterProps) => {
  const { editor } = useCurrentEditor();

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
