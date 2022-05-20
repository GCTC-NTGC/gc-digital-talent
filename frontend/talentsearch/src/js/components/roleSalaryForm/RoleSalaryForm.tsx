/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from "react";
import { useIntl } from "react-intl";
import { BasicForm, Checklist } from "@common/components/form";
import { SubmitHandler } from "react-hook-form";
import { InformationCircleIcon } from "@heroicons/react/solid";
import { errorMessages } from "@common/messages";
import {
  DialogLevelOne,
  DialogLevelTwo,
  DialogLevelThreeLead,
  DialogLevelThreeAdvisor,
  DialogLevelFourLead,
  DialogLevelFourAdvisor,
} from "./dialogs";
import { UpdateUserAsUserInput, User } from "../../api/generated";
import ProfileFormWrapper from "../applicantProfile/ProfileFormWrapper";
import ProfileFormFooter from "../applicantProfile/ProfileFormFooter";

export type FormValues = Pick<User, "firstName" | "lastName">;

export type RoleSalaryUpdateHandler = (
  id: string,
  data: UpdateUserAsUserInput,
) => void; // replace with Promise<void> when filling API in TODO

export interface RoleSalaryFormProps {
  initialUser?: User | null;
  onUpdateRoleSalary?: RoleSalaryUpdateHandler;
}

export const RoleSalaryForm: React.FunctionComponent<RoleSalaryFormProps> = ({
  initialUser,
  onUpdateRoleSalary,
}) => {
  const intl = useIntl();

  // modal logic section
  const [isDialogLevel1Open, setDialogLevel1Open] =
    React.useState<boolean>(false);
  const [isDialogLevel2Open, setDialogLevel2Open] =
    React.useState<boolean>(false);
  const [isDialogLevel3LeadOpen, setDialogLevel3LeadOpen] =
    React.useState<boolean>(false);
  const [isDialogLevel3AdvisorOpen, setDialogLevel3AdvisorOpen] =
    React.useState<boolean>(false);
  const [isDialogLevel4ManagerOpen, setDialogLevel4ManagerOpen] =
    React.useState<boolean>(false);
  const [isDialogLevel4AdvisorOpen, setDialogLevel4AdvisorOpen] =
    React.useState<boolean>(false);

  // form submit logic, to be filled when API ready TODO
  const initialDataToFormValues = (data?: User | null): FormValues => {
    return {
      firstName: data?.firstName,
      lastName: data?.lastName,
    };
  };
  const formValuesToSubmitData = (data: FormValues): UpdateUserAsUserInput => {
    return {
      firstName: data?.firstName,
      lastName: data?.lastName,
    };
  };
  const handleSubmit: SubmitHandler<FormValues> = async (formValues) => {
    await onUpdateRoleSalary;
    return formValuesToSubmitData(formValues);
  };

  // intl styling functions section
  function bold(msg: string) {
    return <span data-h2-font-weight="b(700)">{msg}</span>;
  }
  function underline(msg: string) {
    return <span data-h2-font-style="b(underline)">{msg}</span>;
  }
  function linkDigitalCommunity(msg: string) {
    return (
      <a href="https://www.canada.ca/en/government/system/digital-government/gcdigital-community/careers-digital.html">
        {msg}
      </a>
    );
  }
  function modalOne(msg: string) {
    return (
      <span
        role="dialog"
        onClick={(e) => {
          setDialogLevel1Open(true);
          e?.preventDefault();
        }}
      >
        {msg}
      </span>
    );
  }
  function modalTwo(msg: string) {
    return (
      <span
        role="dialog"
        onClick={(e) => {
          setDialogLevel2Open(true);
          e?.preventDefault();
        }}
      >
        {msg}
      </span>
    );
  }
  function modalThreeLead(msg: string) {
    return (
      <span
        role="dialog"
        onClick={(e) => {
          setDialogLevel3LeadOpen(true);
          e?.preventDefault();
        }}
      >
        {msg}
      </span>
    );
  }
  function modalThreeAdvisor(msg: string) {
    return (
      <span
        role="dialog"
        onClick={(e) => {
          setDialogLevel3AdvisorOpen(true);
          e?.preventDefault();
        }}
      >
        {msg}
      </span>
    );
  }
  function modalFourManager(msg: string) {
    return (
      <span
        role="dialog"
        onClick={(e) => {
          setDialogLevel4ManagerOpen(true);
          e?.preventDefault();
        }}
      >
        {msg}
      </span>
    );
  }
  function modalFourAdvisor(msg: string) {
    return (
      <span
        role="dialog"
        onClick={(e) => {
          setDialogLevel4AdvisorOpen(true);
          e?.preventDefault();
        }}
      >
        {msg}
      </span>
    );
  }

  // TODO, uncomment after API connected
  // if (!initialUser) {
  //   return (
  //     <p>
  //       {intl.formatMessage({
  //         defaultMessage: "Could not load user.",
  //         description:
  //           "Error message that appears when current user could not be retrieved.",
  //       })}
  //     </p>
  //   );
  // }

  return (
    <ProfileFormWrapper
      title={intl.formatMessage({
        defaultMessage: "Role and Salary Expectations",
        description: "Title role and salary expectations form",
      })}
      description={intl.formatMessage({
        defaultMessage:
          "Government classifications are labels that the Government of Canada uses to group similar types of work. In the Government of Canada salary is tied to how positions are classified.",
        description: "Description for the role and salary expectation form",
      })}
      crumbs={[
        {
          title: intl.formatMessage({
            defaultMessage: "Role and Salary Expectations",
            description: "Label for role and salary link",
          }),
        },
      ]}
    >
      <BasicForm
        onSubmit={handleSubmit}
        options={{
          defaultValues: initialDataToFormValues(initialUser),
        }}
      >
        <p data-h2-margin="b(bottom, l)">
          {intl.formatMessage(
            {
              defaultMessage:
                "This platform is focused on hiring digital talent to work in positions classified as IT(Information Technology). Look at the following levels within the IT classification and <bold>select only</bold> the ones that represent the work you want to do.",
              description: "Blurb describing the purpose of the form",
            },
            { bold },
          )}
        </p>
        <Checklist
          idPrefix="roleSalary"
          legend={intl.formatMessage({
            defaultMessage:
              "I would like to be referred for jobs at the following levels:",
            description: "Legend for role and salary checklist form",
          })}
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
          name="roleSalary"
          items={[
            {
              value: 1,
              label: intl.formatMessage(
                {
                  defaultMessage:
                    "Level 1: Technician ($60,000 to $78,000). <modalOne><underline>Learn about IT-01</underline></modalOne>",
                  description:
                    "Checkbox label for Level IT-01 selection, ignore things in <> tags please",
                },
                { modalOne, underline },
              ),
            },
            {
              value: 2,
              label: intl.formatMessage(
                {
                  defaultMessage:
                    "Level 2: Analyst ($75,000 to $91,000). <modalTwo><underline>Learn about IT-02</underline></modalTwo>",
                  description:
                    "Checkbox label for Level IT-02 selection, ignore things in <> tags please",
                },
                { modalTwo, underline },
              ),
            },
            {
              value: 3,
              label: intl.formatMessage(
                {
                  defaultMessage:
                    "Level 3: Team Leader ($88,000 to $110,000). <modalThreeLead><underline>Learn about IT-03</underline></modalThreeLead>",
                  description:
                    "Checkbox label for Level IT-03 leader selection, ignore things in <> tags please",
                },
                { modalThreeLead, underline },
              ),
            },
            {
              value: 4,
              label: intl.formatMessage(
                {
                  defaultMessage:
                    "Level 3: Technical Advisor ($88,000 to $110,000). <modalThreeAdvisor><underline>Learn about IT-03</underline></modalThreeAdvisor>",
                  description:
                    "Checkbox label for Level IT-03 advisor selection, ignore things in <> tags please",
                },
                { modalThreeAdvisor, underline },
              ),
            },
            {
              value: 5,
              label: intl.formatMessage(
                {
                  defaultMessage:
                    "Level 4: Senior Advisor ($101,000 to $126,000). <modalFourAdvisor><underline>Learn about IT-04</underline></modalFourAdvisor>",
                  description:
                    "Checkbox label for Level IT-04 senior advisor selection, ignore things in <> tags please",
                },
                { modalFourAdvisor, underline },
              ),
            },
            {
              value: 6,
              label: intl.formatMessage(
                {
                  defaultMessage:
                    "Level 4: Manager ($101,000 to $126,000). <modalFourManager><underline>Learn about IT-04</underline></modalFourManager>",
                  description:
                    "Checkbox label for Level IT-04 manager selection, ignore things in <> tags please",
                },
                { modalFourManager, underline },
              ),
            },
          ]}
        />
        <div
          data-h2-bg-color="b(lightgray)"
          data-h2-margin="b(top, m)"
          data-h2-radius="b(s)"
        >
          <p data-h2-padding="b(top-bottom, m) b(left, s)">
            <span>
              <InformationCircleIcon style={{ width: "0.9rem" }} />{" "}
              {intl.formatMessage(
                {
                  defaultMessage:
                    "<linkDigitalCommunity>Click here to learn more about classifications in the Government of Canada's Digital Community.</linkDigitalCommunity>",
                  description: "Link to learn more about classifications",
                },
                { linkDigitalCommunity },
              )}
            </span>
          </p>
        </div>
        <ProfileFormFooter mode="saveButton" />
      </BasicForm>

      <DialogLevelOne
        isOpen={isDialogLevel1Open}
        onDismiss={() => setDialogLevel1Open(false)}
      />
      <DialogLevelTwo
        isOpen={isDialogLevel2Open}
        onDismiss={() => setDialogLevel2Open(false)}
      />
      <DialogLevelThreeLead
        isOpen={isDialogLevel3LeadOpen}
        onDismiss={() => setDialogLevel3LeadOpen(false)}
      />
      <DialogLevelThreeAdvisor
        isOpen={isDialogLevel3AdvisorOpen}
        onDismiss={() => setDialogLevel3AdvisorOpen(false)}
      />
      <DialogLevelFourAdvisor
        isOpen={isDialogLevel4AdvisorOpen}
        onDismiss={() => setDialogLevel4AdvisorOpen(false)}
      />
      <DialogLevelFourLead
        isOpen={isDialogLevel4ManagerOpen}
        onDismiss={() => setDialogLevel4ManagerOpen(false)}
      />
    </ProfileFormWrapper>
  );
};

const RoleSalaryFormContainer: React.FunctionComponent = () => {
  // API logic
  // see AboutForm for further scaffolding
  const handleUpdateUser = (id: string, values: UpdateUserAsUserInput) => {
    return {
      id,
      values,
    };
  };

  return (
    <RoleSalaryForm initialUser={null} onUpdateRoleSalary={handleUpdateUser} />
  );
};

export default RoleSalaryFormContainer;
