import React, { HTMLAttributes } from "react";

export interface AnchorLinkProps extends HTMLAttributes<HTMLAnchorElement> {
  id: string;
}

const AnchorLink: React.FC<AnchorLinkProps> = ({ id, children }) => {
  const [targetSection, setTargetSection] = React.useState<HTMLElement | null>(
    null,
  );

  React.useEffect(() => {
    const section = document.getElementById(id);
    setTargetSection(section);
  }, [id]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (targetSection) {
      e.preventDefault();
      targetSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <a href={`#${id}`} data-h2-margin="b(bottom, s)" onClick={handleClick}>
      {children}
    </a>
  );
};

export default AnchorLink;
