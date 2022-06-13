import React, { ReactElement } from "react";

export interface NavMenuProps {
  mainItems: ReactElement[];
  utilityItems?: ReactElement[];
}

const ListItem: React.FC = ({ children }) => (
  <li
    data-h2-margin="b(0, x1, x.5, 0)"
    data-h2-display="b(block) m(inline-block)"
  >
    <span data-h2-margin="b(0, 0, x.5, 0)" data-h2-font-style="b:hover(reset)">
      {children}
    </span>
  </li>
);

const NavMenu: React.FunctionComponent<NavMenuProps> = ({
  mainItems,
  utilityItems,
}) => {
  return (
    <div data-h2-flex-grid="b(center, 0, x3)">
      <div
        data-h2-flex-item="b(1of1) m(1of2)"
        data-h2-text-align="b(center) m(left)"
      >
        <nav>
          <ul className="reset-ul">
            {mainItems.map((item) => (
              <ListItem key={item.key}>{item}</ListItem>
            ))}
          </ul>
        </nav>
      </div>
      {utilityItems && utilityItems.length > 0 ? (
        <div
          data-h2-flex-item="b(1of1) m(1of2)"
          data-h2-text-align="b(center) m(right)"
        >
          <nav>
            <ul className="reset-ul">
              {utilityItems.map((item) => (
                <ListItem key={item.key}>{item}</ListItem>
              ))}
            </ul>
          </nav>
        </div>
      ) : null}
    </div>
  );
};

export default NavMenu;
