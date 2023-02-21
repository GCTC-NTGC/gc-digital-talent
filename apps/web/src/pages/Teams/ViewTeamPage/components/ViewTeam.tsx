import React from "react";
import { useIntl } from "react-intl";
import { Team } from "~/api/generated";
import Pill from "@common/components/Pill/Pill";
import { getLocalizedName } from "@common/helpers/localize";

interface ViewTeamProps {
  team: Team;
}

export const ViewTeam = ({ team }: ViewTeamProps) => {
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
              defaultMessage: "Organization's name (English)",
              id: "QC23B1",
              description: "Name of an organization/team in English field.",
            })}
          </p>
          <p
            data-h2-background-color="base(gray.light)"
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
              defaultMessage: "Organization's name (French)",
              id: "W0BVd+",
              description: "Name of an organization/team in French field.",
            })}
          </p>
          <p
            data-h2-background-color="base(gray.light)"
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
            {intl.formatMessage({
              defaultMessage: "Departments",
              id: "457hEW",
              description:
                "Heading displayed above the Department Table component.",
            })}
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
            data-h2-background-color="base(gray.light)"
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
            data-h2-background-color="base(gray.light)"
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
              id: "whsH/g",
              description: "Short description for a team in English",
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
              id: "PtbLq+",
              description: "Short description for a team in French",
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
