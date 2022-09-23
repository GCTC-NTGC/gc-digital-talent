import React from "react";

import { About, Featured, Hero, Opportunities, Profile } from "./partials";

// Create the page component
const Home = () => {
  return (
    <>
      <Hero />
      <Opportunities />
      <Profile />
      <Featured />
      <About />
    </>
  );
};

// Export the component
export default Home;
