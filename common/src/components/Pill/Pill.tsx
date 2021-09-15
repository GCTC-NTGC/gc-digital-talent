import React from "react";

export const Pill: React.FC<{ content: string }> = ({ content }) => {
  return (
    <span
      data-h2-border="b(darkpurple, all, solid, s)"
      data-h2-display="b(block)"
      data-h2-radius="b(m)"
      data-h2-bg-color="b(lightpurple[.1])"
      data-h2-padding="b(all, s)"
      data-h2-font-color="b(darkpurple)"
      data-h2-font-size="b(caption)"
      data-h2-margin="b(top-bottom, s)"
      role="cell"
    >
      {content}
    </span>
  );
};

export default Pill;
