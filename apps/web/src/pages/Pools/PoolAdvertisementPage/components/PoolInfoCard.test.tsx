/**
 * @jest-environment jsdom
 */
import React from "react";
import "@testing-library/jest-dom";
import format from "date-fns/format";

import { renderWithProviders } from "@gc-digital-talent/jest-helpers";
import { DATE_FORMAT_STRING } from "@gc-digital-talent/date-helpers";

import PoolInfoCard from "./PoolInfoCard";
import type { PoolInfoCardProps } from "./PoolInfoCard";

const renderPoolInfoCard = (props: PoolInfoCardProps) =>
  renderWithProviders(<PoolInfoCard {...props} />);

const now = new Date();

describe("PoolInfoCard", () => {
  it.skip("should render today", () => {
    const today = new Date(now);
    const card = renderPoolInfoCard({
      closingDate: format(today, DATE_FORMAT_STRING),
      classification: "",
      salary: {
        min: 1,
        max: 100,
      },
    });

    expect(card.getByText(/today/i)).toBeInTheDocument();
  });

  it.skip("should render tomorrow", () => {
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const card = renderPoolInfoCard({
      closingDate: format(tomorrow, DATE_FORMAT_STRING),
      classification: "",
      salary: {
        min: 1,
        max: 100,
      },
    });

    expect(card.getByText(/tomorrow/i)).toBeInTheDocument();
  });

  it.skip("should render 'in x days'", () => {
    const date = new Date(now);
    date.setDate(date.getDate() + 5);
    const card = renderPoolInfoCard({
      closingDate: format(date, DATE_FORMAT_STRING),
      classification: "",
      salary: {
        min: 1,
        max: 100,
      },
    });

    expect(card.getByText(/5 days/i)).toBeInTheDocument();
  });

  it("should render expired", () => {
    const date = new Date(now);
    date.setMinutes(date.getMinutes() - 1);
    const card = renderPoolInfoCard({
      closingDate: format(date, DATE_FORMAT_STRING),
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
