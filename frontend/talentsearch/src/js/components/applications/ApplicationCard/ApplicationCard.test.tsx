/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { screen } from "@testing-library/react";
import React from "react";
import { axeTest, render } from "@common/helpers/testUtils";
import { fakePoolCandidates } from "@common/fakeData";
import { FAR_PAST_DATE } from "@common/helpers/dateUtils";

import { ApplicationCard, type ApplicationCardProps } from "./ApplicationCard";
import { PoolCandidateStatus } from "../../../api/generated";

const mockApplication = fakePoolCandidates()[0];

const defaultProps = {
  application: mockApplication,
  onDelete: jest.fn(),
  onArchive: jest.fn(),
};

const renderApplicationCard = (props: ApplicationCardProps) =>
  render(<ApplicationCard {...props} />);

describe("ApplicationCard", () => {
  it("should have no accessibility errors", async () => {
    const { container } = renderApplicationCard(defaultProps);

    await axeTest(container);
  });

  it("should show continue and delete link if draft", () => {
    renderApplicationCard({
      ...defaultProps,
      application: {
        ...mockApplication,
        status: PoolCandidateStatus.Draft,
      },
    });

    const continueLink = screen.queryByRole("link", {
      name: /continue my application/i,
    });

    expect(continueLink).toBeInTheDocument();

    const deleteLink = screen.queryByRole("button", {
      name: /delete/i,
    });

    expect(deleteLink).toBeInTheDocument();
  });

  it("should show delete link if draft expired", () => {
    renderApplicationCard({
      ...defaultProps,
      application: {
        ...mockApplication,
        status: PoolCandidateStatus.DraftExpired,
      },
    });

    const deleteLink = screen.queryByRole("button", {
      name: /delete/i,
    });

    expect(deleteLink).toBeInTheDocument();
  });

  it("should show archive link if screened out (application)", () => {
    renderApplicationCard({
      ...defaultProps,
      application: {
        ...mockApplication,
        status: PoolCandidateStatus.ScreenedOutApplication,
        archivedAt: null,
      },
    });

    const archiveLink = screen.queryByRole("button", {
      name: /archive/i,
    });

    expect(archiveLink).toBeInTheDocument();
  });

  it("should show archive link if screened out (assessment)", () => {
    renderApplicationCard({
      ...defaultProps,
      application: {
        ...mockApplication,
        status: PoolCandidateStatus.ScreenedOutAssessment,
        archivedAt: null,
      },
    });

    const archiveLink = screen.queryByRole("button", {
      name: /archive/i,
    });

    expect(archiveLink).toBeInTheDocument();
  });

  it("should show archive link if expired", () => {
    renderApplicationCard({
      ...defaultProps,
      application: {
        ...mockApplication,
        status: PoolCandidateStatus.Expired,
        archivedAt: null,
      },
    });

    const archiveLink = screen.queryByRole("button", {
      name: /archive/i,
    });

    expect(archiveLink).toBeInTheDocument();
  });

  it("should not show archive link if already archived", () => {
    renderApplicationCard({
      ...defaultProps,
      application: {
        ...mockApplication,
        status: PoolCandidateStatus.Expired,
        archivedAt: FAR_PAST_DATE,
      },
    });

    const archiveLink = screen.queryByRole("button", {
      name: /archive/i,
    });

    expect(archiveLink).toBeNull();
  });
});
