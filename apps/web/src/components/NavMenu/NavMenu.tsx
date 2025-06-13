import { ReactElement } from "react";
import { useIntl } from "react-intl";

import { useAuthentication } from "@gc-digital-talent/auth";
import { Container } from "@gc-digital-talent/ui";

import NotificationDialog from "../NotificationDialog/NotificationDialog";

interface NavMenuProps {
  mainItems: ReactElement[];
  utilityItems?: ReactElement[];
}

const NavMenu = ({ mainItems, utilityItems }: NavMenuProps) => {
  const intl = useIntl();
  const { loggedIn } = useAuthentication();
  return (
    <div className="border-b border-b-black/20 bg-gray-100 py-6 dark:bg-gray-700">
      <Container>
        <div className="flex flex-col xs:flex-row">
          <div className="grow">
            <nav
              aria-label={intl.formatMessage({
                defaultMessage: "Main menu",
                id: "SY1LIh",
                description: "Label for the main navigation",
              })}
            >
              <ul className="flex justify-center gap-3 xs:justify-start">
                {mainItems.map((item) => (
                  <li key={item.key}>{item}</li>
                ))}
              </ul>
            </nav>
          </div>
          {utilityItems && utilityItems.length > 0 ? (
            <nav
              aria-label={intl.formatMessage({
                defaultMessage: "Account menu",
                id: "LIhwJ+",
                description: "Label for the user account navigation menu",
              })}
              className="justify-self-end"
            >
              <ul className="flex justify-center gap-3 xs:justify-start">
                {utilityItems.map((item) => (
                  <li key={item.key}>{item}</li>
                ))}
                {loggedIn && (
                  <li>
                    <NotificationDialog />
                  </li>
                )}
              </ul>
            </nav>
          ) : null}
        </div>
      </Container>
    </div>
  );
};

export default NavMenu;
