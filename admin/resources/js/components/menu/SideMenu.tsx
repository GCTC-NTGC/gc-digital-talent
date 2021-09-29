import React, { ReactElement } from "react";

export const SideMenu: React.FunctionComponent<{
  items: ReactElement[];
}> = ({ items }) => {
  return (
    <nav
      data-h2-padding="m(top-bottom, m)"
      style={{ top: "0" }}
    >
      <ul
        style={{
          listStyle: "none",
          margin: "0",
          padding: "0",
        }}
      >
        {items.map((item) => {
          return (
            <li data-h2-margin="b(top, none) b(bottom, s)" key={item.key}>
              <span
                data-h2-border="b(white[.1], bottom, solid, s)"
                data-h2-display="b(block)"
                data-h2-font-color="b(white)"
                data-h2-padding="b(bottom, s)"
                data-h2-margin="b(bottom, s)"
                data-h2-font-style="b:h(reset)"
              >
                {item}
              </span>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default SideMenu;
