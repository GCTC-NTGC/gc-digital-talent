import React from "react";
import { CpuChipIcon } from "@heroicons/react/24/outline";
import { useIntl } from "react-intl";
import Heading from "@common/components/Heading";
import { PoolStream } from "@common/api/generated";
import Accordion from "@common/components/Accordion";
import { Link } from "@common/components";
import { FAR_FUTURE_DATE } from "@common/helpers/dateUtils";
import { PoolAdvertisement } from "../../api/generated";
import useRoutes from "../../hooks/useRoutes";

interface DataModel {
  streams: {
    key: PoolStream;
    title: string;
    summary: string;
    classifications: {
      title: string;
      description: string;
      poolAdvertisementId: PoolAdvertisement["id"] | undefined;
      applyMessage: string;
    }[];
  }[];
}

// predicate for if a pool advertisement is associated with a classification group and level
const selectPoolIdForSection = (
  pools: PoolAdvertisement[],
  stream: PoolStream,
  group: string,
  level: number,
): PoolAdvertisement["id"] | undefined => {
  return pools
    .sort((p1, p2) =>
      (p1.expiryDate ?? FAR_FUTURE_DATE) < (p2.expiryDate ?? FAR_FUTURE_DATE)
        ? -1
        : 1,
    )
    .find(
      (p) =>
        // must match section stream
        p.stream === stream &&
        // must include section classification group and level
        !!p.classifications?.find(
          (c) => c?.group === group && c.level === level,
        ),
    )?.id;
};

export interface OngoingRecruitmentSectionProps {
  pools: PoolAdvertisement[];
}

export const OngoingRecruitmentSection = ({
  pools,
}: OngoingRecruitmentSectionProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  // this great big object is all the data to populate the accordions
  const dataModel: DataModel = {
    streams: [
      // IT business line advisory services bucket
      {
        key: PoolStream.BusinessAdvisoryServices,
        title: intl.formatMessage({
          defaultMessage: "IT business line advisory services",
          id: "EOO6S0",
          description:
            "Title for the 'business line advisory services' IT work stream",
        }),
        summary: intl.formatMessage({
          defaultMessage:
            "This stream includes providing specialized IT guidance as well as working with clients and/or suppliers to acquire and sustain IT resources that support Government operation.",
          id: "QN/1MR",
          description:
            "Title for the 'business line advisory services' IT work stream",
        }),
        classifications: [
          {
            title: intl.formatMessage({
              defaultMessage: "Level 1 (Technician)",
              id: "UBf9lv",
              description: "Title for the 'IT-01 Technician' classification",
            }),
            description: intl.formatMessage({
              defaultMessage:
                "Technicians (IT-01) provide technical support in the development, implementation, integration, and maintenance of service delivery to clients and stakeholders.",
              id: "T0gN76",
              description:
                "Description for the 'IT-01 Technician' classification",
            }),
            poolAdvertisementId: selectPoolIdForSection(
              pools,
              PoolStream.BusinessAdvisoryServices,
              "IT",
              1,
            ),
            applyMessage: intl.formatMessage(
              {
                defaultMessage: "Apply to level {number}",
                id: "oKc30q",
                description: "Invitation to apply at a certain level number",
              },
              { number: 1 },
            ),
          },
          {
            title: intl.formatMessage({
              defaultMessage: "Level 2 (Analyst)",
              id: "6dPu0e",
              description: "Title for the 'IT-02 Analyst' classification",
            }),
            description: intl.formatMessage({
              defaultMessage:
                "Analysts (IT-02) provide technical services, advice, analysis, and research in their field of expertise to support service delivery to clients and stakeholders.",
              id: "zZQGWR",
              description: "Description for the 'IT-02 Analyst' classification",
            }),
            poolAdvertisementId: selectPoolIdForSection(
              pools,
              PoolStream.BusinessAdvisoryServices,
              "IT",
              2,
            ),
            applyMessage: intl.formatMessage(
              {
                defaultMessage: "Apply to level {number}",
                id: "oKc30q",
                description: "Invitation to apply at a certain level number",
              },
              { number: 2 },
            ),
          },
          {
            title: intl.formatMessage({
              defaultMessage: "Level 3 (Lead/Advisor)",
              id: "MzhP1T",
              description: "Title for the 'IT-03 Advisor' classification",
            }),
            description: intl.formatMessage({
              defaultMessage:
                "IT Technical Advisors (IT-03) provide specialized technical advice, recommendations and support on solutions and services in their field of expertise in support of service delivery.",
              id: "rLmOMp",
              description: "Description for the 'IT-03 Advisor' classification",
            }),
            poolAdvertisementId: selectPoolIdForSection(
              pools,
              PoolStream.BusinessAdvisoryServices,
              "IT",
              3,
            ),
            applyMessage: intl.formatMessage(
              {
                defaultMessage: "Apply to level {number}",
                id: "oKc30q",
                description: "Invitation to apply at a certain level number",
              },
              { number: 3 },
            ),
          },
          {
            title: intl.formatMessage({
              defaultMessage: "Level 4 (Manager/Advisor)",
              id: "5qkqv9",
              description: "Title for the 'IT-04 Manager' classification",
            }),
            description: intl.formatMessage({
              defaultMessage:
                "IT Managers (IT-04) are responsible for managing development and delivery of IT services and/or operations through subordinate team leaders, technical advisors, and project teams.",
              id: "v0/leo",
              description: "Description for the 'IT-04 Manager' classification",
            }),
            poolAdvertisementId: selectPoolIdForSection(
              pools,
              PoolStream.BusinessAdvisoryServices,
              "IT",
              4,
            ),
            applyMessage: intl.formatMessage(
              {
                defaultMessage: "Apply to level {number}",
                id: "oKc30q",
                description: "Invitation to apply at a certain level number",
              },
              { number: 4 },
            ),
          },
        ],
      },
      // IT database management
      {
        key: PoolStream.DatabaseManagement,
        title: intl.formatMessage({
          defaultMessage: "IT database management",
          id: "pffFnd",
          description: "Title for the 'database management' IT work stream",
        }),
        summary: intl.formatMessage({
          defaultMessage:
            "This stream includes developing and maintaining data models, database design, capacity planning, performance management, and ensuring data integrity.",
          id: "BxJSsB",
          description: "Title for the 'database management' IT work stream",
        }),
        classifications: [
          {
            title: intl.formatMessage({
              defaultMessage: "Level 1 (Technician)",
              id: "UBf9lv",
              description: "Title for the 'IT-01 Technician' classification",
            }),
            description: intl.formatMessage({
              defaultMessage:
                "Technicians (IT-01) provide technical support in the development, implementation, integration, and maintenance of service delivery to clients and stakeholders.",
              id: "T0gN76",
              description:
                "Description for the 'IT-01 Technician' classification",
            }),
            poolAdvertisementId: selectPoolIdForSection(
              pools,
              PoolStream.DatabaseManagement,
              "IT",
              1,
            ),
            applyMessage: intl.formatMessage(
              {
                defaultMessage: "Apply to level {number}",
                id: "oKc30q",
                description: "Invitation to apply at a certain level number",
              },
              { number: 1 },
            ),
          },
          {
            title: intl.formatMessage({
              defaultMessage: "Level 2 (Analyst)",
              id: "6dPu0e",
              description: "Title for the 'IT-02 Analyst' classification",
            }),
            description: intl.formatMessage({
              defaultMessage:
                "Analysts (IT-02) provide technical services, advice, analysis, and research in their field of expertise to support service delivery to clients and stakeholders.",
              id: "zZQGWR",
              description: "Description for the 'IT-02 Analyst' classification",
            }),
            poolAdvertisementId: selectPoolIdForSection(
              pools,
              PoolStream.DatabaseManagement,
              "IT",
              2,
            ),
            applyMessage: intl.formatMessage(
              {
                defaultMessage: "Apply to level {number}",
                id: "oKc30q",
                description: "Invitation to apply at a certain level number",
              },
              { number: 2 },
            ),
          },
          {
            title: intl.formatMessage({
              defaultMessage: "Level 3 (Lead/Advisor)",
              id: "MzhP1T",
              description: "Title for the 'IT-03 Advisor' classification",
            }),
            description: intl.formatMessage({
              defaultMessage:
                "IT Technical Advisors (IT-03) provide specialized technical advice, recommendations and support on solutions and services in their field of expertise in support of service delivery.",
              id: "rLmOMp",
              description: "Description for the 'IT-03 Advisor' classification",
            }),
            poolAdvertisementId: selectPoolIdForSection(
              pools,
              PoolStream.DatabaseManagement,
              "IT",
              3,
            ),
            applyMessage: intl.formatMessage(
              {
                defaultMessage: "Apply to level {number}",
                id: "oKc30q",
                description: "Invitation to apply at a certain level number",
              },
              { number: 3 },
            ),
          },
          {
            title: intl.formatMessage({
              defaultMessage: "Level 4 (Manager/Advisor)",
              id: "5qkqv9",
              description: "Title for the 'IT-04 Manager' classification",
            }),
            description: intl.formatMessage({
              defaultMessage:
                "IT Managers (IT-04) are responsible for managing development and delivery of IT services and/or operations through subordinate team leaders, technical advisors, and project teams.",
              id: "v0/leo",
              description: "Description for the 'IT-04 Manager' classification",
            }),
            poolAdvertisementId: selectPoolIdForSection(
              pools,
              PoolStream.DatabaseManagement,
              "IT",
              4,
            ),
            applyMessage: intl.formatMessage(
              {
                defaultMessage: "Apply to level {number}",
                id: "oKc30q",
                description: "Invitation to apply at a certain level number",
              },
              { number: 4 },
            ),
          },
        ],
      },
      // IT enterprise architecture
      {
        key: PoolStream.EnterpriseArchitecture,
        title: intl.formatMessage({
          defaultMessage: "IT enterprise architecture",
          id: "C2iUvf",
          description: "Title for the 'enterprise architecture' IT work stream",
        }),
        summary: intl.formatMessage({
          defaultMessage:
            "This stream includes working with the departmental IT architecture direction, collaborating with other IT streams, and conducting research into emerging technologies.",
          id: "DVkO+D",
          description: "Title for the 'enterprise architecture' IT work stream",
        }),
        classifications: [
          {
            title: intl.formatMessage({
              defaultMessage: "Level 1 (Technician)",
              id: "UBf9lv",
              description: "Title for the 'IT-01 Technician' classification",
            }),
            description: intl.formatMessage({
              defaultMessage:
                "Technicians (IT-01) provide technical support in the development, implementation, integration, and maintenance of service delivery to clients and stakeholders.",
              id: "T0gN76",
              description:
                "Description for the 'IT-01 Technician' classification",
            }),
            poolAdvertisementId: selectPoolIdForSection(
              pools,
              PoolStream.EnterpriseArchitecture,
              "IT",
              1,
            ),
            applyMessage: intl.formatMessage(
              {
                defaultMessage: "Apply to level {number}",
                id: "oKc30q",
                description: "Invitation to apply at a certain level number",
              },
              { number: 1 },
            ),
          },
          {
            title: intl.formatMessage({
              defaultMessage: "Level 2 (Analyst)",
              id: "6dPu0e",
              description: "Title for the 'IT-02 Analyst' classification",
            }),
            description: intl.formatMessage({
              defaultMessage:
                "Analysts (IT-02) provide technical services, advice, analysis, and research in their field of expertise to support service delivery to clients and stakeholders.",
              id: "zZQGWR",
              description: "Description for the 'IT-02 Analyst' classification",
            }),
            poolAdvertisementId: selectPoolIdForSection(
              pools,
              PoolStream.EnterpriseArchitecture,
              "IT",
              2,
            ),
            applyMessage: intl.formatMessage(
              {
                defaultMessage: "Apply to level {number}",
                id: "oKc30q",
                description: "Invitation to apply at a certain level number",
              },
              { number: 2 },
            ),
          },
          {
            title: intl.formatMessage({
              defaultMessage: "Level 3 (Lead/Advisor)",
              id: "MzhP1T",
              description: "Title for the 'IT-03 Advisor' classification",
            }),
            description: intl.formatMessage({
              defaultMessage:
                "IT Technical Advisors (IT-03) provide specialized technical advice, recommendations and support on solutions and services in their field of expertise in support of service delivery.",
              id: "rLmOMp",
              description: "Description for the 'IT-03 Advisor' classification",
            }),
            poolAdvertisementId: selectPoolIdForSection(
              pools,
              PoolStream.EnterpriseArchitecture,
              "IT",
              3,
            ),
            applyMessage: intl.formatMessage(
              {
                defaultMessage: "Apply to level {number}",
                id: "oKc30q",
                description: "Invitation to apply at a certain level number",
              },
              { number: 3 },
            ),
          },
          {
            title: intl.formatMessage({
              defaultMessage: "Level 4 (Manager/Advisor)",
              id: "5qkqv9",
              description: "Title for the 'IT-04 Manager' classification",
            }),
            description: intl.formatMessage({
              defaultMessage:
                "IT Managers (IT-04) are responsible for managing development and delivery of IT services and/or operations through subordinate team leaders, technical advisors, and project teams.",
              id: "v0/leo",
              description: "Description for the 'IT-04 Manager' classification",
            }),
            poolAdvertisementId: selectPoolIdForSection(
              pools,
              PoolStream.EnterpriseArchitecture,
              "IT",
              4,
            ),
            applyMessage: intl.formatMessage(
              {
                defaultMessage: "Apply to level {number}",
                id: "oKc30q",
                description: "Invitation to apply at a certain level number",
              },
              { number: 4 },
            ),
          },
        ],
      },
      // IT infrastructure operations
      {
        key: PoolStream.InfrastructureOperations,
        title: intl.formatMessage({
          defaultMessage: "IT infrastructure operations",
          id: "ElfiAv",
          description:
            "Title for the 'infrastructure operations' IT work stream",
        }),
        summary: intl.formatMessage({
          defaultMessage:
            "This stream includes infrastructure management of networks, mainframes, servers, and storage, providing IT support, and client/supplier relationships.",
          id: "svCFrY",
          description:
            "Title for the 'infrastructure operations' IT work stream",
        }),
        classifications: [
          {
            title: intl.formatMessage({
              defaultMessage: "Level 1 (Technician)",
              id: "UBf9lv",
              description: "Title for the 'IT-01 Technician' classification",
            }),
            description: intl.formatMessage({
              defaultMessage:
                "Technicians (IT-01) provide technical support in the development, implementation, integration, and maintenance of service delivery to clients and stakeholders.",
              id: "T0gN76",
              description:
                "Description for the 'IT-01 Technician' classification",
            }),
            poolAdvertisementId: selectPoolIdForSection(
              pools,
              PoolStream.InfrastructureOperations,
              "IT",
              1,
            ),
            applyMessage: intl.formatMessage(
              {
                defaultMessage: "Apply to level {number}",
                id: "oKc30q",
                description: "Invitation to apply at a certain level number",
              },
              { number: 1 },
            ),
          },
          {
            title: intl.formatMessage({
              defaultMessage: "Level 2 (Analyst)",
              id: "6dPu0e",
              description: "Title for the 'IT-02 Analyst' classification",
            }),
            description: intl.formatMessage({
              defaultMessage:
                "Analysts (IT-02) provide technical services, advice, analysis, and research in their field of expertise to support service delivery to clients and stakeholders.",
              id: "zZQGWR",
              description: "Description for the 'IT-02 Analyst' classification",
            }),
            poolAdvertisementId: selectPoolIdForSection(
              pools,
              PoolStream.InfrastructureOperations,
              "IT",
              2,
            ),
            applyMessage: intl.formatMessage(
              {
                defaultMessage: "Apply to level {number}",
                id: "oKc30q",
                description: "Invitation to apply at a certain level number",
              },
              { number: 2 },
            ),
          },
          {
            title: intl.formatMessage({
              defaultMessage: "Level 3 (Lead/Advisor)",
              id: "MzhP1T",
              description: "Title for the 'IT-03 Advisor' classification",
            }),
            description: intl.formatMessage({
              defaultMessage:
                "IT Technical Advisors (IT-03) provide specialized technical advice, recommendations and support on solutions and services in their field of expertise in support of service delivery.",
              id: "rLmOMp",
              description: "Description for the 'IT-03 Advisor' classification",
            }),
            poolAdvertisementId: selectPoolIdForSection(
              pools,
              PoolStream.InfrastructureOperations,
              "IT",
              3,
            ),
            applyMessage: intl.formatMessage(
              {
                defaultMessage: "Apply to level {number}",
                id: "oKc30q",
                description: "Invitation to apply at a certain level number",
              },
              { number: 3 },
            ),
          },
          {
            title: intl.formatMessage({
              defaultMessage: "Level 4 (Manager/Advisor)",
              id: "5qkqv9",
              description: "Title for the 'IT-04 Manager' classification",
            }),
            description: intl.formatMessage({
              defaultMessage:
                "IT Managers (IT-04) are responsible for managing development and delivery of IT services and/or operations through subordinate team leaders, technical advisors, and project teams.",
              id: "v0/leo",
              description: "Description for the 'IT-04 Manager' classification",
            }),
            poolAdvertisementId: selectPoolIdForSection(
              pools,
              PoolStream.InfrastructureOperations,
              "IT",
              4,
            ),
            applyMessage: intl.formatMessage(
              {
                defaultMessage: "Apply to level {number}",
                id: "oKc30q",
                description: "Invitation to apply at a certain level number",
              },
              { number: 4 },
            ),
          },
        ],
      },
      // IT planning and reporting
      {
        key: PoolStream.PlanningAndReporting,
        title: intl.formatMessage({
          defaultMessage: "IT planning and reporting",
          id: "VX2+ET",
          description: "Title for the 'planning and reporting' IT work stream",
        }),
        summary: intl.formatMessage({
          defaultMessage:
            "This stream includes providing specialized IT planning guidance, and the collaborative creation of deliverables that include strategic plans, IT policies and standards, and governance processes.",
          id: "crqgGQ",
          description: "Title for the 'planning and reporting' IT work stream",
        }),
        classifications: [
          {
            title: intl.formatMessage({
              defaultMessage: "Level 1 (Technician)",
              id: "UBf9lv",
              description: "Title for the 'IT-01 Technician' classification",
            }),
            description: intl.formatMessage({
              defaultMessage:
                "Technicians (IT-01) provide technical support in the development, implementation, integration, and maintenance of service delivery to clients and stakeholders.",
              id: "T0gN76",
              description:
                "Description for the 'IT-01 Technician' classification",
            }),
            poolAdvertisementId: selectPoolIdForSection(
              pools,
              PoolStream.PlanningAndReporting,
              "IT",
              1,
            ),
            applyMessage: intl.formatMessage(
              {
                defaultMessage: "Apply to level {number}",
                id: "oKc30q",
                description: "Invitation to apply at a certain level number",
              },
              { number: 1 },
            ),
          },
          {
            title: intl.formatMessage({
              defaultMessage: "Level 2 (Analyst)",
              id: "6dPu0e",
              description: "Title for the 'IT-02 Analyst' classification",
            }),
            description: intl.formatMessage({
              defaultMessage:
                "Analysts (IT-02) provide technical services, advice, analysis, and research in their field of expertise to support service delivery to clients and stakeholders.",
              id: "zZQGWR",
              description: "Description for the 'IT-02 Analyst' classification",
            }),
            poolAdvertisementId: selectPoolIdForSection(
              pools,
              PoolStream.PlanningAndReporting,
              "IT",
              2,
            ),
            applyMessage: intl.formatMessage(
              {
                defaultMessage: "Apply to level {number}",
                id: "oKc30q",
                description: "Invitation to apply at a certain level number",
              },
              { number: 2 },
            ),
          },
          {
            title: intl.formatMessage({
              defaultMessage: "Level 3 (Lead/Advisor)",
              id: "MzhP1T",
              description: "Title for the 'IT-03 Advisor' classification",
            }),
            description: intl.formatMessage({
              defaultMessage:
                "IT Technical Advisors (IT-03) provide specialized technical advice, recommendations and support on solutions and services in their field of expertise in support of service delivery.",
              id: "rLmOMp",
              description: "Description for the 'IT-03 Advisor' classification",
            }),
            poolAdvertisementId: selectPoolIdForSection(
              pools,
              PoolStream.PlanningAndReporting,
              "IT",
              3,
            ),
            applyMessage: intl.formatMessage(
              {
                defaultMessage: "Apply to level {number}",
                id: "oKc30q",
                description: "Invitation to apply at a certain level number",
              },
              { number: 3 },
            ),
          },
          {
            title: intl.formatMessage({
              defaultMessage: "Level 4 (Manager/Advisor)",
              id: "5qkqv9",
              description: "Title for the 'IT-04 Manager' classification",
            }),
            description: intl.formatMessage({
              defaultMessage:
                "IT Managers (IT-04) are responsible for managing development and delivery of IT services and/or operations through subordinate team leaders, technical advisors, and project teams.",
              id: "v0/leo",
              description: "Description for the 'IT-04 Manager' classification",
            }),
            poolAdvertisementId: selectPoolIdForSection(
              pools,
              PoolStream.PlanningAndReporting,
              "IT",
              4,
            ),
            applyMessage: intl.formatMessage(
              {
                defaultMessage: "Apply to level {number}",
                id: "oKc30q",
                description: "Invitation to apply at a certain level number",
              },
              { number: 4 },
            ),
          },
        ],
      },
      // IT project portfolio management
      {
        key: PoolStream.ProjectPortfolioManagement,
        title: intl.formatMessage({
          defaultMessage: "IT project portfolio management",
          id: "aL5y0G",
          description:
            "Title for the 'project portfolio management' IT work stream",
        }),
        summary: intl.formatMessage({
          defaultMessage:
            "This bucket includes working full-time on large, formal projects that require the sharing of and application of rigorous application of IT project management skills and knowledge.",
          id: "h5CY+u",
          description:
            "Title for the 'project portfolio management' IT work stream",
        }),
        classifications: [
          {
            title: intl.formatMessage({
              defaultMessage: "Level 1 (Technician)",
              id: "UBf9lv",
              description: "Title for the 'IT-01 Technician' classification",
            }),
            description: intl.formatMessage({
              defaultMessage:
                "Technicians (IT-01) provide technical support in the development, implementation, integration, and maintenance of service delivery to clients and stakeholders.",
              id: "T0gN76",
              description:
                "Description for the 'IT-01 Technician' classification",
            }),
            poolAdvertisementId: selectPoolIdForSection(
              pools,
              PoolStream.ProjectPortfolioManagement,
              "IT",
              1,
            ),
            applyMessage: intl.formatMessage(
              {
                defaultMessage: "Apply to level {number}",
                id: "oKc30q",
                description: "Invitation to apply at a certain level number",
              },
              { number: 1 },
            ),
          },
          {
            title: intl.formatMessage({
              defaultMessage: "Level 2 (Analyst)",
              id: "6dPu0e",
              description: "Title for the 'IT-02 Analyst' classification",
            }),
            description: intl.formatMessage({
              defaultMessage:
                "Analysts (IT-02) provide technical services, advice, analysis, and research in their field of expertise to support service delivery to clients and stakeholders.",
              id: "zZQGWR",
              description: "Description for the 'IT-02 Analyst' classification",
            }),
            poolAdvertisementId: selectPoolIdForSection(
              pools,
              PoolStream.ProjectPortfolioManagement,
              "IT",
              2,
            ),
            applyMessage: intl.formatMessage(
              {
                defaultMessage: "Apply to level {number}",
                id: "oKc30q",
                description: "Invitation to apply at a certain level number",
              },
              { number: 2 },
            ),
          },
          {
            title: intl.formatMessage({
              defaultMessage: "Level 3 (Lead/Advisor)",
              id: "MzhP1T",
              description: "Title for the 'IT-03 Advisor' classification",
            }),
            description: intl.formatMessage({
              defaultMessage:
                "IT Technical Advisors (IT-03) provide specialized technical advice, recommendations and support on solutions and services in their field of expertise in support of service delivery.",
              id: "rLmOMp",
              description: "Description for the 'IT-03 Advisor' classification",
            }),
            poolAdvertisementId: selectPoolIdForSection(
              pools,
              PoolStream.ProjectPortfolioManagement,
              "IT",
              3,
            ),
            applyMessage: intl.formatMessage(
              {
                defaultMessage: "Apply to level {number}",
                id: "oKc30q",
                description: "Invitation to apply at a certain level number",
              },
              { number: 3 },
            ),
          },
          {
            title: intl.formatMessage({
              defaultMessage: "Level 4 (Manager/Advisor)",
              id: "5qkqv9",
              description: "Title for the 'IT-04 Manager' classification",
            }),
            description: intl.formatMessage({
              defaultMessage:
                "IT Managers (IT-04) are responsible for managing development and delivery of IT services and/or operations through subordinate team leaders, technical advisors, and project teams.",
              id: "v0/leo",
              description: "Description for the 'IT-04 Manager' classification",
            }),
            poolAdvertisementId: selectPoolIdForSection(
              pools,
              PoolStream.ProjectPortfolioManagement,
              "IT",
              4,
            ),
            applyMessage: intl.formatMessage(
              {
                defaultMessage: "Apply to level {number}",
                id: "oKc30q",
                description: "Invitation to apply at a certain level number",
              },
              { number: 4 },
            ),
          },
        ],
      },
      // IT security
      {
        key: PoolStream.Security,
        title: intl.formatMessage({
          defaultMessage: "IT security",
          id: "uxlNWH",
          description: "Title for the 'security' IT work stream",
        }),
        summary: intl.formatMessage({
          defaultMessage:
            "This stream includes specialized security skills that focus in programming, infrastructure, business applications, and data.",
          id: "bz6geU",
          description: "Title for the 'security' IT work stream",
        }),
        classifications: [
          {
            title: intl.formatMessage({
              defaultMessage: "Level 1 (Technician)",
              id: "UBf9lv",
              description: "Title for the 'IT-01 Technician' classification",
            }),
            description: intl.formatMessage({
              defaultMessage:
                "Technicians (IT-01) provide technical support in the development, implementation, integration, and maintenance of service delivery to clients and stakeholders.",
              id: "T0gN76",
              description:
                "Description for the 'IT-01 Technician' classification",
            }),
            poolAdvertisementId: selectPoolIdForSection(
              pools,
              PoolStream.Security,
              "IT",
              1,
            ),

            applyMessage: intl.formatMessage(
              {
                defaultMessage: "Apply to level {number}",
                id: "oKc30q",
                description: "Invitation to apply at a certain level number",
              },
              { number: 1 },
            ),
          },
          {
            title: intl.formatMessage({
              defaultMessage: "Level 2 (Analyst)",
              id: "6dPu0e",
              description: "Title for the 'IT-02 Analyst' classification",
            }),
            description: intl.formatMessage({
              defaultMessage:
                "Analysts (IT-02) provide technical services, advice, analysis, and research in their field of expertise to support service delivery to clients and stakeholders.",
              id: "zZQGWR",
              description: "Description for the 'IT-02 Analyst' classification",
            }),
            poolAdvertisementId: selectPoolIdForSection(
              pools,
              PoolStream.Security,
              "IT",
              2,
            ),

            applyMessage: intl.formatMessage(
              {
                defaultMessage: "Apply to level {number}",
                id: "oKc30q",
                description: "Invitation to apply at a certain level number",
              },
              { number: 2 },
            ),
          },
          {
            title: intl.formatMessage({
              defaultMessage: "Level 3 (Lead/Advisor)",
              id: "MzhP1T",
              description: "Title for the 'IT-03 Advisor' classification",
            }),
            description: intl.formatMessage({
              defaultMessage:
                "IT Technical Advisors (IT-03) provide specialized technical advice, recommendations and support on solutions and services in their field of expertise in support of service delivery.",
              id: "rLmOMp",
              description: "Description for the 'IT-03 Advisor' classification",
            }),
            poolAdvertisementId: selectPoolIdForSection(
              pools,
              PoolStream.Security,
              "IT",
              3,
            ),

            applyMessage: intl.formatMessage(
              {
                defaultMessage: "Apply to level {number}",
                id: "oKc30q",
                description: "Invitation to apply at a certain level number",
              },
              { number: 3 },
            ),
          },
          {
            title: intl.formatMessage({
              defaultMessage: "Level 4 (Manager/Advisor)",
              id: "5qkqv9",
              description: "Title for the 'IT-04 Manager' classification",
            }),
            description: intl.formatMessage({
              defaultMessage:
                "IT Managers (IT-04) are responsible for managing development and delivery of IT services and/or operations through subordinate team leaders, technical advisors, and project teams.",
              id: "v0/leo",
              description: "Description for the 'IT-04 Manager' classification",
            }),
            poolAdvertisementId: selectPoolIdForSection(
              pools,
              PoolStream.Security,
              "IT",
              4,
            ),

            applyMessage: intl.formatMessage(
              {
                defaultMessage: "Apply to level {number}",
                id: "oKc30q",
                description: "Invitation to apply at a certain level number",
              },
              { number: 4 },
            ),
          },
        ],
      },
      // IT software solutions
      {
        key: PoolStream.SoftwareSolutions,
        title: intl.formatMessage({
          defaultMessage: "IT software solutions",
          id: "4CT5zI",
          description: "Title for the 'software solutions' IT work stream",
        }),
        summary: intl.formatMessage({
          defaultMessage:
            "This stream includes programming, systems design and development, business analysis, configuration, testing, and implementation.",
          id: "7KJGSu",
          description: "Title for the 'software solutions' IT work stream",
        }),
        classifications: [
          {
            title: intl.formatMessage({
              defaultMessage: "Level 1 (Technician)",
              id: "UBf9lv",
              description: "Title for the 'IT-01 Technician' classification",
            }),
            description: intl.formatMessage({
              defaultMessage:
                "Technicians (IT-01) provide technical support in the development, implementation, integration, and maintenance of service delivery to clients and stakeholders.",
              id: "T0gN76",
              description:
                "Description for the 'IT-01 Technician' classification",
            }),
            poolAdvertisementId: selectPoolIdForSection(
              pools,
              PoolStream.SoftwareSolutions,
              "IT",
              1,
            ),
            applyMessage: intl.formatMessage(
              {
                defaultMessage: "Apply to level {number}",
                id: "oKc30q",
                description: "Invitation to apply at a certain level number",
              },
              { number: 1 },
            ),
          },
          {
            title: intl.formatMessage({
              defaultMessage: "Level 2 (Analyst)",
              id: "6dPu0e",
              description: "Title for the 'IT-02 Analyst' classification",
            }),
            description: intl.formatMessage({
              defaultMessage:
                "Analysts (IT-02) provide technical services, advice, analysis, and research in their field of expertise to support service delivery to clients and stakeholders.",
              id: "zZQGWR",
              description: "Description for the 'IT-02 Analyst' classification",
            }),
            poolAdvertisementId: selectPoolIdForSection(
              pools,
              PoolStream.SoftwareSolutions,
              "IT",
              2,
            ),
            applyMessage: intl.formatMessage(
              {
                defaultMessage: "Apply to level {number}",
                id: "oKc30q",
                description: "Invitation to apply at a certain level number",
              },
              { number: 2 },
            ),
          },
          {
            title: intl.formatMessage({
              defaultMessage: "Level 3 (Lead/Advisor)",
              id: "MzhP1T",
              description: "Title for the 'IT-03 Advisor' classification",
            }),
            description: intl.formatMessage({
              defaultMessage:
                "IT Technical Advisors (IT-03) provide specialized technical advice, recommendations and support on solutions and services in their field of expertise in support of service delivery.",
              id: "rLmOMp",
              description: "Description for the 'IT-03 Advisor' classification",
            }),
            poolAdvertisementId: selectPoolIdForSection(
              pools,
              PoolStream.SoftwareSolutions,
              "IT",
              3,
            ),
            applyMessage: intl.formatMessage(
              {
                defaultMessage: "Apply to level {number}",
                id: "oKc30q",
                description: "Invitation to apply at a certain level number",
              },
              { number: 3 },
            ),
          },
          {
            title: intl.formatMessage({
              defaultMessage: "Level 4 (Manager/Advisor)",
              id: "5qkqv9",
              description: "Title for the 'IT-04 Manager' classification",
            }),
            description: intl.formatMessage({
              defaultMessage:
                "IT Managers (IT-04) are responsible for managing development and delivery of IT services and/or operations through subordinate team leaders, technical advisors, and project teams.",
              id: "v0/leo",
              description: "Description for the 'IT-04 Manager' classification",
            }),
            poolAdvertisementId: selectPoolIdForSection(
              pools,
              PoolStream.SoftwareSolutions,
              "IT",
              4,
            ),
            applyMessage: intl.formatMessage(
              {
                defaultMessage: "Apply to level {number}",
                id: "oKc30q",
                description: "Invitation to apply at a certain level number",
              },
              { number: 4 },
            ),
          },
        ],
      },
    ],
  };

  return (
    <>
      <Heading
        level="h2"
        Icon={CpuChipIcon}
        color="purple"
        data-h2-margin="base(0, 0, x0.5, 0)"
      >
        {intl.formatMessage({
          defaultMessage: "Apply to ongoing recruitment",
          id: "RBsGRp",
          description: "title for section with ongoing pool advertisements",
        })}
      </Heading>
      <p data-h2-margin="base(x1, 0)" data-h2-font-weight="base(700)">
        {intl.formatMessage({
          id: "2czUAZ",
          defaultMessage:
            "Not seeing an active recruitment that matches your skillset? No problem, we still want to hear from you.",
          description: "summary for section with ongoing pool advertisements",
        })}
      </p>
      <p>
        {intl.formatMessage({
          id: "BWvfeG",
          defaultMessage:
            "We also offer passive recruitment buckets that allow us to find talent fast when the demand arises. While there’s no guarantee a job will result from the opportunities below, it’s an easy way for your name and resume to be found by managers when the time comes. Feel free to submit your name to any bucket that matches your skills.",
          description:
            "instructions for section with ongoing pool advertisements",
        })}
      </p>
      <div data-h2-padding="base(x2, 0, 0, 0) p-tablet(x3, 0, 0, 0)">
        <Accordion.Root
          data-h2-margin="base(0)"
          data-h2-padding="base(0)"
          type="multiple"
        >
          {dataModel.streams
            .filter(
              // filter streams with no classifications with a pool ID to apply to
              (stream) =>
                !!stream.classifications.find(
                  (classification) => classification.poolAdvertisementId,
                ),
            )
            .map((stream) => (
              <Accordion.Item value={stream.key} key={stream.key}>
                <Accordion.Trigger
                  subtitle={stream.summary}
                  data-h2-font-size="base(h4)"
                >
                  {stream.title}
                </Accordion.Trigger>
                <Accordion.Content>
                  <div
                    data-h2-display="base(grid)"
                    data-h2-grid-template-columns="base(1fr) p-tablet(1fr 1fr)"
                    data-h2-gap="base(x.5) p-tablet(x2)"
                    data-h2-align-items="base(center)"
                  >
                    {stream.classifications
                      .filter(
                        // filter classifications with no pool ID to apply to
                        (classification) => classification.poolAdvertisementId,
                      )
                      .map((classification) => (
                        <div
                          key={classification.title}
                          data-h2-padding="base(0,0,x1, 0)"
                        >
                          <h3
                            data-h2-font-size="base(h6)"
                            data-h2-font-weight="base(700)"
                            data-h2-padding="base(0,0,x0.75, 0)"
                          >
                            {classification.title}
                          </h3>
                          <p data-h2-padding="base(0,0,x0.75, 0)">
                            {classification.description}
                          </p>
                          {classification.poolAdvertisementId && (
                            <Link
                              href={paths.pool(
                                classification.poolAdvertisementId,
                              )}
                              color="blue"
                              type="button"
                              mode="solid"
                              data-h2-font-weight="base(700)"
                            >
                              {classification.applyMessage}
                            </Link>
                          )}
                          <p data-h2-padding="base(0,0,x0.75, 0)" />
                        </div>
                      ))}
                  </div>
                </Accordion.Content>
              </Accordion.Item>
            ))}
        </Accordion.Root>
      </div>
    </>
  );
};
