import React, { useMemo } from "react";
import { useIntl } from "react-intl";
import { getLocale } from "@common/helpers/localize";
import commonMessages from "@common/messages/commonMessages";
import { useLocation } from "@common/helpers/router";
import { notEmpty } from "@common/helpers/util";
import { FromArray } from "@common/types/utilityTypes";
import { Pill } from "@common/components";
import { AllSkillsQuery, useAllSkillsQuery } from "../../api/generated";
import Table, { ColumnsOf } from "../Table";
import DashboardContentContainer from "../DashboardContentContainer";
import { tableEditButtonAccessor } from "../TableEditButton";

type Data = NonNullable<FromArray<AllSkillsQuery["skills"]>>;

export const SkillTable: React.FC<AllSkillsQuery & { editUrlRoot: string }> = ({
  skills,
  editUrlRoot,
}) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const columns = useMemo<ColumnsOf<Data>>(
    () => [
      {
        Header: intl.formatMessage({
          defaultMessage: "ID",
          description: "Title displayed on the Skill table ID column.",
        }),
        accessor: "id",
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Name",
          description: "Title displayed for the skill table Name column.",
        }),
        accessor: (skill) => skill.name?.[locale],
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Description",
          description:
            "Title displayed for the skill table Description column.",
        }),
        accessor: (skill) => skill.description?.[locale],
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Keywords",
          description: "Title displayed for the skill table Keywords column.",
        }),
        accessor: (skill) => {
          if (skill.keywords && skill.keywords.length > 0)
            return skill.keywords.join(", ");
          return "";
        },
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Skill Families",
          description:
            "Title displayed for the skill table Skill Families column.",
        }),
        accessor: (skill) =>
          skill.families?.map((family) => (
            <Pill color="primary" mode="outline" key={family?.key}>
              {family?.name?.[locale]}
            </Pill>
          )),
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Edit",
          description: "Title displayed for the skill table Edit column.",
        }),
        accessor: (skill) => tableEditButtonAccessor(skill.id, editUrlRoot), // callback extracted to separate function to stabilize memoized component
      },
    ],
    [editUrlRoot, intl, locale],
  );

  const data = useMemo(() => skills.filter(notEmpty), [skills]);

  return <Table data={data} columns={columns} />;
};

export const SkillTableApi: React.FunctionComponent = () => {
  const intl = useIntl();
  const [result] = useAllSkillsQuery();
  const { data, fetching, error } = result;
  const { pathname } = useLocation();

  if (fetching)
    return (
      <DashboardContentContainer>
        <p>{intl.formatMessage(commonMessages.loadingTitle)}</p>
      </DashboardContentContainer>
    );
  if (error)
    return (
      <DashboardContentContainer>
        <p>
          {intl.formatMessage(commonMessages.loadingError)}
          {error.message}
        </p>
      </DashboardContentContainer>
    );

  return <SkillTable skills={data?.skills ?? []} editUrlRoot={pathname} />;
};
