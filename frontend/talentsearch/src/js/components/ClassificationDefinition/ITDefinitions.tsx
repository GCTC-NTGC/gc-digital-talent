import React from "react";
import { useIntl } from "react-intl";

const LevelOne = () => {
  const intl = useIntl();

  return (
    <p>
      {intl.formatMessage({
        defaultMessage:
          "Technicians (IT-01) provide technical support in the development, implementation, integration, and maintenance of service delivery to clients and stakeholders",
        id: "Z9Uex5",
        description: "blurb describing IT-01",
      })}
    </p>
  );
};

const LevelTwo = () => {
  const intl = useIntl();

  return (
    <p>
      {intl.formatMessage({
        defaultMessage:
          "Analysts (IT-02) provide technical services, advice, analysis, and research in their field of expertise to support service delivery to clients and stakeholders. IT analysts are found in all work streams.",
        id: "raFdbB",
        description: "blurb describing IT-02",
      })}
    </p>
  );
};

const LevelThreeLead = () => {
  const intl = useIntl();

  return (
    <>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "There are two types of IT-03 employees: those following a management path, and individual contributors.",
          id: "hCgrxA",
          description: "IT-03 description precursor",
        })}
      </p>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "<strong>Management Path</strong>: IT Team Leads (IT-03) are responsible for supervising work and project teams for IT services and operations in their field of expertise to support service delivery to clients and stakeholders. IT Team Leads are found in all work streams.",
          id: "+bC9lc",
          description:
            "IT-03 team lead path description, ignore things in <> tags please",
        })}
      </p>
    </>
  );
};

const LevelThreeAdvisor = () => {
  const intl = useIntl();

  return (
    <>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "There are two types of IT-03 employees: those following a management path, and individual contributors.",
          id: "hCgrxA",
          description: "IT-03 description precursor",
        })}
      </p>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "<strong>Individual Contributor</strong>: IT Technical Advisors (IT-03) provide specialized technical advice, recommendations and support on solutions and services in their field of expertise in support of service delivery to clients and stakeholders. IT Technical Advisors are found in all work streams.",
          id: "u+9mg1",
          description:
            "IT-03 advisor description, ignore things in <> tags please",
        })}
      </p>
    </>
  );
};

const LevelFourManager = () => {
  const intl = useIntl();

  return (
    <>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "There are two types of IT-04 employees: those following a management path, and individual contributors.",
          id: "87nFC8",
          description: "IT-04 description precursor",
        })}
      </p>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "<strong>Management Path</strong>: IT Managers (IT-04) are responsible for managing the development and delivery of IT services and/or operations through subordinate team leaders, technical advisors, and project teams, for service delivery to clients and stakeholders. IT Managers are found in all work streams.",
          id: "m21EOJ",
          description:
            "IT-04 manager path description, ignore things in <> tags please",
        })}
      </p>
    </>
  );
};

const LevelFourAdvisor = (): JSX.Element => {
  const intl = useIntl();

  return (
    <>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "There are two types of IT-04 employees: those following a management path, and individual contributors.",
          id: "87nFC8",
          description: "IT-04 description precursor",
        })}
      </p>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "<strong>Individual Contributor</strong>: IT Senior Advisors (IT-04) provide expert technical advice and strategic direction in their field of expertise in the provision of solutions and services to internal or external clients, and stakeholders.",
          id: "VQWGkh",
          description:
            "IT-04 senior advisor description precursor to work stream list, ignore things in <> tags please",
        })}
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
