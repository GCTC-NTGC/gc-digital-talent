import React from "react";
import { useIntl } from "react-intl";

import SEO from "@common/components/SEO/SEO";

import { Button } from "@common/components";
import { useLogger } from "@common/hooks/useLogger";
import { About, Featured, Hero, Opportunities, Profile } from "./partials";
import type { HeroProps } from "./partials/Hero/Hero";

const HomePage = ({ defaultImage }: HeroProps) => {
  const logger = useLogger();
  const intl = useIntl();
  return (
    <>
      <Button onClick={() => logger.emergency("Emergency!")}>Emergency</Button>
      <Button onClick={() => logger.alert("Alert!")}>Alert</Button>
      <Button onClick={() => logger.critical("Critical!")}>Critical</Button>
      <Button onClick={() => logger.error("Error!")}>Error</Button>
      <Button onClick={() => logger.warning("Warning!")}>Warning</Button>
      <Button onClick={() => logger.notice("Notice!")}>Notice</Button>
      <Button onClick={() => logger.info("Info!")}>Info</Button>
      <Button onClick={() => logger.debug("Debug!")}>Debug</Button>
      <SEO
        title={intl.formatMessage({
          defaultMessage: "Welcome",
          id: "4I6WIU",
          description: "Title for the homepage",
        })}
      />
      <Hero defaultImage={defaultImage} />
      <Opportunities />
      <Profile />
      <Featured />
      <About />
    </>
  );
};

export default HomePage;
