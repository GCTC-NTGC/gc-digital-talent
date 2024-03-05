import React from "react";
import { useIntl } from "react-intl";

import { Pill } from "@gc-digital-talent/ui";
import { getLocalizedName } from "@gc-digital-talent/i18n";
import { Team } from "@gc-digital-talent/graphql";

import adminMessages from "~/messages/adminMessages";

interface ViewTeamProps {
  team: Team;
}

const ViewTeam = ({ team }: ViewTeamProps) => {
  const intl = useIntl();

  const departmentsPillsArray =
    team?.departments && team.departments.length > 0
      ? team.departments.map((department) => {
          return (
            <Pill color="primary" mode="outline" key={department?.id}>
              {getLocalizedName(department?.name, intl)}
            </Pill>
          );
        })
      : null;

  return (
    <>
      <h2 data-h2-margin="base(x2, 0, x1, 0)" data-h2-font-size="base(h3)">
        {intl.formatMessage({
          defaultMessage: "Basic information",
          id: "Rg0SpL",
          description: "Basic information",
        })}
      </h2>
      <div data-h2-flex-grid="base(flex-start, x1, 0)">
        <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
          <p>
            {intl.formatMessage({
              defaultMessage: "Team's name (English)",
              id: "rdYjIb",
              description: "Name of an organization/team in English field.",
            })}
          </p>
          <p
            data-h2-color="base:all(black)"
            data-h2-background-color="base:all(gray.light)"
            data-h2-margin="base(x.25, 0, x1, 0)"
            data-h2-padding="base(x.25, 0, x.25, x.5)"
            data-h2-border="base(2px solid gray)"
            data-h2-radius="base(rounded)"
          >
            <span>{team.displayName?.en ?? ""}</span>
          </p>
        </div>
        <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
          <p>
            {intl.formatMessage({
              defaultMessage: "Team's name (French)",
              id: "YjMfWZ",
              description: "Name of an organization/team in French field.",
            })}
          </p>
          <p
            data-h2-color="base:all(black)"
            data-h2-background-color="base:all(gray.light)"
            data-h2-margin="base(x.25, 0, x1, 0)"
            data-h2-padding="base(x.25, 0, x.25, x.5)"
            data-h2-border="base(2px solid gray)"
            data-h2-radius="base(rounded)"
          >
            <span>{team.displayName?.fr ?? ""}</span>
          </p>
        </div>
        <div data-h2-flex-item="base(1of1)">
          <p data-h2-margin-bottom="base(x.25)">
            {intl.formatMessage(adminMessages.departments)}
          </p>
          {departmentsPillsArray}
        </div>
        <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
          <p data-h2-margin-top="base(x1)">
            {intl.formatMessage({
              defaultMessage: "Key",
              id: "CvV2l6",
              description: "Label for an entity 'key' field",
            })}
          </p>
          <p
            data-h2-color="base:all(black)"
            data-h2-background-color="base:all(gray.light)"
            data-h2-margin="base(x.25, 0, x1, 0)"
            data-h2-padding="base(x.25, 0, x.25, x.5)"
            data-h2-border="base(2px solid gray)"
            data-h2-radius="base(rounded)"
          >
            <span>{team.name}</span>
          </p>
        </div>
        <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
          <p data-h2-margin-top="base(x1)">
            {intl.formatMessage({
              defaultMessage: "Contact email",
              id: "nGNj5Q",
              description: "Contact email",
            })}
          </p>
          <p
            data-h2-color="base:all(black)"
            data-h2-background-color="base:all(gray.light)"
            data-h2-margin="base(x.25, 0, x1, 0)"
            data-h2-padding="base(x.25, 0, x.25, x.5)"
            data-h2-border="base(2px solid gray)"
            data-h2-radius="base(rounded)"
          >
            <span>{team?.contactEmail ?? ""}</span>
          </p>
        </div>
        <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
          <p data-h2-margin-top="base(x1)">
            {intl.formatMessage({
              defaultMessage: "Team's short description (English)",
              id: "sSGgnI",
              description: "Label for team description in English language",
            })}
          </p>
          <p
            data-h2-background-color="base(white)"
            data-h2-margin="base(x.25, 0, x1, 0)"
            data-h2-padding="base(x.25, 0, x.25, x.5)"
            data-h2-border="base(2px solid gray)"
            data-h2-radius="base(rounded)"
            data-h2-min-height="base(x6)"
          >
            <span>{team?.description?.en ?? ""}</span>
          </p>
        </div>
        <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
          <p data-h2-margin-top="base(x1)">
            {intl.formatMessage({
              defaultMessage: "Team's short description (French)",
              id: "RSkJQR",
              description: "Label for team description in French language",
            })}
          </p>
          <p
            data-h2-background-color="base(white)"
            data-h2-margin="base(x.25, 0, x1, 0)"
            data-h2-padding="base(x.25, 0, x.25, x.5)"
            data-h2-border="base(2px solid gray)"
            data-h2-radius="base(rounded)"
            data-h2-min-height="base(x6)"
          >
            <span>{team?.description?.fr ?? ""}</span>
          </p>
        </div>
      </div>
    </>
  );
};

export default ViewTeam;
