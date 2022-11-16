import React from "react";
import { DecoratorFn } from "@storybook/react";
import {MemoryRouter, Routes, Route} from "react-router-dom";


const withRouter: DecoratorFn = (Story) => {
  return (
    <MemoryRouter>
      <Routes>
        <Route path="/*" element={<Story />} />
      </Routes>
    </MemoryRouter>
  );
};

export default withRouter;
