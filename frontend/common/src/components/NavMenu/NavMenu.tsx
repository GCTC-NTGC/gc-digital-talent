import React, { ReactElement } from "react";

export interface NavMenuProps {
  mainItems: ReactElement[];
  utilityItems?: ReactElement[];
}

const ListItem: React.FC = ({ children }) => (
  <li data-h2-flex-item="base(content)">
    <span
      data-h2-display="base(block)"
      data-h2-margin="base(0, 0, x.5, 0) p-tablet(0)"
      data-h2-text-decoration="base:hover(none)"
    >
      {children}
    </span>
  </li>
);

const NavMenu: React.FunctionComponent<NavMenuProps> = ({
  mainItems,
  utilityItems,
}) => {
  return (
    <div data-h2-container="base(center, large, x1) p-tablet(center, large, x2)">
      <div data-h2-padding="base(x1, 0)">
        <div data-h2-flex-grid="base(center, x3, 0)">
          <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
            <nav>
              <ul
                data-h2-list-style="base(none)"
                data-h2-flex-grid="base(flex-start, x1, 0)"
                data-h2-justify-content="base(center) p-tablet(flex-start)"
              >
                {mainItems.map((item) => (
                  <ListItem key={item.key}>{item}</ListItem>
                ))}
              </ul>
            </nav>
          </div>
          {utilityItems && utilityItems.length > 0 ? (
            <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
              <nav>
                <ul
                  data-h2-list-style="base(none)"
                  data-h2-flex-grid="base(flex-start, x1, 0)"
                  data-h2-justify-content="base(center) p-tablet(flex-end)"
                >
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
