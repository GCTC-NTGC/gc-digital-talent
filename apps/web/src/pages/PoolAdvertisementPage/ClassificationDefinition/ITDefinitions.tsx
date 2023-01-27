import React from "react";
import { useIntl } from "react-intl";
import { getITAbbrHtml } from "@common/helpers/nameUtils";

const LevelOne = () => {
  const intl = useIntl();

  return (
    <p>
      {intl.formatMessage(
        {
          defaultMessage:
            "Technicians ({ITAbbr}) provide technical support in the development, implementation, integration, and maintenance of service delivery to clients and stakeholders",
          id: "D39mvO",
          description: "blurb describing IT-01",
        },
        { ITAbbr: getITAbbrHtml(intl, 1) },
      )}
    </p>
  );
};

const LevelTwo = () => {
  const intl = useIntl();

  return (
    <p>
      {intl.formatMessage(
        {
          defaultMessage:
            "Analysts ({ITAbbr}) provide technical services, advice, analysis, and research in their field of expertise to support service delivery to clients and stakeholders. IT analysts are found in all work streams.",
          id: "dN/wbc",
          description: "blurb describing IT-02",
        },
        { ITAbbr: getITAbbrHtml(intl, 2) },
      )}
    </p>
  );
};

const LevelThreeLead = () => {
  const intl = useIntl();

  return (
    <>
      <p>
        {intl.formatMessage(
          {
            defaultMessage:
              "There are two types of {ITAbbr} employees: those following a management path, and individual contributors.",
            id: "NGoXse",
            description: "IT-03 description precursor",
          },
          { ITAbbr: getITAbbrHtml(intl, 3) },
        )}
      </p>
      <p>
        {intl.formatMessage(
          {
            defaultMessage:
              "<strong>Management Path</strong>: {ITAbbr} Team Leads ({IT3Abbr}) are responsible for supervising work and project teams for {ITAbbr} services and operations in their field of expertise to support service delivery to clients and stakeholders. {ITAbbr} Team Leads are found in all work streams.",
            id: "/qXjCD",
            description:
              "IT-03 team lead path description, ignore things in <> tags please",
          },
          { ITAbbr: getITAbbrHtml(intl), IT3Abbr: getITAbbrHtml(intl, 3) },
        )}
      </p>
    </>
  );
};

const LevelThreeAdvisor = () => {
  const intl = useIntl();

  return (
    <>
      <p>
        {intl.formatMessage(
          {
            defaultMessage:
              "There are two types of {ITAbbr} employees: those following a management path, and individual contributors.",
            id: "NGoXse",
            description: "IT-03 description precursor",
          },
          { ITAbbr: getITAbbrHtml(intl) },
        )}
      </p>
      <p>
        {intl.formatMessage(
          {
            defaultMessage:
              "<strong>Individual Contributor</strong>: {ITAbbr} Technical Advisors ({IT3Abbr}) provide specialized technical advice, recommendations and support on solutions and services in their field of expertise in support of service delivery to clients and stakeholders. {ITAbbr} Technical Advisors are found in all work streams.",
            id: "/HbrEK",
            description:
              "IT-03 advisor description, ignore things in <> tags please",
          },
          { ITAbbr: getITAbbrHtml(intl), IT3Abbr: getITAbbrHtml(intl, 3) },
        )}
      </p>
    </>
  );
};

const LevelFourManager = () => {
  const intl = useIntl();

  return (
    <>
      <p>
        {intl.formatMessage(
          {
            defaultMessage:
              "There are two types of {ITAbbr} employees: those following a management path, and individual contributors.",
            id: "rifhMf",
            description: "IT-04 description precursor",
          },
          { ITAbbr: getITAbbrHtml(intl, 4) },
        )}
      </p>
      <p>
        {intl.formatMessage(
          {
            defaultMessage:
              "<strong>Management Path</strong>: {ITAbbr} Managers ({IT4Abbr}) are responsible for managing the development and delivery of {ITAbbr} services and/or operations through subordinate team leaders, technical advisors, and project teams, for service delivery to clients and stakeholders. {ITAbbr} Managers are found in all work streams.",
            id: "MpRdnW",
            description:
              "IT-04 manager path description, ignore things in <> tags please",
          },
          { ITAbbr: getITAbbrHtml(intl), IT4Abbr: getITAbbrHtml(intl, 4) },
        )}
      </p>
    </>
  );
};

const LevelFourAdvisor = (): JSX.Element => {
  const intl = useIntl();

  return (
    <>
      <p>
        {intl.formatMessage(
          {
            defaultMessage:
              "There are two types of {ITAbbr} employees: those following a management path, and individual contributors.",
            id: "rifhMf",
            description: "IT-04 description precursor",
          },
          { ITAbbr: getITAbbrHtml(intl) },
        )}
      </p>
      <p>
        {intl.formatMessage(
          {
            defaultMessage:
              "<strong>Individual Contributor</strong>: {ITAbbr} Senior Advisors ({IT4Abbr}) provide expert technical advice and strategic direction in their field of expertise in the provision of solutions and services to internal or external clients, and stakeholders.",
            id: "cL7NJN",
            description:
              "IT-04 senior advisor description precursor to work stream list, ignore things in <> tags please",
          },
          { ITAbbr: getITAbbrHtml(intl), IT4Abbr: getITAbbrHtml(intl, 4) },
        )}
      </p>
    </>
  );
};

export default {
  LevelOne,
  LevelTwo,
  LevelThreeLead,
  LevelThreeAdvisor,
  LevelFourManager,
  LevelFourAdvisor,
};
