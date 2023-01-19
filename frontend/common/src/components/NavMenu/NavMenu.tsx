import React, { ReactElement } from "react";
import { useIntl } from "react-intl";

export interface NavMenuProps {
  mainItems: ReactElement[];
  utilityItems?: ReactElement[];
}

const ListItem: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
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
  const intl = useIntl();
  return (
    <div
      data-h2-background-color="base(white) base:dark(black.light)"
      data-h2-padding="base(x1, 0)"
    >
      <div data-h2-container="base(center, large, x1) p-tablet(center, large, x2)">
        <div data-h2-flex-grid="base(center, x3, 0)">
          <div data-h2-flex-item="base(1of1) p-tablet(2of3)">
            <nav
              aria-label={intl.formatMessage({
                defaultMessage: "Main menu",
                id: "SY1LIh",
                description: "Label for the main navigation",
              })}
            >
              <ul
                data-h2-list-style="base(none)"
                data-h2-flex-grid="base(flex-start, x1, 0)"
                data-h2-justify-content="base(center) p-tablet(flex-start)"
                data-h2-padding="base(0, 0, 0, 0)"
              >
                {mainItems.map((item) => (
                  <ListItem key={item.key}>{item}</ListItem>
                ))}
              </ul>
            </nav>
          </div>
          {utilityItems && utilityItems.length > 0 ? (
            <div data-h2-flex-item="base(1of1) p-tablet(1of3)">
              <nav
                aria-label={intl.formatMessage({
                  defaultMessage: "Utility",
                  id: "HkzjEV",
                  description: "Label for the utility link navigation",
                })}
              >
                <ul
                  data-h2-list-style="base(none)"
                  data-h2-flex-grid="base(flex-start, x1, 0)"
                  data-h2-justify-content="base(center) p-tablet(flex-end)"
                  data-h2-padding="base(0, 0, 0, 0)"
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
