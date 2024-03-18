import React from "react";

import WordCounter from "../WordCounter";

interface FooterProps {
  name: string;
  wordLimit?: number;
}

const Footer = ({ wordLimit, name }: FooterProps) => {
  if (!wordLimit) return null;

  return (
    <div data-h2-text-align="base(right)">
      <WordCounter name={name} wordLimit={wordLimit} />
    </div>
  );
};

export default Footer;
