import React from "react";
import type { Story } from "@storybook/react";
import { hrefTo } from "@storybook/addon-links";
import UserProfile from "@common/components/UserProfile";
import ExperienceSection from "@common/components/UserProfile/ExperienceSection";
import { fakeUsers } from "@common/fakeData";

import MyStatusApi from "../../myStatusForm/MyStatusForm";

import type { Applicant } from "../../../api/generated";

const fakeUserData = fakeUsers(1)[0];

export default {
  component: UserProfile,
  title: "ApplicantProfile/UserProfile",
};

const Template: Story = () => {
  const [paths, setPaths] = React.useState<Record<string, string> | null>(null);
  const getPaths = React.useCallback(async () => {
    const newPaths = {
      about: await hrefTo("AboutMeForm", "Individual About Me"),
      language: await hrefTo("Language Information Form", "language"),
      government: await hrefTo("Government Info Form", "government"),
      workLocation: await hrefTo("WorkLocationPreferenceForm", "workLocation"),
      workPreferences: await hrefTo("WorkPreferencesForm", "workPreferences"),
      diversityEquityInclusion: await hrefTo(
        "DiversityEquityInclusionForm",
        "diversityEquityInclusion",
      ),
      roleSalary: await hrefTo("Role Salary Expectation Form", "roleSalary"),
      skillsAndExperiences: await hrefTo(
        "Role Salary Expectation Form",
        "skillsAndExperiences",
      ),
    };

    setPaths(newPaths);
  }, []);

  React.useEffect(() => {
    getPaths();
  }, [getPaths]);

  return paths && Object.keys(paths).length ? (
    <UserProfile
      applicant={fakeUserData as Applicant}
      sections={{
        myStatus: { isVisible: true, override: <MyStatusApi /> },
        hiringPools: { isVisible: true },
        about: { isVisible: true, editUrl: paths.about },
        language: { isVisible: true, editUrl: paths.language },
        government: {
          isVisible: true,
          editUrl: paths.government,
        },
        workLocation: { isVisible: true, editUrl: paths.workLocation },
        workPreferences: {
          isVisible: true,
          editUrl: paths.workPreferences,
        },
        employmentEquity: {
          isVisible: true,
          editUrl: paths.diversityEquityInclusion,
        },
        roleSalary: { isVisible: true, editUrl: paths.roleSalary },
        skillsExperience: {
          isVisible: true,
          editUrl: paths.skillsAndExperiences,
          override: (
            <ExperienceSection
              experiences={[]}
              editPath={paths.skillsAndExperiences}
            />
          ),
        },
      }}
    />
  ) : null;
};

export const BasicUserProfile = Template.bind({});
