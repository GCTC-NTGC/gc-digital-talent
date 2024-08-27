/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { screen } from "@testing-library/react";

import { axeTest, renderWithProviders } from "@gc-digital-talent/jest-helpers";
import { fakePools } from "@gc-digital-talent/fake-data";
import { makeFragmentData } from "@gc-digital-talent/graphql";

import PoolCard, { PoolCardProps, PoolCard_Fragment } from "./PoolCard";

const fakedPool = fakePools(1)[0];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const nullPool: any = {};
Object.keys(fakedPool).forEach((key) => {
  nullPool[key] = null;
});

const renderPoolCard = (props: PoolCardProps) =>
  renderWithProviders(<PoolCard {...props} />);

describe("PoolCard", () => {
  it("should have no accessibility errors", async () => {
    const { container } = renderPoolCard({
      poolQuery: makeFragmentData(fakedPool, PoolCard_Fragment),
    });

    await axeTest(container);
  });

  it("should render the card", async () => {
    renderPoolCard({
      poolQuery: makeFragmentData(fakedPool, PoolCard_Fragment),
    });

    expect(screen.getByText(/required skills/i)).toBeInTheDocument();
    expect(screen.getByText(/salary range/i)).toBeInTheDocument();
    expect(screen.getByText(/deadline/i)).toBeInTheDocument();
    expect(screen.getByText(/apply to this recruitment/i)).toBeInTheDocument();

    // check that the skill chips appeared
    expect(screen.getAllByRole("listitem")).toBeTruthy();

    // check the link on the apply button
    const applyLink = screen.getByRole("link", {
      name: /apply to this recruitment/i,
    });
    expect(applyLink).toHaveAttribute(
      "href",
      `/en/browse/pools/${fakedPool.id}`,
    );
  });

  it("should render the null state correctly", async () => {
    renderPoolCard({
      poolQuery: makeFragmentData(nullPool, PoolCard_Fragment),
    });

    expect(
      // Only way this works
      // eslint-disable-next-line testing-library/no-node-access
      screen.getByText(/Salary range/i).closest("p"),
    ).toHaveTextContent(/salary range: not available/i);
    expect(screen.getByText(/(No skills required)/i)).toBeInTheDocument();
    expect(screen.getByText(/(To be determined)/i)).toBeInTheDocument();

    expect(
      screen.queryByRole("link", {
        name: /apply to this recruitment/i,
      }),
    ).not.toBeInTheDocument();
  });
});
