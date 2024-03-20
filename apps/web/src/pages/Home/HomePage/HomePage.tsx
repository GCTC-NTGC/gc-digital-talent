import React from "react";
import { defineMessage, useIntl } from "react-intl";

import SEO from "~/components/SEO/SEO";

import { About, Featured, Hero, Opportunities, Profile } from "./components";
import type { HeroProps } from "./components/Hero/Hero";

export const pageTitle = defineMessage({
  defaultMessage: "Welcome",
  id: "4I6WIU",
  description: "Title for the homepage",
});
export const subTitle = defineMessage({
  defaultMessage:
    "Whether you're thinking about joining government or already an employee, hoping to hire or considering a new role, this is the place to come to be part of the GC digital community.",
  id: "tJnBx1",
  description: "SEO description of the application on the homepage",
});

const HomePage = ({ defaultImage }: HeroProps) => {
  const intl = useIntl();

  return (
    <>
      <SEO
        title={intl.formatMessage(pageTitle)}
        description={intl.formatMessage(subTitle)}
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
