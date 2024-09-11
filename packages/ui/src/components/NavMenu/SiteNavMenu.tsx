import { useEffect, useState } from "react";
import XMarkIcon from "@heroicons/react/20/solid/XMarkIcon";
import Bars3Icon from "@heroicons/react/24/solid/Bars3Icon";
import { useIntl } from "react-intl";

import { useIsSmallScreen } from "@gc-digital-talent/helpers";
import { uiMessages } from "@gc-digital-talent/i18n";

import Button from "../Button";
import Separator from "../Separator";
import NavMenu from "./NavMenu";
import NavMenuWrapper from "./NavMenuWrapper";

const SiteNavMenu = () => {
  const intl = useIntl();
  const isSmallScreen = useIsSmallScreen();
  // retain menu preference in storage
  const [isMenuOpen, setMenuOpen] = useState(true);
  useEffect(() => {
    if (isSmallScreen) {
      setMenuOpen(false); // collapse menu if window resized to small
    }
  }, [isSmallScreen, setMenuOpen]);
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
        </NavMenu.List>
      </NavMenuWrapper>
      {isSmallScreen && (
        <Button
          color="white"
          data-h2-background-color="base:all(gray.darkest)"
          data-h2-color="base:all(white)"
          data-h2-position="base(absolute)"
          data-h2-bottom="base(x.75)"
          data-h2-right="base(x.75)"
          data-h2-z-index="base(9999)"
          icon={isMenuOpen ? XMarkIcon : Bars3Icon}
          onClick={() => setMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen
            ? intl.formatMessage(uiMessages.closeMenu)
            : intl.formatMessage(uiMessages.openMenu)}
        </Button>
      )}
    </>
  );
};

export default SiteNavMenu;
