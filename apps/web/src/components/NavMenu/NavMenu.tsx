import { ReactElement, ReactNode } from "react";
import { useIntl } from "react-intl";

import { useAuthentication } from "@gc-digital-talent/auth";

import NotificationDialog from "../NotificationDialog/NotificationDialog";

interface NavMenuProps {
  mainItems: ReactElement[];
  utilityItems?: ReactElement[];
}

const ListItem = ({ children }: { children?: ReactNode }) => (
  <li data-h2-flex-item="base(content)">
    <span
      data-h2-display="base(block)"
      data-h2-margin="base(0, 0, x.5, 0) p-tablet(0)"
    >
      {children}
    </span>
  </li>
);

const NavMenu = ({ mainItems, utilityItems }: NavMenuProps) => {
  const intl = useIntl();
  const { loggedIn } = useAuthentication();
  return (
    <div
      data-h2-background-color="base(foreground) base:dark(white)"
      data-h2-border-bottom="base(1px solid black.20)"
      data-h2-padding="base(x1, 0)"
    >
      <div data-h2-wrapper="base(center, large, x1) p-tablet(center, large, x2)">
        <div
          data-h2-display="base(flex)"
          data-h2-flex-direction="base(column) p-tablet(row)"
        >
          <div data-h2-flex-grow="base(1)">
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
            <>
              <div data-h2-flex-grow="base(2)" data-h2-min-width="base(x3)" />
              <div data-h2-flex-grow="base(1)">
                <nav
                  aria-label={intl.formatMessage({
                    defaultMessage: "Account menu",
                    id: "LIhwJ+",
                    description: "Label for the user account navigation menu",
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
                    {loggedIn && (
                      <ListItem>
                        <NotificationDialog />
                      </ListItem>
                    )}
                  </ul>
                </nav>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default NavMenu;
