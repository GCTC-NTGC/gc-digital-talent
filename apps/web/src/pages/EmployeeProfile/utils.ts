import type {
  EmployeeProfileCareerDevelopmentFragment,
  EmployeeProfileCareerObjectiveFragment,
  EmployeeProfileGoalsWorkStyleFragment,
  EmployeeProfileNextRoleFragment,
} from "@gc-digital-talent/graphql";

import {
  hasEmptyRequiredFields as careerDevelopmentHasEmptyRequiredFields,
  hasAllEmptyFields as careerDevelopmentHasAllEmptyFields,
} from "~/validators/employeeProfile/careerDevelopment";
import {
  hasAllEmptyFields as nextRoleHasAllEmptyFields,
  hasEmptyRequiredFields as nextRoleHasEmptyRequiredFields,
} from "~/validators/employeeProfile/nextRole";
import {
  hasAllEmptyFields as careerObjectiveHasAllEmptyFields,
  hasEmptyRequiredFields as careerObjectiveHasEmptyRequiredFields,
} from "~/validators/employeeProfile/careerObjective";
import {
  hasAllEmptyFields as goalsWorkStyleHasAllEmptyFields,
  hasEmptyRequiredFields as goalsWorkStyleHasEmptyRequiredFields,
} from "~/validators/employeeProfile/goalsWorkStyle";

export const getOverallStatus = (
  isVerifiedGovEmployee: boolean,
  careerDevelopment: EmployeeProfileCareerDevelopmentFragment,
  nextRole: EmployeeProfileNextRoleFragment,
  careerObjective: EmployeeProfileCareerObjectiveFragment,
  goalsWorkStyle: EmployeeProfileGoalsWorkStyleFragment,
) => {
  if (!isVerifiedGovEmployee) {
    return "locked";
  }

  if (
    careerDevelopmentHasEmptyRequiredFields(careerDevelopment) ||
    nextRoleHasEmptyRequiredFields(nextRole) ||
    careerObjectiveHasEmptyRequiredFields(careerObjective) ||
    goalsWorkStyleHasEmptyRequiredFields(goalsWorkStyle)
  ) {
    return "error";
  }

  return "success";
};

export const getCareerDevelopmentStatus = (
  isVerifiedGovEmployee: boolean,
  careerDevelopment: EmployeeProfileCareerDevelopmentFragment,
) => {
  if (!isVerifiedGovEmployee) {
    return "locked";
  }

  if (careerDevelopmentHasEmptyRequiredFields(careerDevelopment)) {
    return "error";
  }

  if (careerDevelopmentHasAllEmptyFields(careerDevelopment)) {
    return "optional";
  }

  return "success";
};

export const getNextRoleStatus = (
  isVerifiedGovEmployee: boolean,
  nextRole: EmployeeProfileNextRoleFragment,
) => {
  if (!isVerifiedGovEmployee) {
    return "locked";
  }

  if (nextRoleHasEmptyRequiredFields(nextRole)) {
    return "error";
  }

  if (nextRoleHasAllEmptyFields(nextRole)) {
    return "optional";
  }

  return "success";
};

export const getCareerObjectiveStatus = (
  isVerifiedGovEmployee: boolean,
  careerObjective: EmployeeProfileCareerObjectiveFragment,
) => {
  if (!isVerifiedGovEmployee) {
    return "locked";
  }

  if (careerObjectiveHasEmptyRequiredFields(careerObjective)) {
    return "error";
  }

  if (careerObjectiveHasAllEmptyFields(careerObjective)) {
    return "optional";
  }

  return "success";
};

export const getGoalsWorkStyleStatus = (
  isVerifiedGovEmployee: boolean,
  goalsWorkStyle: EmployeeProfileGoalsWorkStyleFragment,
) => {
  if (!isVerifiedGovEmployee) {
    return "locked";
  }

  if (goalsWorkStyleHasEmptyRequiredFields(goalsWorkStyle)) {
    return "error";
  }

  if (goalsWorkStyleHasAllEmptyFields(goalsWorkStyle)) {
    return "optional";
  }

  return "success";
};
