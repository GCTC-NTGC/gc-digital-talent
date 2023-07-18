/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import {
  screen,
  fireEvent,
  waitFor,
  act,
  within,
} from "@testing-library/react";
import React from "react";
import { Provider as GraphqlProvider } from "urql";
import { pipe, fromValue, delay } from "wonka";

import { axeTest, renderWithProviders } from "@gc-digital-talent/jest-helpers";

import { fakePoolCandidates } from "@gc-digital-talent/fake-data";
import { ApplicationSelfDeclaration } from "../ApplicationSelfDeclarationPage";

const mockClient = {
  executeQuery: jest.fn(() => pipe(fromValue({}), delay(0))),
  // See: https://github.com/FormidableLabs/urql/discussions/2057#discussioncomment-1568874
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;

const mockApplication = fakePoolCandidates(1)[0];

const mockCallback = jest.fn();

const renderSelfDeclarationForm = () =>
  renderWithProviders(
    <GraphqlProvider value={mockClient}>
      <ApplicationSelfDeclaration
        application={mockApplication}
        indigenousCommunities={[]}
        signature={null}
        onSubmit={mockCallback}
      />
    </GraphqlProvider>,
  );

describe("SelfDeclarationForm", () => {
  it("should have no accessibility errors", async () => {
    await act(async () => {
      const { container } = renderSelfDeclarationForm();
      await axeTest(container);
    });
  });

  it("should not display communities if not Indigenous", async () => {
    await act(async () => {
      renderSelfDeclarationForm();
    });

    await act(async () => {
      fireEvent.click(
        await screen.getByRole("radio", { name: /i am not a member/i }),
      );
    });

    expect(
      await screen.queryByRole("checkbox", { name: /i am first nations/i }),
    ).not.toBeInTheDocument();

    expect(
      await screen.queryByRole("checkbox", { name: /i am inuk/i }),
    ).not.toBeInTheDocument();

    expect(
      await screen.queryByRole("checkbox", { name: /i am métis/i }),
    ).not.toBeInTheDocument();

    expect(
      await screen.queryByRole("checkbox", {
        name: /i don't see my community/i,
      }),
    ).not.toBeInTheDocument();
  });

  it("should display communities if Indigenous", async () => {
    await act(async () => {
      renderSelfDeclarationForm();
    });

    await act(async () => {
      fireEvent.click(
        await screen.getByRole("radio", { name: /i affirm that/i }),
      );
    });

    expect(
      await screen.findByRole("checkbox", {
        name: /I am Status First Nations/i,
      }),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("checkbox", {
        name: /I am non-Status First Nations/i,
      }),
    ).toBeInTheDocument();

    expect(
      await screen.findByRole("checkbox", { name: /i am inuk/i }),
    ).toBeInTheDocument();

    expect(
      await screen.findByRole("checkbox", { name: /i am métis/i }),
    ).toBeInTheDocument();

    expect(
      await screen.findByRole("checkbox", {
        name: /i don't see my community/i,
      }),
    ).toBeInTheDocument();
  });

  it("should display alert if community selected with other", async () => {
    await act(async () => {
      renderSelfDeclarationForm();
    });

    fireEvent.click(
      await screen.getByRole("radio", { name: /i affirm that/i }),
    );

    fireEvent.click(
      await screen.findByRole("checkbox", {
        name: /i am inuk/i,
      }),
    );

    fireEvent.click(
      await screen.findByRole("checkbox", {
        name: /i don't see my community/i,
      }),
    );

    expect(
      await within(await screen.findByRole("alert")).findByRole("heading", {
        name: /are you sure/i,
      }),
    ).toBeInTheDocument();
  });

  it("should submit with all required fields", async () => {
    mockCallback.mockReset();
    await act(async () => {
      renderSelfDeclarationForm();
    });

    fireEvent.click(
      await screen.getByRole("radio", { name: /i affirm that/i }),
    );

    fireEvent.click(
      await screen.findByRole("checkbox", {
        name: /i am status first nations/i,
      }),
    );

    fireEvent.change(
      await screen.findByRole("textbox", {
        name: /signature/i,
      }),
      {
        target: {
          value: "test",
        },
      },
    );

    const saveBtn = await screen.findByRole("button", {
      name: /sign and continue/i,
    });

    fireEvent.submit(saveBtn);

    await waitFor(() => {
      expect(mockCallback).toHaveBeenCalled();
    });
  });
});
