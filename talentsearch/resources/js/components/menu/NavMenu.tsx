import React, { ReactElement } from "react";

export const NavMenu: React.FunctionComponent<{
  items: ReactElement[];
}> = ({ items }) => {
  return (
    <nav>
      <ul className="reset-ul">
        {items.map((item) => {
          return (
            <li data-h2-margin="b(top, none) b(bottom, s)" key={item.key}>
              <span
                data-h2-display="b(block)"
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

export default NavMenu;
