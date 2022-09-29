import React from "react";

import { About, Featured, Hero, Opportunities, Profile } from "./partials";
import type { HeroProps } from "./partials/Hero/Hero";

const HomePage = ({ defaultImage }: HeroProps) => (
  <>
    <Hero defaultImage={defaultImage} />
    <Opportunities />
    <Profile />
    <Featured />
    <About />
  </>
);

export default HomePage;
