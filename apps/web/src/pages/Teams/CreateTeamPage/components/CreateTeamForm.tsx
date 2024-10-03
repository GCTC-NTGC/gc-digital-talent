import { SubmitHandler } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { useIntl } from "react-intl";
import kebabCase from "lodash/kebabCase";

import { Link } from "@gc-digital-talent/ui";
import { BasicForm, Submit } from "@gc-digital-talent/forms";
import { toast } from "@gc-digital-talent/toast";
import {
  CreateTeamInput,
  CreateTeamMutation,
  FragmentType,
  LocalizedStringInput,
  Maybe,
  Scalars,
  getFragment,
} from "@gc-digital-talent/graphql";

import useRoutes from "~/hooks/useRoutes";

import CreateTeamFormFields from "./CreateTeamFormFields";
import { TeamDepartmentOption_Fragment } from "../../operations";

interface FormValues {
  displayName?: Maybe<LocalizedStringInput>;
  contactEmail?: Maybe<Scalars["Email"]["output"]>;
  departments?: Scalars["UUID"]["output"][];
  description?: Maybe<LocalizedStringInput>;
}

const formValuesToSubmitData = (data: FormValues): CreateTeamInput => {
  const { displayName, contactEmail, departments, description } = data;
  return {
    displayName,
    contactEmail,
    name: kebabCase(displayName?.en ?? ""),
    departments: { sync: departments },
    description,
  };
};

interface CreateTeamFormProps {
  departmentsQuery: FragmentType<typeof TeamDepartmentOption_Fragment>[];
  onSubmit: (
    data: CreateTeamInput,
  ) => Promise<CreateTeamMutation["createTeam"]>;
}

const CreateTeamForm = ({
  departmentsQuery,
  onSubmit,
}: CreateTeamFormProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const navigate = useNavigate();
  const departments = getFragment(
    TeamDepartmentOption_Fragment,
    departmentsQuery,
  );

  const { state } = useLocation();
  const navigateTo = state?.from ?? paths.teamTable();

  const handleSubmit: SubmitHandler<FormValues> = async (data) => {
    return onSubmit(formValuesToSubmitData(data))
      .then(() => {
        navigate(navigateTo);
        toast.success(
          intl.formatMessage({
            defaultMessage: "Team updated successfully!",
            id: "2ni0ia",
            description: "Message displayed after a team is updated",
          }),
        );
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: updating team failed",
            id: "h486wf",
            description: "Messaged displayed after updating team fails",
          }),
        );
      });
  };

  return (
    <BasicForm onSubmit={handleSubmit}>
      <CreateTeamFormFields departments={[...departments]} />
      <div
        data-h2-display="base(flex)"
        data-h2-gap="base(x1)"
        data-h2-align-items="base(center)"
      >
        <Submit
          text={intl.formatMessage({
            defaultMessage: "Create new team",
            id: "WX6NnA",
            description: "Button text for the create team form submit button",
          })}
        />
        <Link mode="inline" color="warning" href={navigateTo}>
          {intl.formatMessage({
            defaultMessage: "Cancel and go back to teams",
            id: "i0IT1I",
            description: "Link text to cancel updating a team",
          })}
        </Link>
      </div>
    </BasicForm>
  );
};

export default CreateTeamForm;
