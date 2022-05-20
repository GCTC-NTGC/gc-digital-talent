import React, { HTMLAttributes, MouseEventHandler } from "react";

export interface TableOfContentsAnchor
  extends HTMLAttributes<HTMLAnchorElement> {
  id: string;
}

const TableOfContentsAnchor: React.FC<TableOfContentsAnchor> = ({
  id,
  children,
}) => {
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
      const offset = targetSection.offsetTop;
      window.scroll({
        top: offset,
        behavior: "smooth",
      });
    }
  };

  return (
    <a href={`#${id}`} data-h2-margin="b(bottom, xs)" onClick={handleClick}>
      {children}
    </a>
  );
};

export default TableOfContentsAnchor;
