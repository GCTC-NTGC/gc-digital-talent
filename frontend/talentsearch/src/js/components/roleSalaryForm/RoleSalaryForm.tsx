/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from "react";
import { useIntl } from "react-intl";
import { getLocale } from "@common/helpers/localize";
import { BasicForm, Checklist } from "@common/components/form";
import Dialog from "@common/components/Dialog";
import { SubmitHandler } from "react-hook-form";
import {
  DialogLevelOne,
  DialogLevelTwo,
  DialogLevelThree,
  DialogLevelFour,
} from "./dialogs";
import { UpdateUserAsUserInput, User } from "../../api/generated";
import ProfileFormWrapper from "../applicantProfile/ProfileFormWrapper";
import ProfileFormFooter from "../applicantProfile/ProfileFormFooter";
import applicantProfileRoutes from "../../applicantProfileRoutes";

export type FormValues = Pick<User, "firstName" | "lastName">;

export type RoleSalaryUpdateHandler = (
  id: string,
  data: UpdateUserAsUserInput,
) => void;

export interface RoleSalaryFormProps {
  initialUser?: User | null;
  onUpdateRoleSalary?: RoleSalaryUpdateHandler;
}

export const RoleSalaryForm: React.FunctionComponent<RoleSalaryFormProps> = ({
  initialUser,
  onUpdateRoleSalary,
}) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const paths = applicantProfileRoutes(locale);

  // modal logic section
  const [isDialogLevel1Open, setDialogLevel1Open] =
    React.useState<boolean>(false);
  const [isDialogLevel2Open, setDialogLevel2Open] =
    React.useState<boolean>(false);
  const [isDialogLevel3Open, setDialogLevel3Open] =
    React.useState<boolean>(false);
  const [isDialogLevel4Open, setDialogLevel4Open] =
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
    return formValuesToSubmitData(formValues);
  };

  // intl styling functions section
  function bold(msg: string) {
    return <span data-h2-font-weight="b(700)">{msg}</span>;
  }
  function linkDigitalCommunity(msg: string) {
    return (
      <a href=" https://www.canada.ca/en/government/system/digital-government/gcdigital-community/careers-digital.html">
        {msg}
      </a>
    );
  }
  function modalOne(msg: string) {
    return (
      <span role="dialog" onClick={() => setDialogLevel1Open(true)}>
        {msg}
      </span>
    );
  }
  function modalTwo(msg: string) {
    return (
      <span role="dialog" onClick={() => setDialogLevel2Open(true)}>
        {msg}
      </span>
    );
  }
  function modalThree(msg: string) {
    return (
      <span role="dialog" onClick={() => setDialogLevel3Open(true)}>
        {msg}
      </span>
    );
  }
  function modalFour(msg: string) {
    return (
      <span role="dialog" onClick={() => setDialogLevel4Open(true)}>
        {msg}
      </span>
    );
  }

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
        <p>
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
          idPrefix="placeholder"
          legend={intl.formatMessage({
            defaultMessage:
              "I would like to be referred for jobs at the following levels:",
            description: "Legend for role and salary checklist form",
          })}
          name="placeholder"
          items={[
            {
              value: 1,
              label: intl.formatMessage(
                {
                  defaultMessage:
                    "Level 1: Technician ($60,000 to $78,000). <modalOne>A</modalOne>",
                  description: "one",
                },
                { modalOne },
              ),
            },
            {
              value: 2,
              label: intl.formatMessage(
                {
                  defaultMessage: "Level 2: Analyst ($75,000 to $91,000).",
                  description: "one",
                },
                { modalTwo },
              ),
            },
            {
              value: 3,
              label: intl.formatMessage(
                {
                  defaultMessage: "Level 3: Team Leader ($88,000 to $110,000).",
                  description: "one",
                },
                { modalThree },
              ),
            },
            {
              value: 4,
              label: intl.formatMessage(
                {
                  defaultMessage:
                    "Level 3: Technical Advisor ($88,000 to $110,000).",
                  description: "one",
                },
                { modalThree },
              ),
            },
            {
              value: 5,
              label: intl.formatMessage(
                {
                  defaultMessage:
                    "Level 4: Senior Advisor ($101,000 to $126,000).",
                  description: "one",
                },
                { modalFour },
              ),
            },
            {
              value: 6,
              label: intl.formatMessage(
                {
                  defaultMessage: "Level 4: Manager ($101,000 to $126,000).",
                  description: "one",
                },
                { modalFour },
              ),
            },
          ]}
        />
        <div>
          <p>
            {intl.formatMessage(
              {
                defaultMessage:
                  "<linkDigitalCommunity>Click here to learn more about classifications in the Government of Canada's Digital Community.</linkDigitalCommunity>",
                description: "Link to learn more about classifications",
              },
              { linkDigitalCommunity },
            )}
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
      <DialogLevelThree
        isOpen={isDialogLevel3Open}
        onDismiss={() => setDialogLevel3Open(false)}
      />
      <DialogLevelFour
        isOpen={isDialogLevel4Open}
        onDismiss={() => setDialogLevel4Open(false)}
      />
    </ProfileFormWrapper>
  );
};

const RoleSalaryFormContainer: React.FunctionComponent = () => {
  // API logic
  // see AboutForm for further scaffolding

  const handleUpdateUser = (id: string, values: UpdateUserAsUserInput) => {
    // do nothing
  };

  return (
    <RoleSalaryForm initialUser={null} onUpdateRoleSalary={handleUpdateUser} />
  );
};

export default RoleSalaryFormContainer;
