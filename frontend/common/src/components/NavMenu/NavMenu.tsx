import React, { ReactElement } from "react";

export interface NavMenuProps {
  items: ReactElement[];
}

const NavMenu: React.FunctionComponent<NavMenuProps> = ({ items }) => {
  return (
    <div data-h2-flex-grid="b(middle, contained, flush, xl)">
      <div
        data-h2-flex-item="b(1of1) m(1of2)"
        data-h2-text-align="b(center) m(left)"
      >
        <nav>
          <ul className="reset-ul">
            {items.map((item) => {
              return (
                <li
                  data-h2-margin="b(top, none) b(bottom, s) b(right, m)"
                  data-h2-display="b(block) m(inline-block)"
                  key={item.key}
                >
                  <span
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
      </div>
    </div>
  );
};

export default NavMenu;
