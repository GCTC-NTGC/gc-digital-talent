import { useEffect, useState } from "react";
import XMarkIcon from "@heroicons/react/20/solid/XMarkIcon";
import Bars3Icon from "@heroicons/react/24/solid/Bars3Icon";
import { useIntl } from "react-intl";

import { useIsSmallScreen } from "@gc-digital-talent/helpers";
import { uiMessages } from "@gc-digital-talent/i18n";
import {
  Button,
  NavMenu,
  NavMenuWrapper,
  Separator,
} from "@gc-digital-talent/ui";

import UnreadAlertBellIcon from "./UnreadAlertBellIcon";
import NotificationDialog from "../NotificationDialog/NotificationDialog";

interface SiteNavMenuProps {}

const SiteNavMenu = () => {
  const intl = useIntl();
  const isSmallScreen = useIsSmallScreen(1080);
  // retain menu preference in storage
  const [isMenuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    if (isSmallScreen) {
      setMenuOpen(false); // collapse menu if window resized to small
    }
  }, [isSmallScreen, setMenuOpen]);

  const [isNotificationDialogOpen, setNotificationDialogOpen] = useState(false);
  return (
    <>
      <NavMenuWrapper label="Menu" onOpenChange={setMenuOpen} open={isMenuOpen}>
        <NavMenu.List data-h2-flex-direction="base(column) l-tablet(row)">
          <NavMenu.Item>
            <NavMenu.Trigger
              color={isSmallScreen ? "black" : "whiteFixed"}
              mode="text"
              block={false}
            >
              Admin
            </NavMenu.Trigger>
            <NavMenu.Content>
              <NavMenu.List>
                <NavMenu.Item>
                  <NavMenu.Link title="Applicant" href="#" color="black">
                    Applicant
                  </NavMenu.Link>
                </NavMenu.Item>
                <NavMenu.Item>
                  <NavMenu.Link title="Manager" href="#" color="black">
                    Manager
                  </NavMenu.Link>
                </NavMenu.Item>
              </NavMenu.List>
            </NavMenu.Content>
          </NavMenu.Item>
          <Separator space="none" data-h2-display="l-tablet(none)" />
          <NavMenu.Item>
            <NavMenu.Link title="Home" href="#">
              Home
            </NavMenu.Link>
          </NavMenu.Item>
          <NavMenu.Item>
            <NavMenu.Link title="Dashboard" href="#">
              Dashboard
            </NavMenu.Link>
          </NavMenu.Item>
          <NavMenu.Item>
            <NavMenu.Link title="Find a job" href="#">
              Find a job
            </NavMenu.Link>
          </NavMenu.Item>
          <Separator space="none" data-h2-display="l-tablet(none)" />
          <NavMenu.Item data-h2-margin-left="l-tablet(auto)">
            <NavMenu.Trigger
              color={isSmallScreen ? "black" : "whiteFixed"}
              mode="text"
              block={false}
            >
              Your account
            </NavMenu.Trigger>
            <NavMenu.Content>
              <NavMenu.List>
                <NavMenu.Item>
                  <NavMenu.Link title="Applicant" href="#" color="black">
                    Applicant profile
                  </NavMenu.Link>
                </NavMenu.Item>
                <NavMenu.Item>
                  <NavMenu.Link title="Career" href="#" color="black">
                    Career timeline
                  </NavMenu.Link>
                </NavMenu.Item>
                <NavMenu.Item>
                  <NavMenu.Link title="Skill" href="#" color="black">
                    Skill library
                  </NavMenu.Link>
                </NavMenu.Item>
              </NavMenu.List>
            </NavMenu.Content>
          </NavMenu.Item>
          <NavMenu.Item data-h2-display="base(none) l-tablet(inline-flex)">
            <NotificationDialog
              open={isNotificationDialogOpen}
              onOpenChange={setNotificationDialogOpen}
            />
          </NavMenu.Item>
        </NavMenu.List>
      </NavMenuWrapper>
      {isSmallScreen && (
        <div
          data-h2-position="base(fixed)"
          data-h2-bottom="base(x.75)"
          data-h2-right="base(x.75)"
          data-h2-z-index="base(9999)"
          data-h2-display="base(flex)"
          data-h2-gap="base(x.75)"
        >
          <Button
            color="black"
            mode="cta"
            icon={isMenuOpen ? XMarkIcon : Bars3Icon}
            onClick={() => setMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen
              ? intl.formatMessage(uiMessages.closeMenu)
              : intl.formatMessage(uiMessages.openMenu)}
          </Button>
          <NotificationDialog
            open={isNotificationDialogOpen}
            onOpenChange={setNotificationDialogOpen}
          />
        </div>
      )}
    </>
  );
};

export default SiteNavMenu;
