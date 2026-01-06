import { screen } from "@testing-library/react";

import {
  expectNoAccessibilityErrors,
  renderWithProviders,
} from "@gc-digital-talent/vitest-helpers";
import { fakePools } from "@gc-digital-talent/fake-data";
import { makeFragmentData, Pool } from "@gc-digital-talent/graphql";

import PoolCard, { PoolCardProps, PoolCard_Fragment } from "./PoolCard";

const fakedPool = fakePools(1)[0];
const nullPool: Omit<Pool, "activities"> = {
  __typename: "Pool",
  id: "uuid",
};

const renderPoolCard = (props: PoolCardProps) =>
  renderWithProviders(<PoolCard {...props} />);

describe("PoolCard", () => {
  it("should have no accessibility errors", async () => {
    const { container } = renderPoolCard({
      poolQuery: makeFragmentData(fakedPool, PoolCard_Fragment),
    });

    await expectNoAccessibilityErrors(container);
  });

  it("should render the card", () => {
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
    expect(applyLink).toHaveAttribute("href", `/en/jobs/${fakedPool.id}`);
  });

  it("should render the null state correctly", () => {
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
  });
});
