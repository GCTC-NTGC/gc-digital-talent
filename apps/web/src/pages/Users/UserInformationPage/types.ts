import { Pool, Department, UserInfoFragment } from "@gc-digital-talent/graphql";

export interface BasicUserInformationProps {
  user: UserInfoFragment;
}

export interface UserInformationProps extends BasicUserInformationProps {
  departments?: Department[];
}
