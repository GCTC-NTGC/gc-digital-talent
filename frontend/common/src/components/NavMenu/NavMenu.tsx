import React, { ReactElement } from "react";

export interface NavMenuProps {
  mainItems: ReactElement[];
  utilityItems?: ReactElement[];
}

const ListItem: React.FC = ({ children }) => (
  <li data-h2-flex-item="b(content)">
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
    <div data-h2-container="b(center, large, x1) p-tablet(center, large, x2)">
      <div data-h2-padding="b(x1, 0)">
        <div data-h2-flex-grid="b(center, 0, x3, 0)">
          <div
            data-h2-flex-item="b(1of1) p-tablet(1of2)"
            data-h2-text-align="b(center) p-tablet(left)"
          >
            <nav>
              <ul
                data-h2-list-style="b(none)"
                data-h2-flex-grid="b(flex-start, 0, x1, 0)">
                {mainItems.map((item) => (
                  <ListItem key={item.key}>{item}</ListItem>
                ))}
              </ul>
            </nav>
          </div>
          {utilityItems && utilityItems.length > 0 ? (
            <div
              data-h2-flex-item="b(1of1) p-tablet(1of2)"
              data-h2-text-align="b(center) p-tablet(right)"
            >
              <nav>
                <ul
                  data-h2-list-style="b(none)"
                  data-h2-flex-grid="b(flex-start, 0, x1, 0)"
                  data-h2-justify-content="b(flex-end)">
                  {utilityItems.map((item) => (
                    <ListItem key={item.key}>{item}</ListItem>
                  ))}
                </ul>
              </nav>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default NavMenu;
