/**
 * @jest-environment jsdom
 */
import React from "react";
import "@testing-library/jest-dom";
import { render } from "@common/helpers/testUtils";
import PoolInfoCard from "./PoolInfoCard";
import type { PoolInfoCardProps } from "./PoolInfoCard";

const renderPoolInfoCard = (props: PoolInfoCardProps) =>
  render(<PoolInfoCard {...props} />);

const now = new Date();

describe("PoolInfoCard", () => {
  it("should render today", () => {
    const today = new Date(now);
    today.setHours(23);
    today.setMinutes(59);
    const card = renderPoolInfoCard({
      closingDate: today,
      classification: "",
      salary: {
        min: 1,
        max: 100,
      },
    });

    expect(card.getByText(/today/i)).toBeInTheDocument();
  });

  it("should render tomorrow", () => {
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(23);
    tomorrow.setMinutes(59);
    const card = renderPoolInfoCard({
      closingDate: tomorrow,
      classification: "",
      salary: {
        min: 1,
        max: 100,
      },
    });

    expect(card.getByText(/tomorrow/i)).toBeInTheDocument();
  });

  it("should render 'in x days'", () => {
    const date = new Date(now);
    date.setDate(date.getDate() + 5);
    date.setHours(23);
    date.setMinutes(59);
    const card = renderPoolInfoCard({
      closingDate: date,
      classification: "",
      salary: {
        min: 1,
        max: 100,
      },
    });

    expect(card.getByText(/in 5 days/i)).toBeInTheDocument();
  });

  it("should render expired", () => {
    const date = new Date(now);
    date.setDate(date.getDate() - 1);
    date.setHours(23);
    date.setMinutes(59);
    const card = renderPoolInfoCard({
      closingDate: date,
      classification: "",
      salary: {
        min: 1,
        max: 100,
      },
    });

    expect(
      card.getByText(/the deadline for submission has passed/i),
    ).toBeInTheDocument();
  });
});
