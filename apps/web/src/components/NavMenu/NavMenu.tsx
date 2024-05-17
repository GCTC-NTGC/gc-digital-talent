import { ReactElement, ReactNode } from "react";
import { useIntl } from "react-intl";

import { useAuthentication } from "@gc-digital-talent/auth";
import { useFeatureFlags } from "@gc-digital-talent/env";

import NotificationDialog from "../NotificationDialog/NotificationDialog";

interface NavMenuProps {
  mainItems: ReactElement[];
  utilityItems?: ReactElement[];
}

const ListItem = ({ children }: { children?: ReactNode }) => (
  <li data-h2-flex-item="base(content)">
    <span className="block" data-h2-margin="base(0, 0, x.5, 0) p-tablet(0)">
      {children}
    </span>
  </li>
);

const NavMenu = ({ mainItems, utilityItems }: NavMenuProps) => {
  const intl = useIntl();
  const { loggedIn } = useAuthentication();
  const { notifications } = useFeatureFlags();
  return (
    <div
      data-h2-background-color="base(foreground) base:dark(white)"
      data-h2-border-bottom="base(1px solid black.20)"
      className="py-6"
    >
      <div data-h2-container="base(center, large, x1) p-tablet(center, large, x2)">
        <div className="flex flex-col sm:flex-row">
          <div className="flex-grow">
            <nav
              aria-label={intl.formatMessage({
                defaultMessage: "Main menu",
                id: "SY1LIh",
                description: "Label for the main navigation",
              })}
            >
              <ul className="flex justify-center gap-6 sm:justify-start">
                {mainItems.map((item) => (
                  <ListItem key={item.key}>{item}</ListItem>
                ))}
              </ul>
            </nav>
          </div>
          {utilityItems && utilityItems.length > 0 ? (
            <>
              <div data-h2-flex-grow="base(2)" data-h2-min-width="base(x3)" />
              <div className="flex-grow">
                <nav
                  aria-label={intl.formatMessage({
                    defaultMessage: "Account menu",
                    id: "LIhwJ+",
                    description: "Label for the user account navigation menu",
                  })}
                >
                  <ul className="flex justify-center gap-6 sm:justify-end">
                    {utilityItems.map((item) => (
                      <ListItem key={item.key}>{item}</ListItem>
                    ))}
                    {notifications && loggedIn && (
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
