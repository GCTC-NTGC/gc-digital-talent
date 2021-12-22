import * as React from "react";
import { cleanup, fireEvent, render } from "@testing-library/react";
import { jest } from "@jest/globals";
import RequestPage from "../../resources/js/components/request/RequestPage";

describe("Request Page", () => {
  afterEach(cleanup);

  it("renders without any error", () => {
    const wrapper = render(<RequestPage />);
    expect(wrapper).toBeTruthy();
  });
});
