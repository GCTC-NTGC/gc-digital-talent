import React, { useEffect } from "react";

interface ISection {
  text?: string | undefined;
  id: string;
}

const useTableOfContentsSections = () => {
  const [sections, setSections] = React.useState<ISection[]>([]);

  useEffect(() => {
    const allSections = document.querySelectorAll("[data-toc-section");
    const s: ISection[] = Array.from(allSections).map((el) => {
      const sec = el as HTMLElement;
      return {
        id: sec.id,
        text: sec.dataset.tocHeading,
      };
    });

    setSections(s);
  }, []);

  return sections;
};

export default useTableOfContentsSections;
