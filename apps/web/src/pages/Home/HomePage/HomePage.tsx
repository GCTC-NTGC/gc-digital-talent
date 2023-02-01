import React from "react";
import { useIntl } from "react-intl";

import SEO from "@common/components/SEO/SEO";

import { About, Featured, Hero, Opportunities, Profile } from "./partials";
import type { HeroProps } from "./partials/Hero/Hero";

const HomePage = ({ defaultImage }: HeroProps) => {
  const intl = useIntl();
  return (
    <>
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
